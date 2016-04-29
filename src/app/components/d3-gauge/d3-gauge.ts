// Import angular2 modules
import { Component, Input } from 'angular2/core';

// Import custom modules

@Component({
    templateUrl: 'app/components/d3-gauge/d3-gauge.html',
    styleUrls: [ 'app/components/d3-gauge/d3-gauge.css' ],
    selector: 'd3-gauge'
})

/**
 * Guage
 */
export class D3Gauge {
    
    private _gaugeID: string;
    
    // The value to display on the gauge, defaults to 0
    private _value: number = 0;
    @Input() set value(value: number) {
        this._value = value;
        
        // If the gauge has already been rendered on the screen
        // update its value, otherwise the value will be displayed when
        // rendering it
        if(this._isRendered)
            this.update();
    }
    
    // Configuration object for chaning the default apperance
    // of the gauge
    private _userConfig: any = { };
    @Input('config') set userConfig(config: any) {
        this._userConfig = config;
        
        // If the gauge is already rendered and this changes
        // then the gauge must be re-rendered
        if(this._isRendered) {
            this._isRendered = false;
            this.render();
        }
    }
    
    // Default Configuration Values for Gauge
    private _config: any = {
        // SVG Size Configuration Values
        size: 200,
        clipWidth: 200,
        clipHeight: 200,
        
        // Arc Configuration Values
        ringInset: 20,
        ringWidth: 60,
        arcColorFn: d3.interpolateHsl(d3.rgb('#D5202A'), d3.rgb('#006400')),
        
        // Pointer Configuration Values
        pointerWidth: 10,
        pointerTailLength: 5,
        pointerHeadLengthPercent: 0.9,
        transitionMs: 750,
        
        // Gauge Configuration Values
        minValue: 0,
        maxValue: 10,
        minAngle: -90,
        maxAngle: 90,
        majorTicks: 3,
        labelFormat: d3.format(',g'),
        labelInset: 10
    };
    
    // Keeps track of rendering state of the gauge, don't 
    // try to update the gauge value unless it is rendered first
    private _isRendered: boolean = false;
    
    // Handle on the gauge pointer so it can be easily updated
    // when the value changes
    private _pointer: any;
    private _scale: any;
    private _range: number;
    
    constructor() { 
        this._gaugeID = "gauge" + Date.now().toString() + Math.round(Math.random() * 100).toString();
        
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        //console.log(this._gaugeID); //NEED THIS FOR NOW TO SLOW DOWN RENDERING TO ENSURE UNIQUE IDs
        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
     }
    
    ngOnInit() { }
    
    ngAfterViewInit() {
        this.render();
    }
    
    private render() {
        // Merge default configuration with user defined configuration
        this.mergeConfigs();
        
        this._range = this._config.maxAngle - this._config.minAngle;
        var r = this._config.size / 2;
        var pointerHeadLength = Math.round(r * this._config.pointerHeadLengthPercent);
        this._scale = d3.scale.linear()
            .range([0, 1])
            .domain([this._config.minValue, this._config.maxValue]);
        var ticks = this._scale.ticks(this._config.majorTicks);
        var tickData = d3.range(this._config.majorTicks).map((val, index): number => {
            return 1 / this._config.majorTicks;
        });
        
        var arc = d3.svg.arc()
            .innerRadius(r - this._config.ringWidth - this._config.ringInset)
            .outerRadius(r - this._config.ringInset)
            .startAngle((d, i): number => {
                var ratio = <any>d * i;
                return this.degToRad(this._config.minAngle + (ratio * this._range));
            })
            .endAngle((d, i): number => {
                var ratio = <any>d * (i + 1);
                return this.degToRad(this._config.minAngle + (ratio * this._range));
            });
        
        // Get a handle on the html element to render the gauge in,
        // then create an svg element inside of it to build the gauge
        var svg = d3.select("#" + this._gaugeID)
            .append('svg:svg')
                .attr('class', 'gauge')
                .attr('width', this._config.clipWidth)
                .attr('height', this._config.clipHeight);
                                
        var centerTx = 'translate('+ r +',' + r + ')';
        
        var arcs = svg.append('g')
				.attr('transform', centerTx).attr('class', 'gauge');
		
		arcs.selectAll('path')
				.data(tickData)
			.enter().append('path')
				.attr('fill', (d, i) => {
					return this._config.arcColorFn(d * i);
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
                var ratio = this._scale(d);
                var newAngle = this._config.minAngle + (ratio * this._range);
                return 'rotate(' +newAngle +') translate(0,' + (this._config.labelInset - r) +')';
            })
            .text(this._config.labelFormat);
            
        var lineData = [ [this._config.pointerWidth / 2, 0], 
            [0, -pointerHeadLength],
            [-(this._config.pointerWidth / 2), 0],
            [0, this._config.pointerTailLength], 
            [this._config.pointerWidth / 2, 0] ];
        var pointerLine = d3.svg.line().interpolate('monotone');
        var pg = svg.append('g').data([lineData])
            .attr('class', 'pointer')
            .attr('transform', centerTx);
        this._pointer = pg.append('path')
            .attr('d', pointerLine)
            .attr('transform', 'rotate(' + ((this._config.minAngle + this._config.maxAngle) / 2) + ')');
        
        this._isRendered = true;
        this.update();
    }
    
    private update() {
        // Calculate the angle to move the gauge needle to
        var ratio = this._scale(this._value);
        var newAngle = this._config.minAngle + (ratio * this._range);
        
        // Now move the needle while animating the transition
        this._pointer.transition()
            .duration(this._config.transitionMs)
            .ease(d3.ease("elastic", 1, 1.5))
            .attr('transform', 'rotate(' + newAngle + ')');
    }
    
    private mergeConfigs() {
        // Merge user config with defualt configuration, final configuration
        // is stored in this._config
        for(var attributeName in this._userConfig) {
            this._config[attributeName] = this._userConfig[attributeName];
        }
    }
    
    private degToRad(deg: number): number {
        return (deg * Math.PI) / 180;
    }
}