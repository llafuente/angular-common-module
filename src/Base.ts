import { OnInit, OnDestroy, Injector } from "@angular/core";
import { Subscription } from "rxjs/Rx" ;
import { Observable } from "rxjs/Observable" ;
import { ActivatedRoute, ActivatedRouteSnapshot, Router, Params } from "@angular/router";
import { BBAlertService, BBConfirmService, ToastyService, ToastOptions, ToastData } from "angular-bootstrap-ui";

import { LogService } from "./services/Log.service";
import { Logger } from "./services/Logger";
import { SessionStorageService } from "./services/SessionStorage.service";

/**
 * Base class for componets to extends that handle many common staff
 * * route, parameters and resolved
 * * router
 * * modal confirmations
 * * modal alerts
 * * unsubscription to subscriptions when component is destroyed
 * * log
 * * session (localStorage)
 */
export class Base implements /*OnInit, */OnDestroy {
  subscriptions: Subscription[] = [];
  timeouts: number[] = [];
  toastyService: ToastyService;
  session: SessionStorageService;
  router: Router;
  currentLog: Logger;
  confirmService: BBConfirmService;
  alertService: BBAlertService;

  parameterListeners: {[paramName: string]: (value: any) => void} = {};
  /**
   * Fetch some things that most componets uses and init route listeners
   */
  constructor(
    public injector: Injector,
    public route: ActivatedRoute
  ) {
    this.toastyService = injector.get(ToastyService);
    this.session = injector.get(SessionStorageService);
    this.router = injector.get(Router);
    this.confirmService = injector.get(BBConfirmService);
    this.alertService = injector.get(BBAlertService);

    const logs: LogService = injector.get(LogService);
    this.currentLog = logs.to("Component"); // maybe instaceof this

    let r = route;
    do {
      this.handleSubscription(r.params.subscribe(this.parameterChanged.bind(this)));

      r = r.parent;
    } while(r && r.parent);
  }
  /**
   * parameter changed listener
   */
  protected parameterChanged(p: Params) {
    for (let idx in p) {
      if (this.parameterListeners[idx]) {
        this.parameterListeners[idx](p[idx]);
      }
    }
  }
  /**
   * Notify given callback when a change in parameters is detected
   * that not means that paramName is changed
   */
  onParameterChange(paramName: string, cb: (value: any) => void) {
    this.parameterListeners[paramName] = cb;
  }

  /**
   * Keep your member in sync with a parameter with the same name
   */
  bindParameter(paramName) {
    this[paramName] = this.getParameter(paramName);
    this.onParameterChange(paramName, (p) => {
      this[paramName] = p;
    });
  }
  /**
   * Add the subscription to a list that will unsubscribe when componet
   * is destroyed
   */
  handleSubscription(s: Subscription) {
    this.subscriptions.push(s);
  }
  /**
   * Create a timeout that is cleared if the componet is destroyed
   */
  timeout(fn: Function, miliseconds: number): number {
    const t = setTimeout(fn, miliseconds);
    this.timeouts.push(t);
    return t;
  }

  /**
   * unsubscibe and clear timeouts
   *
   * NOTE: If You need to override ngOnDestroy remember to always call super()
   */
  ngOnDestroy() {
    this.subscriptions.forEach((subs) => {
      subs.unsubscribe();
    });

    for (let i = 0; i < this.timeouts.length; ++i) {
      clearTimeout(this.timeouts[i]);
    }
  }
  /**
   * Create an error growl, require ng2-toasty to be configured
   */
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
  /**
   * Create a warning growl, require ng2-toasty to be configured
   */
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
  /**
   * Create an info growl, require ng2-toasty to be configured
   */
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
  /**
   * Reverse ActivatedRoute and return the first non-undefined key in params
   * casted to number (Integer)
   */
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
   * Reverse ActivatedRoute and return the first non-undefined key in data
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
  /**
   * Create a confirmation modal
   * bb-confirm-service need to be configured
   */
  confirm(header: string, content: string): Observable<boolean> {
    return this.confirmService.show(header, content);
  }
  /**
   * Create a alert modal
   * bb-alert-service need to be configured
   */
  alert(header: string, content: string, isHTML: boolean): Observable<boolean> {
    return this.alertService.show(header, content, isHTML);
  }
}
