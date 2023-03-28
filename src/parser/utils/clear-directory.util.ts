import * as fs from 'fs';
import * as path from 'path';

export const clearDirectory = (directoryPath: string) => {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    fs.unlinkSync(filePath);
  }
};
