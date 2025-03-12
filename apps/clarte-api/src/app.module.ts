import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Word } from './modules/ipa/entities/word.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 7777,
      username: 'bitravage',
      password: '693721',
      database: 'clarte',
      entities: [Word],
      synchronize: true, // do not use this in production
      retryAttempts: 10,
      retryDelay: 5000,
      autoLoadEntities: false,
      migrations: ['src/database/migrations/*.ts'],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
