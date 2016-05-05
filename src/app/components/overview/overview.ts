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
    directives: [ D3Gauge, ChartistLinechart ],
    providers: [ OverviewService ]
})

/**
 * Overview
 */
export class Overview {
    
    intervalID: any;
    
    // Set this to change data in chartData
    chartData: Chartist.IChartistData = {labels:[], series:[[]]};
    private _chartData: any;
    currentConditions: any = {
        temperature: 0,
        pressure : 0,
        humidity : 0,
        dewpoint : 0,
        lightIntensity: 0
    };
    
    extremes: any = { 
        maximums: {
            temperature: 0,
            humidity: 0,
            pressure: 0,
            lightIntensity: 0
        },
        averages: {
            temperature: 0,
            humidity: 0,
            pressure: 0,
            lightIntensity: 0
        },
        minimums: {
            temperature: 0,
            humidity: 0,
            pressure: 0,
            lightIntensity: 0
        }
    };
    
    gaugeData: any = { 
        tempHumGauge: 0,
        lightGauge: 0
    };
    
    itemsToSelect = [
        "Temperature",
        "Humidity",
        "Pressure",
        "Light Intensity"
    ]
    private _selectedItem: string = this.itemsToSelect[0];
    set selectedItem(item: string) {
        this._selectedItem = item;
        this.setChartDataForSelected(item);
    }
    get selectedItem(): string {
        return this._selectedItem;
    }
    
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
        this.getNewOverviewData();
        // Set interval to refresh data every 5 seconds
        this.intervalID = setInterval(this.getNewOverviewData(), 5000);
    }
    
    ngOnDestroy() { 
        
    }
    
    private getNewOverviewData() {
        this._overviewService.getOverviewData()
            .subscribe(
                data => console.log(data),
                error => console.log(error)
            );
    }
    
    private setOverviewData(data: any) {
        // this.currentConditions = data.currentConditions;
        // this.gaugeData = data.gaugeData;
        // this.extremes = data.extremes;
        // this._chartData = data.chartData;
        // this.setChartDataForSelected(this.selectedItem);
        
        
    }
    
    private setChartDataForSelected(item: string) {
        this.chartData = {
            labels: this._chartData.labels,
            series: this._chartData.series.find((item) => {
                return item.name === this.selectedItem;
            })
        };
    }
}