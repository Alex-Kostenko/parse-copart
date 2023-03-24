import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/* eslint-disable */
require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      url: this.getValue('DATABASE_URL'),
      password: this.getValue('DATABASE_PASSWORD'),
      synchronize: true,
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'DATABASE_URL',
  'DATABASE_PASSWORD',
]);

export { configService };
