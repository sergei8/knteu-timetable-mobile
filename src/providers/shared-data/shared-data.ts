import {Injectable} from '@angular/core';


@Injectable()

export class SharedObjects {
  timeTable: object;

  constructor() {
    this.timeTable = {};
  }
}
