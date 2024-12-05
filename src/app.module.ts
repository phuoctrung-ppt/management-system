import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { CacheModule } from './modules/cache/cache.module';
import { DatabaseModule } from './configs/database.module';
import { TerminusModule } from '@nestjs/terminus';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule,
    DatabaseModule,
    TerminusModule,
  ],
  controllers: [AppController],
  providers: [ AppService],
})
export class AppModule {}