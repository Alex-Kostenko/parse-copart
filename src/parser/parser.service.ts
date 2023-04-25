// @ts-nocheck
import puppeteer, { Browser, Page } from 'puppeteer';
import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

import { parseCsv } from './utils/csv.parser';
import { CarsRepository } from 'src/cars/cars.repository';
import { IPositiveRequest } from 'src/core/types/main';
import { COPART_SELECTORS } from 'src/core/constants/selector';
import { sleep } from './utils/sleep.util';
import { UpdateCarDto } from 'src/cars/dto/update-car.dto';
import { rejects } from 'assert';

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

  async watchlist() {
    const addwatchlistUrl = process.env.PATH_ADD_TO_WATCHLIST;
    const loginCopart = process.env.COPART_LOGIN;
    const copartCatalog = process.env.COPART_CATALOG;

    const browser = await this.makeFakeAgent();
    const page = await browser.newPage();
    await page.setBypassCSP(true);
    await page.goto(loginCopart, { waitUntil: 'domcontentloaded' });

    await this.goToLoginPage(page);

    await page.goto(copartCatalog, {
      waitUntil: 'domcontentloaded',
    });

    const token = await this.getToken(page);

    await this.addCarsToWatchList(addwatchlistUrl, token, page);
    await sleep(50000000);

    await browser.close();
  }

  async writeScriptDetails(page: number, lot_url: string) {
    const pathToSaveParserStatus = process.env.PATH_TO_SAVE_PARSER_STATUS;
    const content = `Page: ${page}\nLot url: ${lot_url}`;
    fs.writeFile(pathToSaveParserStatus, content, { flag: 'w+' }, (err) => {
      if (err) {
        console.error(err);
      }
    });
  }

  async addCarsToWatchList(url: string, token: string, page: Page) {
    const searchCars = await this.carRepository.getAll();

    for (const car of searchCars) {
      await page.evaluate(
        async (url, responseText) => {
          await fetch(url, {
            method: 'POST',
            body: '{}',
            headers: {
              'x-requested-with': 'XMLHttpRequest',
              'x-xsrf-token': responseText,
            },
          });
        },
        url + car.lot_id,
        token,
      );

      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  async getToken(page: Page) {
    const token = await page.$$eval('script', (nodes) => {
      const el = nodes.find((n) => n.text.includes('csrfToken'));
      const index = el.text.lastIndexOf('csrfToken') + 'csrfToken'.length;

      const token = el.text.substring(index + 3, index + 39);

      return token;
    });
    return token;
  }

  async updateLotFinalBid() {
    const browser = await this.makeFakeAgent();
    const page = await browser.newPage();
    const loginCopart = process.env.COPART_LOGIN;
    const getLotDetails = process.env.GET_LOT_DETAILS;
    const watchlist = process.env.PATH_TO_WATCHLIST;

    await page.goto(loginCopart, { waitUntil: 'domcontentloaded' });

    await this.goToLoginPage(page);

    await page.goto(watchlist, {
      waitUntil: 'domcontentloaded',
    });

    const token = await this.getToken(page);

    const searchCars = await this.carRepository.getAll();

    for (const car of searchCars) {
      const lotUrl = getLotDetails + car.lot_id;
      await this.getFinalBid(lotUrl, token, page);
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    await sleep(50000000);
  }

  async getFinalBid(url: string, token: string, page: Page) {
    const updateCar = new UpdateCarDto();

    const carObject = await page.evaluate(
      async (url, token) => {
        return await new Promise((resolve) => {
          let xhr = new XMLHttpRequest();
          xhr.open('GET', url);
          xhr.setRequestHeader(
            'Content-type',
            'application/json; charset=utf-8',
          );
          xhr.setRequestHeader('x-requested-with', 'XMLHttpRequest');
          xhr.setRequestHeader('x-xsrf-token', token);
          xhr.send();
          xhr.onload = () => {
            resolve(xhr.responseText);
          };
          xhr.onerror = () => {
            reject(xhr.responseText);
          };
        });
      },
      url,
      token,
    );

    const { data } = JSON.parse(carObject);
    const newSaleStatus = data.lotDetails.dynamicLotDetails.saleStatus;
    const finalBid: number = data.lotDetails.dynamicLotDetails.currentBid;
    const lotNumber: string = data.lotDetails.lotNumberStr;

    updateCar.sale_status = newSaleStatus;
    if (finalBid && newSaleStatus === 'ON_APPROVAL') {
      updateCar.car_cost = finalBid;
    }

    console.log(
      'finalBid:',
      finalBid,
      '  lotNumber:',
      lotNumber,
      'saleStatus: ',
      newSaleStatus,
    );

    await this.carRepository.updateCar(lotNumber, updateCar);
  }

  async waitUntilDownload(page, fileName = '') {
    return new Promise((resolve, reject) => {
      page._client().on('Page.downloadProgress', (e) => {
        if (e.state === 'completed') {
          resolve(fileName);
        } else if (e.state === 'canceled') {
          reject();
        }
      });
    });
  }
}
