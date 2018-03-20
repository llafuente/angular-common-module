import { Injectable } from '@angular/core';
import { Logger, Notification, Level } from './Logger';


@Injectable()
export class LogService {

  loggers: Map<string, Logger> = null;
  level: number = Level.info;

  constructor() {
    this.loggers = new Map<string, Logger>();
    this.openLogger('main');
  }


  openLogger(loggerName: string): Logger {
    var existingLogger = this.loggers.get(loggerName);
    if (!existingLogger) {
      existingLogger = new Logger(this, loggerName);
      this.loggers.set(loggerName, existingLogger);
    }

    return existingLogger;
  }

  closeLogger(loggerName: string) {
    var existingLogger = this.loggers.get(loggerName);
    if (existingLogger) {
      this.loggers.delete(loggerName);
      existingLogger.closePublication();
    }

    return existingLogger;
  }

  /**
   * Redirect log to a given logger.
   *
   * If the asked logger does not yet exists it will be created
   *
   * @param  {string} loggerName
   * @return {Logger}
   */
  to(loggerName: string): Logger {
    if (this.loggers.has(loggerName)) {
      return this.loggers.get(loggerName);
    } else {
      return this.openLogger(loggerName);
    }
  }

  silly(...args) {
    this.to('main').silly(...args);
  }
  debug(...args) {
    this.to('main').debug(...args);
  }
  info(...args) {
    this.to('main').info(...args);
  }
  warning(...args) {
    this.to('main').warning(...args);
  }
  error(...args) {
    this.to('main').error(...args);
  }
}
