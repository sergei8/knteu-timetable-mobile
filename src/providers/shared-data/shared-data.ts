import {Injectable} from '@angular/core';


@Injectable()

export class SharedObjects {
  allTimeTable: object;


  constructor() {
    this.allTimeTable = {};
  }
}
