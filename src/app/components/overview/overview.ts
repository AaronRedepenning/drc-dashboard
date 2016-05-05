// Import angular2 modules
import { Component } from 'angular2/core';

// Import custom modules
import { D3Gauge } from '../d3-gauge/d3-gauge';
import { ChartistLinechart } from '../chartist-linechart/chartist-linechart';
import { OverviewService } from '../../services/overview-service';

@Component({
    templateUrl: 'app/components/overview/overview.html',
    styleUrls: [ 'app/components/overview/overview.css' ],
    selector: 'overview',
    directives: [D3Gauge, ChartistLinechart],
    providers: [OverviewService]
})

/**
 * Overview
 */
export class Overview {
    
    /* Remove once has server */
    tempValue: number = 5;
    humValue: number = 5;
    intervalID: any;
    
    currentConditions: any = {
        temperature: 0,
        humidity: 0,
        pressure: 0,
        dewPoint: 0,
        lightIntensity: 0
    };
    
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
    
    constructor(private _overviewService: OverviewService) { }
    
    ngOnInit() { 
        this.start(); 
        this.chartData = this.generateRandomChartData(30);
    }
    
    start() {
        this.intervalID = setInterval(()=> {
            this.tempValue = Math.max(Math.min((Math.random() * 2 - 1) + this.tempValue, 10), 0);
            this.humValue = Math.max(Math.min((Math.random() * 2 - 1) + this.humValue, 10), 0);
            this._overviewService.getOverviewData() 
                .subscribe(
                    data => {
                        this.setCurrentConditions(data);
                        console.log(data)
                    },
                    error => console.log(error)
                );
        }, 10000);
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
    
    private setCurrentConditions(data: any) {
        this.currentConditions.temperature = data.currentConditions.temperature;
        this.currentConditions.humidity = data.currentConditions.humidity;
        this.currentConditions.pressure = data.currentConditions.pressure;
        this.currentConditions.dewPoint = data.currentConditions.dewpoint;
    }
}