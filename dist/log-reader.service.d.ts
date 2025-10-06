export type QueryParams = {
    date: string;
    q?: string;
    level?: string;
    page?: number;
    pageSize?: number;
};
export declare class LogReaderService {
    listAvailableDates(dir: string): Promise<string[]>;
    private filePath;
    query(dir: string, p: QueryParams): Promise<{
        page: number;
        pageSize: number;
        total: number;
        rows: any[];
    }>;
}
