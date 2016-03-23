import {bootstrap} from 'angular2/platform/browser';
//import {provide} from 'angular2/core';
//import {HTTP_PROVIDERS} from 'angular2/http';
import {ROUTER_PROVIDERS, LocationStrategy, HashLocationStrategy} from 'angular2/router';

import {DashboardApp} from './app/dashboard-app';


bootstrap(DashboardApp, [
  //HTTP_PROVIDERS,
  ROUTER_PROVIDERS,
  //provide(LocationStrategy, {useClass: HashLocationStrategy})
])
.catch(err => console.error(err));
