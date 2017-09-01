import {Injectable} from '@angular/core';


@Injectable()

export class SharedTimeTable{
  timeTable:object;
  constructor(){
    this.timeTable={};
  }
}
