import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IpaModule } from './modules/ipa/ipa.module';
import { DictionaryModule } from './modules/dictionary/dictionary.module';
import { dataSourceOptions } from './datasources/postgresLocalDatasource';
import { ConfigModule } from '@nestjs/config';
import { SeedingModule } from './modules/seeding/seeding.module';

@Module({
  imports: [
    // Optional: Load environment variables globally using NestJS ConfigModule
    // This is often preferred over 'dotenv/config' in datasource.ts for NestJS apps
    // Make sure ConfigModule is imported BEFORE TypeOrmModule if TypeOrmModule relies on env vars
    ConfigModule.forRoot({
      isGlobal: true, // Makes .env variables available throughout the application
      envFilePath: ['.env.dev.local', '.env'],
    }),
    // Once this (this forRoot) is done, the TypeORM DataSource and EntityManager objects will be available to inject across the entire project (without needing to import any modules), Ref: https://docs.nestjs.com/techniques/database
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      entities: undefined,
      migrations: undefined,
      autoLoadEntities: true,
    }),
    // Feature Modules (these likely provide the entities/repos used in seeding)
    IpaModule,
    DictionaryModule,
    SeedingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
