// Import AngularJS Modules
import {bootstrap} from 'angular2/platform/browser';
import {ROUTER_PROVIDERS} from 'angular2/router';

// Import Custom Modules
import {DashboardApp} from './app/dashboard-app';

// Bootstrap the Application with main view
bootstrap(DashboardApp, [
  ROUTER_PROVIDERS,
])
// For Debuggin Purposes
.catch(err => console.error(err));
