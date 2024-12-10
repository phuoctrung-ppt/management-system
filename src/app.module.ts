import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import configuration from 'config/configuration';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './configs/database.module';
import { CacheModule } from './modules/cache/cache.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { ApplicantsModule } from './modules/applicants/applicants.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule,
    DatabaseModule,
    TerminusModule,
    UsersModule,
    AuthModule,
    JobsModule,
    ApplicantsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
