// Import AngularJS Modules
import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

// Import Custom TypeScript Modules
import { Home } from './components/home/home';
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
  { path: '/home',       component: Home,        name: 'Home', useAsDefault: true },
  { path: '/flux-map',   component: FluxMap,     name: 'FluxMap'},
])

// DashboardApp Class
export class DashboardApp {

  constructor() {}

}
