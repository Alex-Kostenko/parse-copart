import { BadRequestException, Injectable } from '@nestjs/common';
import puppeteer, { Browser, Page } from 'puppeteer';
import { parseCsv } from './utils/csv.parser';

import { sleep } from './utils/sleep.util';
import { CarsRepository } from 'src/cars/cars.repository';
import { CarEntity } from 'src/cars/entities/car.entity';
import { COPART_SELECTORS } from 'src/core/constants/selector';
import { findPrice } from './utils/get-number.util';
import { IPositiveRequest } from 'src/core/types/main';
import * as path from 'path';
import * as fs from 'fs';
import { MIN_YEAR } from './constants/main';

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
    const date = new Date();

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        throw err;
      }

      if (files.length) {
        files.forEach((file: string, index: number) => {
          const sourcePath = path.join(directoryPath, file);

          const destPath = path.join(
            archiveDirectoryPath,
            date.toISOString() + `(${index + 1})`,
          );

          fs.rename(sourcePath, destPath, (err) => {
            if (err) {
              throw err;
            }
          });
        });
      }
    });

    const browser = await this.makeFakeAgent();
    await this.scrapeTodaysCars(browser);
    await browser.close();

    const filesAmount = fs.readdirSync(directoryPath).length;
    for (let i = 0; i < filesAmount; i++) {
      await sleep(i * 1000);
    }

    return { success: true };
  }

  async parseCars(): Promise<IPositiveRequest> {
    const browser = await this.makeFakeAgent();
    await this.parseCarObjects(browser);
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

  private async goToSearchPage(page: Page, year: number) {
    const { fromDateSelect, toDateSelect, applyButton } =
      COPART_SELECTORS.searchPage;
    const {
      datePickerPanel,
      startDatePicker,
      currentDay,
      currentDaySpan,
      endDatePicker,
      exportCSVButton,
    } = COPART_SELECTORS.filters;

    //YEAR filter
    await sleep(3000);

    await page.waitForSelector(fromDateSelect);
    const yearDropdownStart = await page.$(fromDateSelect);
    await yearDropdownStart.click({
      offset: {
        x: 20,
        y: 8,
      },
    });
    await sleep(3000);
    await page.waitForSelector(`li[aria-label="${year}"]`);
    await page.click(`li[aria-label="${year}"]`);

    await sleep(3000);
    await page.waitForSelector(toDateSelect);
    const yearDropdownEnd = await page.$(toDateSelect);
    await yearDropdownEnd.click({
      offset: {
        x: 20,
        y: 8,
      },
    });

    await sleep(500);
    await page.waitForSelector(`li[aria-label="${year}"]`);
    await page.click(`li[aria-label="${year}"]`);

    await sleep(300);
    await page.click(applyButton);

    //Date picker
    await page.waitForSelector(datePickerPanel);
    const saleDataPanel = await page.$(datePickerPanel);

    await saleDataPanel.click({
      offset: {
        x: 0,
        y: 0,
      },
    });

    await sleep(3000);
    await page.waitForSelector(startDatePicker);
    const inputStartDate = await page.$(startDatePicker);

    await inputStartDate.click({
      offset: {
        x: 8,
        y: 8,
      },
    });
    await sleep(2000);
    await page.waitForSelector(currentDay);
    const datepickerStart = await page.$(currentDaySpan);
    await datepickerStart.click();

    await sleep(5000);

    await page.waitForSelector(endDatePicker);
    const inputEndDate = await page.$(endDatePicker);
    await inputEndDate.click({
      offset: {
        x: 8,
        y: 8,
      },
    });

    await sleep(2000);
    await page.waitForSelector(currentDay);
    const datepickerEnd = await page.$(currentDay);
    await datepickerEnd.click();

    await sleep(5000);

    await page.waitForSelector(exportCSVButton);
    await page.click(exportCSVButton);
    await sleep(5000);
  }

  async scrapeTodaysCars(browser: any) {
    const baseUrl = process.env.COPART_CATALOG;
    const loginCopart = process.env.COPART_LOGIN;
    const directoryPath = process.env.PATH_TO_SAVE_SCV;

    const currentYear = new Date().getFullYear();

    const years = Array.from(
      { length: currentYear - MIN_YEAR + 1 },
      (_, i) => currentYear - i,
    );

    const page = await browser.newPage();

    const client = await page.target().createCDPSession();
    await client.send('Page.setDownloadBehavior', {
      behavior: 'allowAndName',
      downloadPath: directoryPath,
    });

    await page.goto(loginCopart, { waitUntil: 'domcontentloaded' });
    await this.goToLoginPage(page);

    for (let year of years) {
      await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
      await this.goToSearchPage(page, year);
    }

    await page.close();
    fs.readdir(directoryPath, async (err, files: string[]) => {
      if (err) {
        console.log(`Error reading directory: ${err}`);
      }

      for (let i = 0; i < files.length; i++) {
        const filePath = `${directoryPath}/${files[i]}`;
        await this.saveCars(filePath, i, this.carRepository);
      }
    });
  }

  async saveCars(filePath: string, i: number, carRepository: CarsRepository) {
    return new Promise<void>(function (resolve, reject) {
      setTimeout(async () => {
        await parseCsv(filePath)
          .then(async (results) => {
            await carRepository.saveAll(results);
            resolve();
          })
          .catch((error) => {
            reject(new BadRequestException(error));
          });
      }, i * 500);
    });
  }

  async parseCarObjects(browser: any) {
    let page = 1;
    const pageSize = 20;
    const totalPages = Math.ceil(
      (await this.carRepository.getTotalAmout()) / pageSize,
    );
    const browserPage = await browser.newPage();
    console.log(totalPages, 'totalPages');

    do {
      const cars = await this.carRepository.findAllPaginate(page, pageSize);
      await sleep(500);
      console.log('Page', page);

      for (let i = 0; i < cars.length; i++) {
        await browserPage.goto(cars[i].lot_url, {
          waitUntil: 'domcontentloaded',
        });

        this.writeScriptDetails(page, cars[i].lot_id);
        console.log('Lot id: ', cars[i].lot_id);
        const start = Date.now();
        console.log('----script starts----');
        if (cars[i].lot_url) {
          try {
            await this.scrapeOneCar(browserPage, cars[i]);
          } catch {
            console.log(cars[i].lot_url, ' ERROR');
            continue;
          }
        }
        const end = Date.now();
        console.log('----script ends----');
        console.log(`Execution time: ${end - start} ms`);
      }
      page++;
    } while (page < totalPages);
  }

  async scrapeOneCar(page: any, car: CarEntity) {
    const {
      imageGalary,
      images,
      autohelperbot,
      autohelperbotChilds,
      vin,
      auctionFees,
      carCost,
      lotInformationBlock,
      carColor,
      fuel,
      highlightsXPath,
      transmissionXPath,
      drive,
      secondaryDamage,
      notes,
      key,
    } = COPART_SELECTORS.scrapeOneCar;
    // images
    try {
      await page.waitForSelector(images);
      const imageGalaryBlock = await page.$(imageGalary);
      const imagesLinks = await imageGalaryBlock.$$eval(
        images,
        (elements: HTMLImageElement[]) =>
          elements.map((el) => {
            const fullUrl = el.getAttribute('full-url');
            if (fullUrl !== null && fullUrl !== undefined) {
              return fullUrl;
            }
          }),
      );
      car.images = imagesLinks;

      await page.waitForSelector(autohelperbotChilds);
      const autohelperbotBlock = await page.$(autohelperbot);
      //vin
      await autohelperbotBlock.waitForSelector(vin);
      car.vin = await autohelperbotBlock.$eval(vin, (element: HTMLElement) =>
        element ? element.innerText : '',
      );

      //auction_fees
      const auctionFeesEL = await autohelperbotBlock.$eval(
        auctionFees,
        (element: HTMLElement) => (element ? element.innerText : ''),
      );

      car.auction_fees = findPrice(auctionFeesEL);

      //car_cost
      car.car_cost = await autohelperbotBlock.$eval(
        carCost,
        (element: HTMLInputElement) => (element ? element.value : ''),
      );

      await page.waitForSelector(lotInformationBlock);
      const lotInformation = await page.$(lotInformationBlock);

      //color
      car.color = await lotInformation.$eval(carColor, (element: HTMLElement) =>
        element ? element.innerText : '',
      );

      //fuel
      car.fuel = await lotInformation.$eval(fuel, (element: HTMLElement) =>
        element ? element.innerText : '',
      );

      //highlights
      const highlightsElement = await lotInformation.$x(highlightsXPath);
      car.highlights = highlightsElement.length
        ? (
            await highlightsElement[0].evaluate(
              (el: HTMLElement) => el.innerText,
            )
          ).trim()
        : '';

      //transmission
      const transmissionElement = await lotInformation.$x(transmissionXPath);
      car.transmission = transmissionElement.length
        ? await transmissionElement[0].evaluate(
            (el: HTMLElement) => el.innerText,
          )
        : '';

      //drive
      car.drive = await lotInformation.$eval(drive, (element: HTMLElement) =>
        element ? element.innerText : '',
      );

      //secondary_damage
      car.secondary_damage = await lotInformation.$eval(
        secondaryDamage,
        (element: HTMLElement) => (element ? element.innerText : ''),
      );

      //notes
      car.notes = await lotInformation.$eval(notes, (element: HTMLElement) =>
        !element || element.innerText === 'There are no Notes for this Lot'
          ? ''
          : element.innerText,
      );

      //key
      car.key = await lotInformation.$eval(key, (element: HTMLElement) =>
        element ? element.innerText : '',
      );

      car.title = `${car.year} ${car.make} ${car.model}`;

      await this.carRepository.saveOne(car);
    } catch {
      throw new BadRequestException('Failed to scrape car');
    }
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
}
