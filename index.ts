import { Nl2BrPipe } from "./src/pipes/nl2br.pipe";
export { Nl2BrPipe } from "./src/pipes/nl2br.pipe";

import { RootComponent } from "./src/Root.component";
export { RootComponent } from "./src/Root.component";

export { Level, Logger, Notification } from "./src/services/Logger";
import { LogService } from "./src/services/Log.service";
export { LogService } from "./src/services/Log.service";
import { SessionStorageService } from "./src/services/SessionStorage.service";
export { SessionStorageService } from "./src/services/SessionStorage.service";

export { Base } from "./src/Base";
export { Injector } from "@angular/core";
export { ActivatedRoute } from "@angular/router";

import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";


@NgModule({
  imports: [
    RouterModule
  ],
  declarations: [
    RootComponent,
    Nl2BrPipe,
  ],
  providers: [
    SessionStorageService,
    LogService,
  ],
  exports: [
    Nl2BrPipe,
    RouterModule
  ]
})
export class AngularCommonModule {}
