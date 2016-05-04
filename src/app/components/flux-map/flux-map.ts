// Import AngularJS Modules
import { Component } from 'angular2/core';
 
// Import Custom Modules
import * as L from 'leaflet';
import { FluxmapService } from '../../services/fluxmap-service';
// HeatmapJS doesn't need import??

// FluxMap Class Decorator - used by AngularJS
@Component({
    selector: 'flux-map',
    templateUrl: 'app/components/flux-map/flux-map.html',
    styleUrls: [ 'app/components/flux-map/flux-map.css' ],
    providers: [ FluxmapService ]
})

/**
 * FluxMap
 */
export class FluxMap {
    
    intervalID : any;
    
    constructor(private _fluxmapSerivce: FluxmapService) { }
    
    ngOnInit() {
        console.log("FluxMap.ngOnInit()");
        
        let height : number = 275;
        let width  : number = 550;
        let bounds : L.LatLngBounds = L.latLngBounds(new L.LatLng(0, 0), new L.LatLng(height, width));
        
        // Check that typescript is working so far
        console.log(bounds);
        
        // 1) Build first layer of fluxmap - DRCs floor plan
        let floorPlanLayer : L.ImageOverlay = L.imageOverlay('app/components/flux-map/FloorPlan.png', bounds);
        
        // 2) Start building heatmap with HeatmapJS
        let config : HeatmapConfiguration = {
            // radius should be small ONLY if scaleRadius is true (or small radius is intended)
            "radius": 60,
            "maxOpacity": .75, 
            // scales the radius based on map zoom
            "scaleRadius": true, 
            // if set to false the heatmap uses the global maximum for colorization
            // if activated: uses the data maximum within the current map boundaries 
            //   (there will always be a red spot with useLocalExtremas true)
            "useLocalExtrema": true,
            // which field name in your data represents the latitude - default "lat"
            latField: 'y',
            // which field name in your data represents the longitude - default "lng"
            lngField: 'x',
            // which field name in your data represents the data value - default "value"
            valueField: 'val',
            blur: 1
        };
        
        var heatmapLayer = new HeatmapOverlay(config);
        
        // Make sure HeatmapJS typescript is loaded correctly
        console.log(heatmapLayer);
        
        // 3) Show fluxmap in div with id="fluxmap"
        var fluxmap = L.map('fluxmap', {
            crs: L.CRS.Simple,
            minZoom: -1,
            layers: [floorPlanLayer, heatmapLayer],
            maxBounds: bounds,
            dragging: false,
            scrollWheelZoom: false
        });
        fluxmap.fitBounds(bounds);
                
        // Generate some random data for fluxmap
        this.setRandomData(height, width, heatmapLayer);
        
        // Start 5 second interval to update Fluxmap with new data
        this.intervalID = setInterval(() => {
            heatmapLayer.setData({data:[]});
            this.setRandomData(height, width, heatmapLayer);
        }, 5000);
    }
    
    ngOnDestroy() {
        clearInterval(this.intervalID);
        console.log("ngOnDestroy()"); // For debugging purposes
    }
    
    private setRandomData(height: number, width : number, heatmap : HeatmapOverlay) : void {
        var testData = this.getRandomData(height, width);
        heatmap.setData(testData);
    }
    
    private getRandomData(height : number, width : number) : HeatmapData {
        var rows = 10;
        var colums = 5;
        var length = 50; // Asuming 50 sensor nodes in the facility
        var max = 100;     // Ranging from 0 - 80 deg F
        var min = 0;
        var points : HeatmapDataPoint[] = [];
        
        for(var i = (height / colums) / 2; i < height; i += (height / colums)) {
            for(var j = (width / rows) / 2; j < width; j += (width / rows)) {
                var value = 60 + 40 * (Math.random() - 0.5);
                
                let point : HeatmapDataPoint = {
                    y: i,
                    x: j,
                    val: value
                };
                points.push(point);
            }
        }
        
        let randomData : HeatmapData = {
            data : points,
            max : max,
            min : min
        };
        
        this._fluxmapSerivce.getFluxmapData()
            .subscribe(
                data => console.log(data),
                error => console.log(error)
            );
        
        return randomData;
    }
    
    public toggleFullscreen() {
        var elem = document.getElementById('fluxmap');
        if(elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen();
        } 
    }
}