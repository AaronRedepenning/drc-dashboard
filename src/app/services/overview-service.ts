import { Http, Response } from 'angular2/http';
import { Injectable } from 'angular2/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
/**
 * OverviewService
 */
export class OverviewService {
    private _overviewDataUrl = './overview-data';
    
    constructor(private http: Http) { }
    
    getOverviewData(): Observable<any> {
        return this.http.get(this._overviewDataUrl)
            .map(res => res.json())
            .catch(this.handleError);
    }
    
    private extractData(res: Response) {
        if(res.status < 200 || res.status >= 300) {
            throw new Error('Bad response status: ' + res.status);
        }
        let body = res.json();
        return body || { };
    }
    
    private handleError(error: any) {
        let errorMsg = error.message || 'Server error';
        console.error(errorMsg);
        return Observable.throw(errorMsg);
    }
}