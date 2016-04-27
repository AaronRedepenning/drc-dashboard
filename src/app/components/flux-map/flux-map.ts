// Import AngularJS Modules
import { Component } from 'angular2/core';
 
// Import Custom Modules
import * as L from 'leaflet';
// HeatmapJS doesn't need import??

// FluxMap Class Decorator - used by AngularJS
@Component({
    selector: 'flux-map',
    templateUrl: 'app/components/flux-map/flux-map.html',
    styleUrls: [ 'app/components/flux-map/flux-map.css' ]
})

/**
 * FluxMap
 */
export class FluxMap {
    
    intervalID : any;
    
    constructor() {}
    
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
            "radius": 10,
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
            valueField: 'val'
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
        console.log(testData); // For debugging purposes
        heatmap.setData(testData);
    }
    
    private getRandomData(height : number, width : number) : HeatmapData {
        var length = 2000;
        var max = 0;
        var min = 100;
        var points : HeatmapDataPoint[] = [];
        
        while(length--) {
            var value = Math.floor(Math.random() * 100);
            max = Math.max(value, max);
            min = Math.min(value, min);
            
            let point : HeatmapDataPoint = {
                y: Math.floor(Math.random() * height),
                x: Math.floor(Math.random() * width),
                val: value
            };
            points.push(point);
        }
        
        let randomData : HeatmapData = {
            data : points,
            max : max,
            min : min
        };
        
        return randomData;
    }
}