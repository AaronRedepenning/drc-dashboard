// Import AngularJS Modules
import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

// Import Custom TypeScript Modules
import { Overview } from './components/overview/overview';
import { FluxMap } from './components/flux-map/flux-map';

// DashboardApp module decorator (meta-data)
@Component({
  selector: 'dashboard-app',
  providers: [],
  pipes: [],
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'app/dashboard-app.html',
  styleUrls: ['app/dashboard-app.css']
})

// Angular JS Router and registered routes
@RouteConfig([
  { path: '/overview',    component: Overview,    name: 'Overview', useAsDefault: true },
  { path: '/flux-map',    component: FluxMap,     name: 'FluxMap'}
])

// DashboardApp Class
export class DashboardApp {
  constructor(public router: Router) {}
}
