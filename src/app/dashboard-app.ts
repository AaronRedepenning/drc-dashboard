import {Component} from 'angular2/core';
import {Router, RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import { Home } from './components/home/home';

@Component({
  selector: 'dashboard-app',
  providers: [],
  pipes: [],
  directives: [ROUTER_DIRECTIVES],
  templateUrl: 'app/dashboard-app.html',
  styleUrls: ['app/dashboard-app.css']
})
@RouteConfig([
  { path: '/home',       component: Home,        name: 'Home', useAsDefault: true },
  //{ path: '/about',      component: About,       name: 'About' },
  //{ path: '/github/...', component: RepoBrowser, name: 'RepoBrowser' },
])
export class DashboardApp {

  constructor() {}

}
