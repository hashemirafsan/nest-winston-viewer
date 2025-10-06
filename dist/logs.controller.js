var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Controller, Get, Header, Inject, Query, Res, Req, HttpException, HttpStatus } from '@nestjs/common';
import { readFileSync } from 'fs';
import { join } from 'path';
import { LogReaderService } from './log-reader.service.js';
function checkBasicAuth(req, auth) {
    if (!auth)
        return;
    const hdr = req.headers['authorization'] ?? '';
    if (typeof hdr !== 'string' || !hdr.startsWith('Basic ')) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const decoded = Buffer.from(hdr.slice(6), 'base64').toString('utf8');
    const [u, p] = decoded.split(':');
    if (u !== auth.username || p !== auth.password) {
        throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
}
let LogsController = class LogsController {
    constructor(reader, opts) {
        this.reader = reader;
        this.opts = opts;
        // Load HTML once; replace __BASE__ token with actual route base
        const file = join(__dirname, 'viewer.static.html');
        const raw = readFileSync(file, 'utf8');
        this.html = raw.replaceAll('__BASE__', this.opts.routeBase || '/logs');
    }
    // Viewer UI (GET /logs)
    ui(req, res) {
        checkBasicAuth(req, this.opts.auth);
        res.send(this.html);
    }
    // GET /logs/api/dates -> ["2025-10-06","2025-10-05",...]
    async dates(req) {
        checkBasicAuth(req, this.opts.auth);
        return this.reader.listAvailableDates(this.opts.filesDir);
    }
    // GET /logs/api?date=YYYY-MM-DD&q=error&level=error&page=1&pageSize=100
    async query(req, q) {
        checkBasicAuth(req, this.opts.auth);
        if (!q?.date) {
            throw new HttpException('Missing "date" query param', HttpStatus.BAD_REQUEST);
        }
        return this.reader.query(this.opts.filesDir, {
            date: q.date,
            q: q.q,
            level: q.level,
            page: Number(q.page ?? 1),
            pageSize: Number(q.pageSize ?? 100),
        });
    }
};
__decorate([
    Get(['/logs', '/logs/']),
    Header('Content-Type', 'text/html; charset=utf-8'),
    __param(0, Req()),
    __param(1, Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], LogsController.prototype, "ui", null);
__decorate([
    Get('/logs/api/dates'),
    __param(0, Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "dates", null);
__decorate([
    Get('/logs/api'),
    __param(0, Req()),
    __param(1, Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], LogsController.prototype, "query", null);
LogsController = __decorate([
    Controller(),
    __param(1, Inject('WINSTON_VIEWER_OPTIONS')),
    __metadata("design:paramtypes", [LogReaderService, Object])
], LogsController);
export { LogsController };
