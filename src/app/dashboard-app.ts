// Import AngularJS Modules
import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

// Import Custom TypeScript Modules
import { Overview } from './components/overview/overview';
import { FluxMap } from './components/flux-map/flux-map';
import { Admin } from './components/admin/admin';
import { Performance } from './components/performance/performance';
import { Charts } from './components/charts/charts';

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
  { path: '/flux-map',    component: FluxMap,     name: 'FluxMap'},
  { path: '/admin',       component: Admin,       name: 'Admin'},
  { path: '/performance', component: Performance, name: 'Performance'},
  { path: '/charts',      component:  Charts,     name: 'Charts'}
])

// DashboardApp Class
export class DashboardApp {
  constructor(public router: Router) {}
}
