import { Injectable  } from '@angular/core';
import { Logger } from './Logger';
import { LogService } from './Log.service';

@Injectable()
export class SessionStorageService {
  local: any = {}; // FIX NG2R
  subscribers: any = {};

  log: Logger;

  public constructor(
    logSerice: LogService
  ) {
    this.log = logSerice.to("Session");
    this.subscribers = {};
  }

  /**
   * Set the key in the session storage
   */
  public setKey(key: string, value: string|Object) {
    this.log.debug('setKey', key, value);
    this.subscribers[key] = this.subscribers[key] || [];

    this.local[key] = value; // FIX NG2R set in local
    sessionStorage.setItem(key, JSON.stringify(value)); // set in session storage

    for (let i: number = 0; i < this.subscribers[key].length; ++i) {
      this.subscribers[key][i](value);
    }
  }

  /**
   * Get the key
   */
  public getKey(key: string): string|any {
    let value;
    try {
      value = this.local[key]; // FIX NG2R
      if (!value) { // FIX NG2R
        //value = JSON.parse(sessionStorage.getItem(key));
      }
    } catch (e) {}

    //this.log.debug('getKey', key, value);

    if(null === value|| '' === value || undefined === value) {
      throw new Error("SessionStorage can't find: " + key);
    }

    return value;
  }

  /**
   * Set a listener and if value is present call it sync
   */
  public subscribe(key:string, callback: any) {
    this.subscribers[key] = this.subscribers[key] || [];
    this.subscribers[key].push(callback);


    try {
      const v = this.getKey(key);
      if (v) {
        callback(v);
      }
    } catch (e) {}

    this.log.debug('subscribe', key, this.subscribers);
  }
 }
