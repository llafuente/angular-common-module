import { OnInit, OnDestroy, Injector } from "@angular/core";
import { Subscription } from "rxjs/Rx" ;
import { Observable } from "rxjs/Observable" ;
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from "@angular/router";
import { ToastyService, ToastOptions, ToastData } from "ng2-toasty";
import { BBConfirmService } from "angular-bootstrap-ui";

import { LogService } from "./services/Log.service";
import { Logger } from "./services/Logger";
import { SessionStorageService } from "./services/SessionStorage.service";

export class Base implements /*OnInit, */OnDestroy {
  subscriptions: Subscription[] = [];
  timeouts: number[] = [];
  toastyService: ToastyService;
  session: SessionStorageService;
  router: Router;
  currentLog: Logger;
  confirmService: BBConfirmService;

  constructor(
    public injector: Injector,
    public route: ActivatedRoute
  ) {
    this.toastyService = injector.get(ToastyService);
    this.session = injector.get(SessionStorageService);
    this.router = injector.get(Router);
    this.confirmService = injector.get(BBConfirmService);

    const logs: LogService = injector.get(LogService);
    this.currentLog = logs.to("Component"); // maybe instaceof this
  }

  handleSubscription(s: Subscription) {
    this.subscriptions.push(s);
  }

  timeout(fn: Function, miliseconds: number): number {
    const t = setTimeout(fn, miliseconds);
    this.timeouts.push(t);
    return t;
  }

  /**
   * If You need to override ngOnDestroy remember to always call super()
   */
  ngOnDestroy() {
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
    });

    for (let i = 0; i < this.timeouts.length; ++i) {
      clearTimeout(this.timeouts[i]);
    }
  }

  errGrowl(str: string, timeout: number = 10000) {
    const toastOptions:ToastOptions = {
      title: str,
      showClose: true,
      timeout: timeout,
      theme: "bootstrap",
      onAdd: (toast: ToastData) => {
        this.currentLog.debug(`Toast ${toast.id} has been added!`, str);
      },
      onRemove: (toast: ToastData) => {
        this.currentLog.debug(`Toast ${toast.id} has been removed!`, str);
      }
    };

    // Add see all possible types in one shot
    this.toastyService.error(toastOptions);
  }

  warnGrowl(str: string, timeout = 10000) {
    const toastOptions: ToastOptions = {
      title: str,
      showClose: true,
      timeout,
      theme: "bootstrap",
      onAdd: (toast: ToastData) => {
        this.currentLog.debug(`Toast ${toast.id} has been added!`, str);
      },
      onRemove: (toast: ToastData) => {
        this.currentLog.debug(`Toast ${toast.id} has been removed!`, str);
      }
    };

    // Add see all possible types in one shot
    this.toastyService.warning(toastOptions);
  }

  growl(str: string, timeout: number = 5000) {
    const toastOptions:ToastOptions = {
      title: str,
      //msg: "Good new, everything is working OK!",
      showClose: true,
      timeout: timeout,
      theme: "bootstrap",
      onAdd: (toast: ToastData) => {
        this.currentLog.debug(`Toast ${toast.id} has been added!`, str);
      },
      onRemove: (toast: ToastData) => {
        this.currentLog.debug(`Toast ${toast.id} has been removed!`, str);
      }
    };

    // Add see all possible types in one shot
    this.toastyService.info(toastOptions);
  }

  /**
   * Reverse ActivatedRoute and return the first non-undefined key in params
   */
  getParameter(key: string): string|null {
    let snapshot: ActivatedRouteSnapshot = this.route.snapshot;

    do {
      const d = snapshot.params as any;
      // console.log("route.params", snapshot.params);
      if (d && d[key] !== undefined) {
        this.currentLog.debug("getParameter", key, d[key]);
        return d[key];
      }

      snapshot = snapshot.parent;
    } while (snapshot);

    this.currentLog.debug("getParameter", key, null);
    return null;
  }

  getNumberParameter(key: string): number|null {
    let snapshot: ActivatedRouteSnapshot = this.route.snapshot;

    do {
      const d = snapshot.params as any;
      // console.log("route.params", snapshot.params);
      if (d && d[key] !== undefined) {
        this.currentLog.debug("getNumberParameter", key, d[key]);
        return parseInt(d[key], 10);
      }

      snapshot = snapshot.parent;
    } while (snapshot);

    this.currentLog.debug("getNumberParameter", key, null);
    return null;
  }

  /**
   * Reverse ActivatedRoute and return the first non-undefined key in params
   */
  getResolve<T>(key: string): T {
    let snapshot: ActivatedRouteSnapshot = this.route.snapshot;

    do {
      const d = snapshot.data;
      // console.log("route.params", snapshot.params);
      if (d && d[key] !== undefined) {
        this.currentLog.debug("getResolve", key, d[key]);
        return d[key];
      }

      snapshot = snapshot.parent;
    } while (snapshot);

    this.currentLog.debug("getResolve", key, null);
    return null;
  }

  confirm(header: string, content: string): Observable<boolean> {
    return this.confirmService.show(header, content);
  }

}
