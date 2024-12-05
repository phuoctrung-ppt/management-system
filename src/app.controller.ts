import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

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
