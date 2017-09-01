import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";

/*
 Generated class for the DataProvider provider.

 See https://angular.io/docs/ts/latest/guide/dependency-injection.html
 for more info on providers and Angular DI.
 */
@Injectable()
export class DataProvider {

  constructor(public http: Http) {
    console.log('@@@@@@  Hello DataProvider Provider');
  }

  getFile(url): Observable<Object> {
    return this.http.get(url)
      .map(response => response.json());
  }

  /*
   getTimeTable() {
   return this.http.get('https://raw.githubusercontent.com/sergei8/TT-site/master/assets/db/time-table.json')
   .map(response => response.json());
   }
   */

}

export const TimeTable = {};
