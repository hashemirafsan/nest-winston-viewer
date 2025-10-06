import 'winston-daily-rotate-file';
export type CreateLoggerOptions = {
    dir?: string;
    level?: string;
    maxFiles?: string;
    json?: boolean;
};
export declare function buildWinstonTransports(opts?: CreateLoggerOptions): {
    level: string;
    transports: any[];
};
