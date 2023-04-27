import { BadRequestException, Injectable } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import * as fs from 'fs';
import * as path from 'path';

import { parseCsv } from './utils/csv.parser';
import { sleep } from './utils/sleep.util';
import { CarsRepository } from 'src/cars/cars.repository';
import { COPART_SELECTORS } from 'src/utils/constants/selector';
import { IPositiveRequest } from 'src/utils/types';
import { pageSize } from 'src/utils/constants/main';

@Injectable()
export class ParserService {
  constructor(private carRepository: CarsRepository) {}

  async makeFakeAgent(): Promise<Browser> {
    const { loadExtension, disableExtension } = COPART_SELECTORS.autohelperbot;

    const fakeUserAgentChrome = COPART_SELECTORS.fakeUserAgent;
    return await puppeteer.launch({
      headless: false,
      ignoreHTTPSErrors: true,
      defaultViewport: null,
      args: [
        `--user-agent=${fakeUserAgentChrome}`,
        disableExtension,
        loadExtension,
      ],
    });
  }

  async parseCSVs(): Promise<IPositiveRequest> {
    const directoryPath = process.env.PATH_TO_SAVE_SCV;
    const archiveDirectoryPath = process.env.PATH_TO_ARCHIVE_SCV;
    const downloadSalesData = process.env.PATH_TO_DOWNLOAD_SALES_DATA;
    const loginCopart = process.env.COPART_LOGIN;
    const date = new Date();

    const sourcePath = directoryPath + '/salesdata.csv';
    const destPath = path.join(archiveDirectoryPath, date.toISOString());
    fs.rename(sourcePath, destPath, (err) => {
      if (err) {
        throw err;
      }
    });

    const browser = await this.makeFakeAgent();
    const page = await browser.newPage();
    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: directoryPath,
    });
    await page.setBypassCSP(true);
    await page.goto(loginCopart, { waitUntil: 'domcontentloaded' });

    await this.goToLoginPage(page);

    await page.goto(downloadSalesData, { waitUntil: 'domcontentloaded' });

    await page.waitForSelector('[ng-click="downloadCSV()"]');

    page.click('[ng-click="downloadCSV()"]');

    await this.waitUntilDownload(page, 'salesdata.csv');

    await sleep(100);

    await parseCsv(directoryPath + '/salesdata.csv')
      .then(async (results) => {
        await this.carRepository.saveAll(results);
      })
      .catch((error) => {
        console.log(error);
      });

    await browser.close();
    return { success: true };
  }

  private async goToLoginPage(page: Page) {
    const { username, password, loginButton, completeRegistration } =
      COPART_SELECTORS.authorization;
    const copartEmail = process.env.COPART_ACCOUNT_EMAIL;
    const copartPassword = process.env.COPART_ACCOUNT_PASSWORD;

    await page.waitForSelector(username);
    const usernameEL = await page.$(username);
    await usernameEL.type(copartEmail);

    await page.waitForSelector(password);
    const passwordEL = await page.$(password);
    await passwordEL.type(copartPassword);

    await page.waitForSelector(loginButton);
    await page.click(loginButton);
    await sleep(3000);

    try {
      await page.waitForSelector(completeRegistration);
      const close = await page.$(completeRegistration);
      await close.click();
    } catch (err) {
      console.log(err);
    }
  }

  async getToken(page: Page) {
    const { token } = COPART_SELECTORS;
    const serchToken = await page.$$eval('script', (nodes) => {
      const el = nodes.find((n) => n.text.includes(token));
      const index = el.text.lastIndexOf(token) + token.length;
      const serchToken = el.text.substring(index + 3, index + 39);
      return serchToken;
    });
    return serchToken;
  }

  async updateLotFinalBid() {
    const loginCopart = process.env.COPART_LOGIN;
    const getBidDetails = process.env.GET_BID_DETAILS;
    const watchlist = process.env.PATH_TO_WATCHLIST;
    const browser = await this.makeFakeAgent();
    const page = await browser.newPage();

    await page.goto(loginCopart, { waitUntil: 'domcontentloaded' });
    await this.goToLoginPage(page);
    await page.goto(watchlist, {
      waitUntil: 'domcontentloaded',
    });

    const token = await this.getToken(page);
    const totalLots = await this.carRepository.getLotsNumber();

    const pages = Math.ceil(totalLots / pageSize);
    const promises = Array.from({ length: pages }, (_, i) => 0 + i).map(
      (pageNumber) => {
        return this.saveFromBidDetails(getBidDetails, token, page, pageNumber);
      },
    );

    try {
      await Promise.all(promises);
    } catch (err) {
      throw new BadRequestException(err);
    }
    await browser.close();

    return { success: true };
  }

  async saveFromBidDetails(
    url: string,
    token: string,
    page: Page,
    pageNumber: number,
  ) {
    const searchLots = await this.carRepository.getLotArray(pageNumber);

    const body = {
      lots: searchLots,
    };

    const carObject = await page.evaluate(
      async (url: string, token: string, body: any) => {
        return new Promise((resolve) => {
          let xhr = new XMLHttpRequest();
          xhr.open('POST', url);
          xhr.setRequestHeader(
            'Content-type',
            'application/json; charset=utf-8',
          );
          xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
          xhr.setRequestHeader('x-xsrf-token', token);
          xhr.send(JSON.stringify(body));
          xhr.onload = () => {
            resolve(xhr.responseText);
          };
        });
      },
      url,
      token,
      body,
    );

    const { data } = JSON.parse(carObject as string);

    const updateLots = data.map(({ bidStatus, lotNumber, currentBid }) => {
      if (currentBid) {
        return {
          lot_id: String(lotNumber),
          car_cost: currentBid,
          sale_status: bidStatus,
        };
      } else {
        return {
          lot_id: String(lotNumber),
          sale_status: bidStatus,
        };
      }
    });

    await this.carRepository.updateCars(updateLots);
  }

  async waitUntilDownload(page: any, fileName: string) {
    return new Promise((resolve, reject) => {
      page._client().on('Page.downloadProgress', (e: { state: string }) => {
        if (e.state === 'completed') {
          resolve(fileName);
        } else if (e.state === 'canceled') {
          reject();
        }
      });
    });
  }
}
