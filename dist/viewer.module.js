var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var WinstonViewerModule_1;
import { Global, Module } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { buildWinstonTransports } from './logger.factory.js';
import { LogsController } from './logs.controller.js';
import { LogReaderService } from './log-reader.service.js';
let WinstonViewerModule = WinstonViewerModule_1 = class WinstonViewerModule {
    static forRoot(options = {}) {
        const { routeBase = '/logs', filesDir = './logs', auth = null, logger = {}, } = options;
        const optionsProvider = {
            provide: 'WINSTON_VIEWER_OPTIONS',
            useValue: { routeBase, filesDir, auth },
        };
        return {
            module: WinstonViewerModule_1,
            imports: [
                // Register Winston for the entire app
                WinstonModule.forRoot(buildWinstonTransports({ dir: filesDir, ...logger })),
            ],
            controllers: [LogsController],
            providers: [LogReaderService, optionsProvider],
            exports: [WinstonModule],
        };
    }
};
WinstonViewerModule = WinstonViewerModule_1 = __decorate([
    Global(),
    Module({})
], WinstonViewerModule);
export { WinstonViewerModule };
