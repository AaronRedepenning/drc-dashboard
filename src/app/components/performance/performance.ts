// Import angular2 modules
import { Component } from 'angular2/core';

// Import custom modules
import { ChartistLinechart } from '../chartist-linechart/chartist-linechart'

@Component ({
    templateUrl:'app/components/performance/performance.html',
    styleUrls: [ 'app/components/performance/performance.css' ],
    selector: 'performance',
    directives: [ChartistLinechart]
})

/**
 * Performance
 */
export class Performance {
    constructor() {}
}