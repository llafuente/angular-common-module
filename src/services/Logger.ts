import { Subject } from 'rxjs/Rx'
//import { LogService } from './Log.service'

export interface Notification {
  type: string;
  payload: {
    level?: string;
  };
}

export var Level = {
  silly: 1,
  debug: 2,
  info: 3,
  warning: 4,
  error: 5,
  mute: 6
}


export class Logger {
  subject = null;

  constructor(
    public logService: {level: number},
    public name: string,
  ) {
    // Create the RxJs subject
    this.subject = new Subject();
  }

  closePublication() {
    this.subject.onCompleted();
  }

  silly(...args) {
    if( this.logService.level > Level.silly ) {
      return;
    }

    var t = ["%s | %cSilly: ", this.name, "color:green"];
    t.push(...args);
    console.log.apply(console, t);
    // Publish an event
    this._publishEvent('silly', args);
  }

  debug(...args) {
    if( this.logService.level > Level.debug ) {
      return;
    }

    var t = ["%s | %cDebug: ", this.name, "color:green"];
    t.push(...args);
    console.log.apply(console, t);
    // Publish an event
    this._publishEvent('debug', args);
  }

  info(...args) {
    if( this.logService.level > Level.info ) {
      return;
    }

    var t = ["%s | %cInfo: ", this.name, "color:blue"];
    t.push(...args);
    console.log.apply(console, t);
    // Publish an event
    this._publishEvent('info', args);
  }

  warning(...args) {
    if( this.logService.level > Level.warning ) {
      return;
    }

    var t = ["%s | %cWarning: ", this.name, "color:orange"];
    t.push(...args);
    console.log.apply(console, t);
    // Publish an event
    this._publishEvent('warning', args);
  }

  error(...args) {
    if( this.logService.level > Level.error ) {
      return;
    }

    var t = ["%s | %cError: ", this.name, "color:red"];
    t.push(...args);
    console.log.apply(console, t);
    // Publish an event
    this._publishEvent('error', args);
  }

  private _publishEvent(level, ...args) {
    this.subject.next({ name: this.name, level, value: args });
  }

}
