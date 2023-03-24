const fs = require('fs');
const path = require('path');

export const clearDirectory = (directoryPath: string) => {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    fs.unlinkSync(filePath);
  }
};
