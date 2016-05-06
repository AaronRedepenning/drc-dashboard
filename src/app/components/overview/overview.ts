// Import angular2 modules
import { Component } from 'angular2/core';

// Import custom modules
import { D3Gauge } from '../d3-gauge/d3-gauge';
import { ChartistLinechart } from '../chartist-linechart/chartist-linechart';
import { OverviewService } from '../../services/overview-service';
import { 
    temperatureChartOptions, 
    pressureChartOptions,
    humidityChartOptions,
    lightChartOptions
} from './overview-chart-options';

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
    
    intervalID: any;
    
    currentConditions: any = {
        temperature: 0,
        humidity: 0,
        pressure: 0,
        dewpoint: 0,
        lightIntensity: 0
    };
    
    extremeConditions: any = {
        temperature: {
            min: 0,
            max: 0,
            average: 0
        },
        humidity: {
            min: 0,
            max: 0,
            average: 0
        },
        pressure: {
            min: 0,
            max: 0,
            average: 0
        },
        lightIntensity: {
            min: 0,
            max: 0,
            average: 0
        }
    };
    
    gaugeData: any = {
        tempHumGauge: 0,
        lightGauge: 0
    };
    
    chartData: Chartist.IChartistData;
    private _chartOptionsArray: Chartist.ILineChartOptions[] = [
        temperatureChartOptions,
        humidityChartOptions,
        pressureChartOptions,
        lightChartOptions
    ];
    chartOptions: Chartist.ILineChartOptions = this._chartOptionsArray[0];
    private _chartDataArray: any = {
        labels: [], series:[]
    }
    
    itemsToSelect: string[] = [
        'Temperature (°F)',
        'Humidity (%RH)',
        'Pressure (hPa)',
        'Light Intensity (lux)'
    ];
    private _selectedItem: string = this.itemsToSelect[0];
    set selectedItem(item: string) {
        this._selectedItem = item;
        this.setDataInChartForSelected(item);
    }
    get selectedItem(): string {
        return this._selectedItem;
    }
    get selectedItemIndex(): number {
        return this.itemsToSelect.indexOf(this.selectedItem);
    }
    
    /* Keep? */
    
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
        maxValue: 10,
        transitionMs: 2000
    };
    
    constructor(private _overviewService: OverviewService) { }
    
    ngOnInit() { 
        this._overviewService.getOverviewData() 
                .subscribe(
                    data => {
                        this.setDataInView(data);
                        console.log(data)
                    },
                    error => console.log(error)
                );
        this.start(); 
    }
    
    start() {
        this.intervalID = setInterval(()=> {
            this._overviewService.getOverviewData() 
                .subscribe(
                    data => {
                        this.setDataInView(data);
                        console.log(data)
                    },
                    error => console.log(error)
                );
        }, 10000);
    }
    
    private setDataInView(data: any) {
        this.currentConditions = data.currentConditions;
        this.gaugeData = data.gaugeData;
        this.extremeConditions = data.extremes;
        this._chartDataArray = data.chartData;
        this.setDataInChartForSelected(this.selectedItem);
    }
    
    private setDataInChartForSelected(item: string) {
        this.chartData = {
            labels: this._chartDataArray.labels,
            series: this._chartDataArray.series.find(function (element) {
                return element.name === item;
            }).data
        };
        console.log(this.chartData);
    }
    
    ngOnDestroy() { clearInterval(this.intervalID); }
}