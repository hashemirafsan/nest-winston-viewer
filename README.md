<p align="center">
  <a href="https://www.npmjs.com/package/nest-winston-viewer" target="_blank">
    <img src="https://img.shields.io/npm/v/nest-winston-viewer.svg?style=flat-square" alt="NPM Version" />
  </a>
  <a href="https://www.npmjs.com/package/nest-winston-viewer" target="_blank">
    <img src="https://img.shields.io/npm/dm/nest-winston-viewer.svg?style=flat-square" alt="Downloads" />
  </a>
  <a href="https://github.com/hashemirafsan/nest-winston-viewer/actions" target="_blank">
    <img src="https://img.shields.io/github/actions/workflow/status/hashemirafsan/nest-winston-viewer/build.yml?branch=main&style=flat-square" alt="Build Status" />
  </a>
  <a href="https://github.com/hashemirafsan/nest-winston-viewer/blob/main/LICENSE" target="_blank">
    <img src="https://img.shields.io/npm/l/nest-winston-viewer.svg?style=flat-square" alt="License" />
  </a>
  <a href="https://github.com/hashemirafsan/nest-winston-viewer/stargazers" target="_blank">
    <img src="https://img.shields.io/github/stars/hashemirafsan/nest-winston-viewer?style=social" alt="GitHub Stars" />
  </a>
</p>


# nest-winston-viewer

A NestJS module that provides a web-based viewer for Winston logs with daily rotation support.

## Features

- 📊 Web-based UI for viewing Winston logs
- 📅 Support for daily rotated log files
- 🔍 Search functionality across log messages and metadata
- 🔢 Pagination and filtering by log level
- 🔐 Optional basic authentication
- 🔄 Seamless integration with NestJS and nest-winston

## Installation

```bash
npm install nest-winston-viewer
```

## Requirements

This module has the following peer dependencies:
- @nestjs/common (>=10.0.0 <12)
- @nestjs/core (>=10.0.0 <12)
- nest-winston (^1.10.0)
- winston (^3.11.0)
- winston-daily-rotate-file (^4.7.1)

## Usage

### Basic Setup

```typescript
import { Module } from '@nestjs/common';
import { WinstonViewerModule } from 'nest-winston-viewer';

@Module({
  imports: [
    WinstonViewerModule.forRoot({
      // All options are optional with sensible defaults
      routeBase: '/logs',  // Base route for the logs viewer
      filesDir: './logs',  // Directory where log files are stored
      auth: null,          // No authentication by default
    }),
  ],
})
export class AppModule {}
```

### With Authentication

```typescript
import { Module } from '@nestjs/common';
import { WinstonViewerModule } from 'nest-winston-viewer';

@Module({
  imports: [
    WinstonViewerModule.forRoot({
      routeBase: '/logs',
      filesDir: './logs',
      auth: {
        username: 'admin',
        password: 'secure-password'
      },
      logger: {
        level: 'info',
        maxFiles: '14d',
        json: true,
      },
    }),
  ],
})
export class AppModule {}
```

## Configuration Options

The `WinstonViewerModule.forRoot()` method accepts an options object with the following properties:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `routeBase` | string | `/logs` | Base route for the logs viewer |
| `filesDir` | string | `./logs` | Directory where log files are stored |
| `auth` | object \| null | `null` | Basic authentication configuration |
| `logger` | object | `{}` | Winston logger configuration |

### Logger Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dir` | string | `./logs` | Directory for log files |
| `level` | string | `info` | Minimum log level |
| `maxFiles` | string | `14d` | Maximum retention period |
| `json` | boolean | `true` | Whether to use JSON format |

## Accessing the Logs Viewer

Once configured, you can access the logs viewer at the configured route base (default: `/logs`).

## License

MIT