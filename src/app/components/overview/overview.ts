// Import angular2 modules
import { Component } from 'angular2/core';

// Import custom modules
import { D3Gauge } from '../d3-gauge/d3-gauge';
import { ChartistLinechart } from '../chartist-linechart/chartist-linechart';

@Component({
    templateUrl: 'app/components/overview/overview.html',
    styleUrls: [ 'app/components/overview/overview.css' ],
    selector: 'overview',
    directives: [D3Gauge, ChartistLinechart]
})

/**
 * Overview
 */
export class Overview {
    
    /* Remove once has server */
    tempValue: number = 5;
    humValue: number = 5;
    intervalID: any;
    
    itemsToSelect: string[] = [
        'Temperature',
        'Humidity',
        'Pressure',
        'Carbon Dioxide',
        'Comfort Index'
    ];
    private _selectedItem: string = this.itemsToSelect[0];
    set selectedItem(item: string) {
        this._selectedItem = item;
        this.chartData = this.generateRandomChartData(30);
        console.log(item);
    }
    get selectedItem(): string {
        return this._selectedItem;
    }
    
    /* Keep? */
    chartData: Chartist.IChartistData;
    gaugeConfig: any = {
        // SVG Config
        size: 200,
        clipWidth: 200,
        clipHeight: 120,
        // Arc Config
        ringWidth: 40,
        pointerWidth: 20,
        arcColorFn: (percent) => {
            if(percent < (1/3)) {
                return 'blue';
            } else if (percent < (2/3)) {
                return 'green';
            } else {
                return 'red';
            }
        },
        
        pointerHeadLengthPercent: 0.85,
        majorTicks: 3,
        maxValue: 10
    };
    
    constructor() { }
    
    ngOnInit() { 
        this.start(); 
        this.chartData = this.generateRandomChartData(30);
    }
    
    start() {
        this.intervalID = setInterval(()=> {
            this.tempValue = Math.max(Math.min((Math.random() * 2 - 1) + this.tempValue, 10), 0);
            this.humValue = Math.max(Math.min((Math.random() * 2 - 1) + this.humValue, 10), 0);
        }, 4000);
    }
    
    stop() { clearInterval(this.intervalID); }
    ngOnDestroy() { this.stop(); }
    
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
    
    private gaugeArcColorFunction(d: number, i:number) {
        
    }
}