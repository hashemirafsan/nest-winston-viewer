import {
  Controller, Get, Header, Inject, Query, Res, Req, HttpException, HttpStatus
} from '@nestjs/common';
import { Response, Request } from 'express';
import { LogReaderService } from './log-reader.service';
import { readFileSync } from 'fs';
import { join } from 'path';

type Options = {
  routeBase: string;
  filesDir: string;
  auth: { username: string; password: string } | null;
};

function checkBasicAuth(req: Request, auth: Options['auth']) {
  if (!auth) return;
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

@Controller()
export class LogsController {
  private html: string;

  constructor(
    private readonly reader: LogReaderService,
    @Inject('WINSTON_VIEWER_OPTIONS') private readonly opts: Options
  ) {
    // Load HTML once; replace __BASE__ token with actual route base
    const file = join(__dirname, 'viewer.static.html');
    const raw = readFileSync(file, 'utf8');
    this.html = raw.replaceAll('__BASE__', this.opts.routeBase || '/logs');
  }

  // Viewer UI (GET /logs)
  @Get(['/logs', '/logs/'])
  @Header('Content-Type', 'text/html; charset=utf-8')
  ui(@Req() req: Request, @Res() res: Response) {
    checkBasicAuth(req, this.opts.auth);
    res.send(this.html);
  }

  // GET /logs/api/dates -> ["2025-10-06","2025-10-05",...]
  @Get('/logs/api/dates')
  async dates(@Req() req: Request) {
    checkBasicAuth(req, this.opts.auth);
    return this.reader.listAvailableDates(this.opts.filesDir);
  }

  // GET /logs/api?date=YYYY-MM-DD&q=error&level=error&page=1&pageSize=100
  @Get('/logs/api')
  async query(@Req() req: Request, @Query() q: any) {
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
}
