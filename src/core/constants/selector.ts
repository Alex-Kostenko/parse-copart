export const COPART_SELECTORS = {
  authorization: {
    username: 'input#username',
    password: 'input#password',
    loginButton: 'button[data-uname="loginSigninmemberbutton"]',
    completeRegistration: '#modal-COMPLETE_REGISTRATION button.close',
  },
  searchPage: {
    fromDateSelect: 'p-dropdown[name="fromYearQuery"]',
    toDateSelect: 'p-dropdown[name="toYearQuery"]',
    applyButton: '.btn-green',
  },
  filters: {
    datePickerPanel: '#p-panel-16',
    startDatePicker: 'p-calendar.start-date',
    currentDay: '.p-datepicker-today',
    currentDaySpan: '.p-datepicker-today span',
    endDatePicker: 'p-calendar.end-date',
    exportCSVButton: 'button.export-csv-button',
  },
  scrapeOneCar: {
    imageGalary: '.image-galleria_wrap',
    images: '.thumbnailImg',
    fullImagePath: 'full-url',
    autohelperbot: '#autohelperbot_details',
    vin: '.right_box',
    auctionFees: '.copart_commission',
    carCost: '.lot_price_data',
    lotInformationBlock: '.lot-information',
    carColor: '[data-uname="lotdetailColorvalue"]',
    fuel: '[data-uname="lotdetailFuelvalue"]',
    highlightsXPath:
      "//label[contains(text(), 'Highlights:')]/following-sibling::span",
    transmissionXPath:
      "//label[contains(text(), 'Transmission:')]/following-sibling::span[@class='lot-details-desc']",
    drive: '[data-uname="DriverValue"]',
    secondaryDamage: '[data-uname="lotdetailSecondarydamagevalue"]',
    notes: '[data-uname="lotdetailNotesvalue"]',
    noNotesText: 'There are no Notes for this Lot',
    key: '[data-uname="lotdetailKeyvalue"]',
  },
  fakeUserAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
  autohelperbot: {
    loadExtension: `--load-extension=./autoHelperBot`,
    disableExtension: `--disable-extensions-except=./autoHelperBot`,
  },
};
