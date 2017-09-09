import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {SharedObjects} from '../../providers/shared-data/shared-data';

import * as _ from 'lodash';

@Component({
  selector: 'teacher-tt',
  templateUrl: 'teacher-tt.html'
})
export class TeacherTtComponent {

  teacher: string;
  weekShowSwitch = {};   // скрывают/открывают дни недели
  wdp: object;
  weekNames: string[];
  dayNamesList: string[];
  paraNamberList: string[];
  eyeOffSwitch: boolean[];
  eyeOnSwitch: boolean[];

  constructor(public navParams: NavParams, private sharedObjects: SharedObjects) {
    console.log('Hello TeacherTtComponent Component');
    this.teacher = navParams.get('teacher');
    this.wdp = navParams.get('wdp');
    this.weekNames = this.sharedObjects.weekNames;
    this.dayNamesList = this.sharedObjects.dayNamesList;
    this.paraNamberList = this.sharedObjects.paraNamberList;
    this.eyeOffSwitch = [true, true];
    this.eyeOnSwitch = [false, false];

    // заполним переключатели видимости недель
    for (let i in this.weekNames) {
      this.weekShowSwitch[this.weekNames[i]] = true;
    }

  }

  checkForEmptyDay(day): boolean {
    let result = _.reduce(day, (acum, item) => acum += item.length, 0);
    return result > 0 ? true : false;
  }

  // видеть/скрыть дни недели `weekName`
  weekClicked(weekName, index) {
    this.eyeOffSwitch[index] = !this.eyeOffSwitch[index];
    this.eyeOnSwitch[index] = !this.eyeOnSwitch[index];
    this.weekShowSwitch[weekName] = !this.weekShowSwitch[weekName];
  }

}
