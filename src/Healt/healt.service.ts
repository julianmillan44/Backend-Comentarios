import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
export class HealthService {
  constructor(
    @InjectConnection() private connection: Connection,
  ) {}

  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: this.connection.readyState === 1 ? 'connected' : 'disconnected',
    };
  }

  async checkDatabase() {
    try {
      const isConnected = this.connection.readyState === 1;
      return {
        status: isConnected ? 'ok' : 'error',
        database: {
          status: isConnected ? 'connected' : 'disconnected',
          name: this.connection.db?.databaseName || 'unknown',
          host: this.connection.host,
          port: this.connection.port,
        },
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'error',
        database: {
          status: 'error',
          error: error.message,
        },
        timestamp: new Date().toISOString(),
      };
    }
  }
}