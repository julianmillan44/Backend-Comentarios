import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { HealthService } from '.Healt/health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiResponse({ status: 200, description: 'Health check endpoint' })
  check() {
    return this.healthService.check();
  }

  @Get('database')
  @ApiResponse({ status: 200, description: 'Database health check' })
  checkDatabase() {
    return this.healthService.checkDatabase();
  }
}