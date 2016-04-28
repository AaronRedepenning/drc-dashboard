// Import angular2 modules
import { Component } from 'angular2/core';

// Import custom modules
import { D3Gauge } from '../d3-gauge/d3-gauge';

@Component({
    templateUrl: 'app/components/home/home.html',
    styleUrls: [ 'app/components/home/home.css' ],
    selector: 'home',
    directives: [D3Gauge]
})

/**
 * Home
 */
export class Home {
    
    tempValue: number = 5;
    humValue: number = 5;
    intervalID: any;
    
    constructor() { }
    
    ngOnInit() { this.start(); }
    start() {
        this.intervalID = setInterval(()=> {
            this.tempValue = Math.max(Math.min((Math.random() * 2 - 1) + this.tempValue, 10), 0);
            this.humValue = Math.max(Math.min((Math.random() * 2 - 1) + this.humValue, 10), 0);
        }, 4000);
    }
    
    stop() { clearInterval(this.intervalID); }
    ngOnDestroy() { this.stop(); }
}