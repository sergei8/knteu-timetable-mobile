import {Component} from '@angular/core';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {Nav} from 'ionic-angular';

@Component({
  selector: 'teacher',
  templateUrl: 'teacher.html'
})
export class TeacherComponent {

  allTimeTable = {};    //   сюда передается общее расписание
  wdp: object;          // объект куда формируется расписание преподавателя
  selectedTeacher: string;

  constructor(public nav: Nav, private sharedObjects: SharedObjects) {

    this.allTimeTable = this.sharedObjects.allTimeTable;
    // console.log((this.getFullTeacherList()))
  }

  getFullTeacherList() {
    return Object.keys(this.allTimeTable).sort();
  }

}
