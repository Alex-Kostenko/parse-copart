export const CopartSelectors = {
  authorization: {
    username: 'input#username',
    password: 'input#password',
    loginButton: 'button[data-uname="loginSigninmemberbutton"]',
    completeRegistration: '#modal-COMPLETE_REGISTRATION button.close',
  },
  fakeUserAgent:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36',
  autohelperbot: {
    loadExtension: `--load-extension=./autoHelperBot`,
    disableExtension: `--disable-extensions-except=./autoHelperBot`,
  },
  token: 'csrfToken',
  salesData: {
    fileName: 'salesdata.csv',
    downloadButton: '[ng-click="downloadCSV()"]',
  },
};
