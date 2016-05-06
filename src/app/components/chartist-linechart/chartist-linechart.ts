// Import angular2 modules
import { Component, Input } from 'angular2/core';

// Import Custom Modules

@Component({
    templateUrl: 'app/components/chartist-linechart/chartist-linechart.html',
    styleUrls: [ 'app/components/chartist-linechart/chartist-linechart.css' ],
    selector: 'chartist-linechart'
})
/**
 * ChartistLinechart
 */
export class ChartistLinechart {
    
    private _chartID: string;
    
    private _chartClass: string = 'ct-golden-section';
    @Input('chartClass') set containerClass(chartClass: string) {
        this._chartClass = chartClass;
    }
    
    // Allows the user to configure the chart as they need by binding to a new 
    // set of chart options
    private _userChartOptions: Chartist.ILineChartOptions = { };
    @Input('options') set userChartOptions(options: Chartist.ILineChartOptions) {
        this._userChartOptions = options;
        this.mergeChartOptions();
        if(this._isRendered)
            this.update();
    }
    
    // Default Chartist Linechart Options
    private _chartOptions: Chartist.ILineChartOptions = { 
        axisX: {
            showLabel: false
        },
        fullWidth: true,
        showArea: true,
        plugins: [
            Chartist.plugins.ctAxisTitle({
                axisX: {
                    axisTitle: 'Time (sec)',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: 0,
                        y: 20
                    },
                    textAnchor: 'middle'
                },
                axisY: {
                    axisTitle: 'Temperature',
                    axisClass: 'ct-axis-title',
                    offset: {
                        x: -35,
                        y: 0
                    },
                    flipTitle: false
                }
            })
        ]
    };
    
    // Chart data, initially empty until set by user
    private _chartData: Chartist.IChartistData = {
        labels: [],
        series: [[]]
    };
    @Input('data') set chartData(data: Chartist.IChartistData) {
        this._chartData = data;
        if(this._isRendered)
            this.update();
    }
    
    private _chart: Chartist.IChartistLineChart;
    private _isRendered: boolean = false;
    
    constructor() { 
        this._chartID = "linechart" + Date.now().toString() + Math.round(Math.random() * 100).toString();
    }
    
    ngOnInit() { }
    
    ngAfterViewInit() {
        this.render();
    }
    
    private render() {
        // Merge user options with default options
        this.mergeChartOptions();
        
        // Render the chart
        this._chart = new Chartist.Line('#' + this._chartID, this._chartData, this._chartOptions);
        this._isRendered = true;
    }
    
    private update() {
        this.mergeChartOptions();
        this._chart.update(this._chartData, this._chartOptions, true);
    }
    
    private mergeChartOptions() {
        console.log("Merging chart options");
        for(var attributeName in this._userChartOptions) {
            this._chartOptions[attributeName] = this._userChartOptions[attributeName];
        }
    }
}