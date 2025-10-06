import { DynamicModule } from '@nestjs/common';
import { CreateLoggerOptions } from './logger.factory.js';
export type ViewerModuleOptions = {
    routeBase?: string;
    filesDir?: string;
    auth?: {
        username: string;
        password: string;
    } | null;
    logger?: CreateLoggerOptions;
};
export declare class WinstonViewerModule {
    static forRoot(options?: ViewerModuleOptions): DynamicModule;
}
