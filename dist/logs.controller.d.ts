import { Response, Request } from 'express';
import { LogReaderService } from './log-reader.service.js';
type Options = {
    routeBase: string;
    filesDir: string;
    auth: {
        username: string;
        password: string;
    } | null;
};
export declare class LogsController {
    private readonly reader;
    private readonly opts;
    private html;
    constructor(reader: LogReaderService, opts: Options);
    ui(req: Request, res: Response): void;
    dates(req: Request): Promise<string[]>;
    query(req: Request, q: any): Promise<{
        page: number;
        pageSize: number;
        total: number;
        rows: any[];
    }>;
}
export {};
