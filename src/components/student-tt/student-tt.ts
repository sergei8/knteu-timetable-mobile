import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {DataProvider} from  '../../providers/data/data';

import * as _ from 'lodash';

@Component({
  selector: 'student-tt',
  templateUrl: 'student-tt.html'
})
export class StudentTtComponent {

  wdp: object;
  facName: string;
  course: string;
  group: string;
  weekNames: string[];
  dayNamesList: string[];
  paraNamberList: string[];
  eyeOffSwitch: boolean[];
  eyeOnSwitch: boolean[];
  showAddButton: boolean;

  eyeIconSwitch = {};

  weekShowSwitch = {};   // скрывают/открывают дни недели

  constructor(public navParams: NavParams, private sharedObjects: SharedObjects,
              public data: DataProvider) {

    this.wdp = navParams.get('wdp');
    this.facName = navParams.get('facName');
    this.course = navParams.get('course');
    this.group = navParams.get('group');

    this.weekNames = this.sharedObjects.weekNames;
    this.dayNamesList = this.sharedObjects.dayNamesList;
    this.paraNamberList = this.sharedObjects.paraNamberList;

    this.eyeOffSwitch = [true, true];
    this.eyeOnSwitch = [false, false];

    this.showAddButton = this.sharedObjects.globalParams['saveRozklad'];

    // заполним переключатели видимости недель
    for (let i in this.weekNames) {
      this.weekShowSwitch[this.weekNames[i]] = true;
    }
  }

  // если пар нет - сигнализирует не выводить этот день
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

  // возвражает количество преподавателей на пару (м.б. 1 или 2)
  getPrepodsCount(week, day, para) {
    return _.range(this.wdp[week][day][para].length);
  }

  saveTimeTable() {
    const rozklad = {
      id: 'student',
      facName: this.facName,
      course: this.course,
      group: this.group,
      wdp: this.wdp
    };

    this.data.saveTimeTable(rozklad);
  }

}

