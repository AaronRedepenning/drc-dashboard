import { Http, Response } from 'angular2/http';
import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
/**
 * FluxmapService
 */
export class FluxmapService {
    private _fluxmapDataUrl = 'http://localhost:3000/fluxmap-data';
    
    constructor(private http: Http) { }
    
    getFluxmapData(): Observable<any> {
        return this.http.get(this._fluxmapDataUrl)
            .map(this.extractData)
            .catch(this.handleError);
    }
    
    private extractData(res: Response) {
        if(res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body.data || { };
    }
    
    private handleError(error: any) {
        let errorMsg = error.message || 'Server error';
        console.error(errorMsg);
        return Observable.throw(errorMsg);
    }
}