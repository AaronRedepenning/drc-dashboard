// Import angular2 modules
import { Component } from 'angular2/core';

// Import custom modules

@Component ({
    templateUrl: 'app/components/charts/charts.html',
    styleUrls: [ 'app/components/charts/charts.css' ],
    selector: 'charts'
})

/**
 * Admin
 */
export class Charts {
        
    Chart: Chartist.IChartistLineChart;
    ChartData: Chartist.IChartistData;
    ChartOptions: Chartist.ILineChartOptions;
    CurrentTime: number;
    
    constructor() { }
    
    ngOnInit() {
        // Set Chart options
        this.ChartOptions =  { 
            axisX: {
                showLabel: false
            },
            width: '100%',
            height: '60%',
            showArea: true,
            low: 0,
            high: 25,
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
        
        // Set Chart data
        this.ChartData = this.generateRandomData(30);
        
        // Render chart
        this.Chart = new Chartist.Line('#theChart', this.ChartData, this.ChartOptions);
        
        // Register interval for real time chart 
        setInterval(()=>{
            if(this.ChartData.labels.length > 0) {
                (<number[][]>this.ChartData.series)[0].shift();
                this.ChartData.labels.shift();   
            }
            
            (<number[][]>this.ChartData.series)[0].push(Math.floor(Math.random() * 20));
            (<number[]>this.ChartData.labels).push(Date.now());
            
            this.Chart.update(this.ChartData, this.ChartOptions);
        }, 1000);
        
    }
    
    generateRandomData(length: number): Chartist.IChartistData {
        var labelsData: number[]   = [];
        var seriesData: number[][] = [[]];        
        
        for(this.CurrentTime = 0; this.CurrentTime < length; this.CurrentTime++) {
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