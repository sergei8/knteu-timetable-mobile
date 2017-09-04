import {Component} from '@angular/core';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {Nav} from 'ionic-angular';
import {TeacherTtComponent} from '../../components/teacher-tt/teacher-tt';

import * as _ from 'lodash';
import * as $ from 'jquery';

@Component({
  selector: 'teacher',
  templateUrl: 'teacher.html'
})
export class TeacherComponent {

  allTimeTable = {};    //   сюда передается общее расписание
  wdp: object;          // объект куда формируется расписание преподавателя
  teachers: string[];
  placeholder = 'Введіть прзвище';

  constructor(public nav: Nav, private sharedObjects: SharedObjects) {

    this.allTimeTable = this.sharedObjects.allTimeTable;
  }

  getFullTeacherList() {
    this.teachers = Object.keys(this.allTimeTable).sort();
  }

  getTeacher(ev: any) {

    this.getFullTeacherList();

    let teacher = ev.target.value;

    if (teacher && teacher.trim() != '') {
      this.teachers = this.teachers.filter((item) => {
        return (item.toLowerCase().indexOf(teacher.toLowerCase()) > -1);
      })
    }
  }

  selectedTeacher(teacher) {

    this.wdp = $.extend(true, {}, this.sharedObjects.WeekDayPara);    //  очищаем расписание группы

    _.each(this.allTimeTable, (fio, teacherName) =>
      _.each(fio, (week, weekName) =>
        _.each(week, (day, dayName) =>
          _.each(day, (para, paraNumber) => {
              if (teacherName === teacher) {
                this.wdp[weekName][dayName][paraNumber] = [].concat(para[5], para[3], para[4]);
              }
            }
          )
        )
      )
    );
    // console.log(this.wdp);

    this.nav.push(TeacherTtComponent,
      {
        wdp: this.wdp,
        teacher: teacher
      });

  }

}
