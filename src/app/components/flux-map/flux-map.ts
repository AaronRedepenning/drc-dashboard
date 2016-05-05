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
    
    private _intervalID : any;
    private _heatmapOverlay: HeatmapOverlay;
    private _zHeight: number;
    
    constructor(private _fluxmapSerivce: FluxmapService) { }
    
    ngOnInit() {
        
        let height : number = 275;
        let width  : number = 550;
        let bounds : L.LatLngBounds = L.latLngBounds(new L.LatLng(0, 0), new L.LatLng(height, width));
        
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
                
        // Get fluxmap data from the server
        this.getFluxmapData();
        
        // Setup interval to update the fluxmap every 5 seconds
        // with new data from the server
        setInterval(this.getFluxmapData(), 5000);
    }
    
    ngOnDestroy() {
        clearInterval(this._intervalID);
        console.log("ngOnDestroy()"); // For debugging purposes
    }
    
    private getFluxmapData() {
        this._fluxmapSerivce.getFluxmapData()
            .subscribe(
                data => this.setNewData(data),
                error => console.log(error)
            );
    }
    
    private setNewData(data: any[]) : void {
        let fluxmapData : HeatmapData = {
            data: data[0].data,
            min: data[0].min,
            max: data[0].max
        };
        this._heatmapOverlay.setData(fluxmapData);
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