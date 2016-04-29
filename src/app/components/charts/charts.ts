// Import angular2 modules
import { Component } from 'angular2/core';

// Import custom modules
import { ChartistLinechart } from '../chartist-linechart/chartist-linechart'

@Component ({
    templateUrl: 'app/components/charts/charts.html',
    styleUrls: [ 'app/components/charts/charts.css' ],
    selector: 'charts',
    directives: [ChartistLinechart]
})

/**
 * Admin
 */
export class Charts {
    
    chartData: Chartist.IChartistData;
    
    constructor() { }
    
    ngOnInit() {
        this.chartData = this.generateRandomChartData(100);
    }
    
    private generateRandomChartData(length: number): Chartist.IChartistData {
        var labelsData: number[]   = [];
        var seriesData: number[][] = [[]];        
        
        for(var CurrentTime = 0; CurrentTime < length; CurrentTime++) {
            labelsData.push(Date.now());
            seriesData[0].push(Math.floor(Math.random() * 20));
        }
        
        var data = {
            labels: labelsData,
            series: seriesData
        }
        
        return data;
    }
}