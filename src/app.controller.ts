import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './decorators/public-route';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  @Public()
  @Get('health')
  async healthCheck(): Promise<Record<string, unknown>> {
    const result = await this.appService.healthCheck();
    return {
      detail: {
        ...result.details,
      },
      status: result.status,
    };
  }
}
