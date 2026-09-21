import { getConfigOrThrow } from './config-utils';

export const RED_COLOR = '\x1b[31m';

// Reset
export const RESET = '\x1b[0m';

// Text colors
export const BLACK = '\x1b[30m';
export const RED = '\x1b[31m';
export const GREEN = '\x1b[32m';
export const YELLOW = '\x1b[33m';
export const BLUE = '\x1b[34m';
export const MAGENTA = '\x1b[35m';
export const CYAN = '\x1b[36m';
export const WHITE = '\x1b[37m';

// Background colors
export const BG_BLACK = '\x1b[40m';
export const BG_RED = '\x1b[41m';
export const BG_GREEN = '\x1b[42m';
export const BG_YELLOW = '\x1b[43m';
export const BG_BLUE = '\x1b[44m';
export const BG_MAGENTA = '\x1b[45m';
export const BG_CYAN = '\x1b[46m';
export const BG_WHITE = '\x1b[47m';

// Extended colors (256-color mode)
export const EXT_COLOR = (colorCode: string) => `\x1b[38;5;${colorCode}m`;
export const EXT_BG_COLOR = (colorCode: string) => `\x1b[48;5;${colorCode}m`;

enum LogLevels {
  OFF, // 0
  FATAL, // 1
  ERROR, // 2
  WARN, // 3
  INFO,
  DEBUG,
  TRACE,
  ALL,
}
export class CustomLogger {
  static f(...params: any[]) {
    const LOG_LEVEL = Number(process.env.LOG_LEVEL);

    if (LOG_LEVEL >= LogLevels.FATAL) {
      console.log(MAGENTA, ...params);
    }
  }

  static e(...params: any[]) {
    const LOG_LEVEL = Number(process.env.LOG_LEVEL);
    if (LOG_LEVEL >= LogLevels.ERROR) {
      console.log(RED, ...params);
    }
  }

  static w(...params: any[]) {
    const LOG_LEVEL = Number(process.env.LOG_LEVEL);
    if (LOG_LEVEL >= LogLevels.WARN) {
      console.log(YELLOW, ...params);
    }
  }

  static i(...params: any[]) {
    const LOG_LEVEL = Number(process.env.LOG_LEVEL);
    if (LOG_LEVEL >= LogLevels.INFO) {
      console.log(GREEN, ...params);
    }
  }

  static d(...params: any[]) {
    const LOG_LEVEL = Number(process.env.LOG_LEVEL);
    if (LOG_LEVEL >= LogLevels.DEBUG) {
      console.log(RED, ...params);
    }
  }

  static t(...params: any[]) {
    const LOG_LEVEL = Number(process.env.LOG_LEVEL);
    if (LOG_LEVEL >= LogLevels.TRACE) {
      console.log(RED, ...params);
    }
  }
}
