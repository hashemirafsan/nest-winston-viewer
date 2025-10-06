var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable, NotFoundException } from '@nestjs/common';
import { createReadStream, promises as fs } from 'fs';
import * as path from 'path';
import * as readline from 'readline';
let LogReaderService = class LogReaderService {
    async listAvailableDates(dir) {
        const files = await fs.readdir(dir).catch(() => []);
        return files
            .filter(f => /^app-\d{4}-\d{2}-\d{2}\.log$/.test(f))
            .map(f => f.slice(4, 14)) // 'app-YYYY-MM-DD.log' -> 'YYYY-MM-DD'
            .sort()
            .reverse();
    }
    filePath(dir, date) {
        return path.join(dir, `app-${date}.log`);
    }
    async query(dir, p) {
        const { date, q, level, page = 1, pageSize = 100 } = p;
        const file = this.filePath(dir, date);
        try {
            await fs.access(file);
        }
        catch {
            throw new NotFoundException('Log file not found');
        }
        const size = Math.min(Math.max(Number(pageSize || 100), 1), 1000);
        const start = (Math.max(Number(page || 1), 1) - 1) * size;
        const end = start + size;
        const stream = createReadStream(file, { encoding: 'utf8' });
        const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
        const rows = [];
        let matchedCount = 0;
        for await (const line of rl) {
            if (!line.trim())
                continue;
            // Expect NDJSON (JSON per line). Lines that aren't JSON are skipped gracefully.
            let obj;
            try {
                obj = JSON.parse(line);
            }
            catch {
                continue;
            }
            if (level && String(obj.level).toLowerCase() !== level.toLowerCase())
                continue;
            if (q) {
                const hay = (obj.message ?? '') + ' ' + JSON.stringify(obj);
                if (!hay.toLowerCase().includes(q.toLowerCase()))
                    continue;
            }
            // pagination on matched records
            if (matchedCount >= start && matchedCount < end)
                rows.push(obj);
            matchedCount++;
            if (matchedCount >= end)
                continue;
        }
        return { page, pageSize: size, total: matchedCount, rows };
    }
};
LogReaderService = __decorate([
    Injectable()
], LogReaderService);
export { LogReaderService };
