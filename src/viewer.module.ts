import { DynamicModule, Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { buildWinstonTransports, CreateLoggerOptions } from './logger.factory.js';
import { LogsController } from './logs.controller.js';
import { LogReaderService } from './log-reader.service.js';

export type ViewerModuleOptions = {
  routeBase?: string; // default '/logs'
  filesDir?: string;  // default './logs'
  auth?: { username: string; password: string } | null; // basic auth or null
  logger?: CreateLoggerOptions; // forwarded to file rotation config
};

@Global()
@Module({})
export class WinstonViewerModule {
  static forRoot(options: ViewerModuleOptions = {}): DynamicModule {
    const {
      routeBase = '/logs',
      filesDir = './logs',
      auth = null,
      logger = {},
    } = options;

    const optionsProvider = {
      provide: 'WINSTON_VIEWER_OPTIONS',
      useValue: { routeBase, filesDir, auth },
    };

    return {
      module: WinstonViewerModule,
      imports: [
        // Register Winston for the entire app
        WinstonModule.forRoot(buildWinstonTransports({ dir: filesDir, ...logger })),
      ],
      controllers: [LogsController],
      providers: [LogReaderService, optionsProvider],
      exports: [WinstonModule],
    };
  }
}
