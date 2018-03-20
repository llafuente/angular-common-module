# angular-common-module

Small collection of classes that we use across all projects


## Base

Base is the class to extends all your components.

* Handle subscriptions, unsubscribe on ngDestroy
* Handle timeouts, clear them on ngDestroy
* Growls (using ng2-toasty)
* Parse route parameters (string/number)
* Get data from resolves
* Confirmation modals

We recomend to extends base with your own needs like handle HTTP errors, then
extends directly your class.

## Pipes

### nl2br

```html
<span [innerHTML]="yourTextWithNewLines | nl2br"
```

## Services

### SessionStorageService

* set/get values in localStorage.
* You can subscribe to a key to see if change.

NOTE: Save objects as JSON

### LogService

Proper loggin service with timestamp, color support, levels.

## Component

### RootComponent

Component used for "empty routes".
It's just contains a router-outlet.

```ts
import * as Views from "./";
import { RootComponent } from "./../Root.component";

export const routes = [
  {
    path: "parent",
    component: RootComponent,
    children: [
      {
        path: "",
        component: Views.ParentIndex,
      },
      {
        path: "xxx",
        component: Views.ParentXXX,
      },
    ]
  }
];
```

# publish

```
npm publish .
```

# LICENSE

MIT
