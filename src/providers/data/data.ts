import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";

@Injectable()
export class DataProvider {

  constructor(public http: Http) {
    console.log('@@@@@@  Hello DataProvider Provider');
  }

  getFile(url): Observable<Object> {
    return this.http.get(url)
      .map(response => response.json());
  }


}

