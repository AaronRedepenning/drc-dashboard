// Import angular2 modules
import { Component, Input } from 'angular2/core';

// Import custom modules

@Component({
    templateUrl: 'app/components/d3-gauge/d3-gauge.html',
    styles: [`
        g.arc {
            fill: steelblue;
        }

        g.pointer {
            fill: #e85116;
            stroke: #b64011;
        }

        g.label text {
            text-anchor: middle;
            font-size: 14px;
            font-weight: bold;
            fill: #666;
        }
  `],
    selector: 'd3-gauge'
})

/**
 * Guage
 */
export class D3Gauge {
    
    // Value to display
    private _value: number = 0;
    @Input()
    set value(value: number) {
        this._value = value;
        if(this.isRendered)
            this.update();
    }
    
    // Configuration Values - SVG
    @Input()
    size: number = 300;
    @Input()
    clipWidth: number = 300;
    @Input()
    clipHeight: number = 300;
    
    // State
    isRendered: boolean = false;
    
    // Configuration Values - Arc
    ringInset: number = 20;
    ringWidth: number = 60;
    arcColorFn: any = (val:number): string => { 
        if(val < 1/3) {
            return 'yellow';
        } else if(val < 2/3) {
            return 'green';
        } else {
            return 'red';
        } 
        
    } //d3.interpolateHsl(d3.rgb('yellow'), d3.rgb('red'));
    
    // Configuration Values - Pointer
    pointerWidth: number = 10;
    pointerTailLength: number = 5;
    pointerHeadLengthPercent: number = 0.9;
    transitionMs: number = 2000;
    
    // Configuration Value - Gauge
    minValue: number = 0;
    maxValue: number = 10;
    minAngle: number = -90;
    maxAngle: number = 90;
    majorTicks: number = 3;
    labelFormat: any = d3.format(',g');
    labelInset: number = 10;
    
    // Handle on the pointer to allow movement on updates
    pointer: any;
    range: number;
    
    constructor() {  }
    
    ngOnInit() {
        console.log('Creating Gauge...'); // For debug
        
        this.range = this.maxAngle - this.minAngle;
        var r = this.size / 2;
        var pointerHeadLength = Math.round(r * this.pointerHeadLengthPercent);
        var scale = d3.scale.linear()
            .range([0, 1])
            .domain([this.minValue, this.maxValue]);
        var ticks = scale.ticks(this.majorTicks);
        var tickData = d3.range(this.majorTicks).map((val, index): number => {
            return 1 / this.majorTicks;
        });
        
        var arc = d3.svg.arc()
            .innerRadius(r - this.ringWidth - this.ringInset)
            .outerRadius(r - this.ringInset)
            .startAngle((d, i): number => {
                var ratio = <any>d * i;
                return this.degToRad(this.minAngle + (ratio * this.range));
            })
            .endAngle((d, i): number => {
                var ratio = <any>d * (i + 1);
                return this.degToRad(this.minAngle + (ratio * this.range));
            });
        
        // Get a handle on the html element to render the gauge in,
        // then create an svg element inside of it to build the gauge
        var svg = d3.select("#d3-gauge-render")
            .append('svg:svg')
                .attr('class', 'gauge')
                .attr('width', this.clipWidth)
                .attr('height', this.clipHeight);
                
        var centerTx = 'translate('+ r +',' + r + ')';
        
        var arcs = svg.append('g')
				.attr('transform', centerTx).attr('class', 'gauge');
		
		arcs.selectAll('path')
				.data(tickData)
			.enter().append('path')
				.attr('fill', (d, i) => {
                    console.log(d * i);
					return this.arcColorFn(d * i);
				})
				.attr('d', <any>arc);
                
        // Create the chart labels
        var lg = svg.append('g')
            // .attr('class', 'label')
            .attr('transform', centerTx);
        lg.selectAll('text')
            .data(ticks)
            .enter().append('text')
            .attr('transform', (d):string => {
                var ratio = scale(d);
                var newAngle = this.minAngle + (ratio * this.range);
                return 'rotate(' +newAngle +') translate(0,' + (this.labelInset - r) +')';
            })
            .text(this.labelFormat);
            
        var lineData = [ [this.pointerWidth / 2, 0], 
            [0, -pointerHeadLength],
            [-(this.pointerWidth / 2), 0],
            [0, this.pointerTailLength], 
            [this.pointerWidth, 0] ];
        var pointerLine = d3.svg.line().interpolate('monotone');
        var pg = svg.append('g').data([lineData])
            .attr('class', 'pointer')
            .attr('transform', centerTx);
        this.pointer = pg.append('path')
            .attr('d', pointerLine)
            .attr('transform', 'rotate(' + ((this.minAngle + this.maxAngle) / 2) + ')');
        
        this.isRendered = true;
        this.update();
    }
    
    public update() {
        var scale = d3.scale.linear()
            .range([0, 1])
            .domain([this.minValue, this.maxValue]);
        var ratio = scale(this._value);
        var newAngle = this.minAngle + (ratio * this.range);
        this.pointer.transition()
            .duration(this.transitionMs)
            .ease(d3.ease("elastic", 1, 1.5))
            .attr('transform', 'rotate(' + newAngle + ')');
    }
    
    private degToRad(deg: number): number {
        return (deg * Math.PI) / 180;
    }
}