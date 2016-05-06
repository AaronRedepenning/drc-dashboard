// Import AngularJS Modules
import { Component } from 'angular2/core';
 
// Import Custom Modules
import * as L from 'leaflet';
import { FluxmapService } from '../../services/fluxmap-service';

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
    private _heatmapDataArray: any = [
        {data: []},
        {data: []},
        {data: []},
        {data: []},
        {data: []}
    ];
    
    availableZIndexes: number[] = [1, 2, 3, 4, 5];
    private _zIndex: number = this.availableZIndexes[0];
    set zIndex(item: number) {
        this._zIndex = item;
        this.setHeatmapDataForZIndex();
    }
    get zIndex(): number {
        return this._zIndex;
    }
    
    private _heatmapOverlay: HeatmapOverlay;
    
    constructor(private _fluxmapService: FluxmapService) {}
    
    ngOnInit() {
        console.log("FluxMap.ngOnInit()");
        
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
        
        this._heatmapOverlay = new HeatmapOverlay(config);
                
        // 3) Show fluxmap in div with id="fluxmap"
        var fluxmap = L.map('fluxmap', {
            crs: L.CRS.Simple,
            minZoom: -1,
            layers: [floorPlanLayer, this._heatmapOverlay],
            maxBounds: bounds,
            dragging: true,
            scrollWheelZoom: true
        });
        fluxmap.fitBounds(bounds);
        var marker = L.marker([(275 / 5) * 2, (550 / 10) * 5]).addTo(fluxmap);
                
        // Generate heatmap data from the server
        this._fluxmapService.getFluxmapData() 
            .subscribe(
                data => {
                    this._heatmapDataArray = data;
                    this.setHeatmapDataForZIndex();
                    console.log(data);
                },
                error => console.log(error)
            )
        
        // Start 5 second interval to update Fluxmap with new data
        this.intervalID = setInterval(()=> {
            this._fluxmapService.getFluxmapData()
                .subscribe(
                    data => {
                        this._heatmapDataArray = data;
                        this.setHeatmapDataForZIndex();
                        console.log(data);
                    },
                    error => console.log(error)
                )
        }, 5000);
    }
    
    private setHeatmapDataForZIndex() {
        console.log("Setting new heatmap data at index: " + this._zIndex);
        this._heatmapOverlay.setData({data: []});
        this._heatmapOverlay.setData(this._heatmapDataArray[this._zIndex - 1]);
    }
    
    public toggleFullscreen() {
        var elem = document.getElementById('fluxmap');
        if(elem.requestFullscreen) {
            elem.requestFullscreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen();
        } 
    }
    
    ngOnDestroy() {
        clearInterval(this.intervalID);
        console.log("ngOnDestroy()"); // For debugging purposes
    }
}