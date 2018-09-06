import {Component} from '@angular/core';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {DataProvider} from '../../providers/data/data';
import {Nav} from 'ionic-angular';
import {TeacherTtComponent} from '../teacher-tt/teacher-tt';

import * as _ from 'lodash';
// import * as $ from 'jquery';

@Component({
  selector: 'teacher',
  templateUrl: 'teacher.html'
})
export class TeacherComponent {

  allTimeTable = {};    //   сюда передается общее расписание
  wdp: object;          // объект куда формируется расписание преподавателя
  teachers: string[];
  placeholder = 'Введіть прізвище';
  teacherDetails: Object;

  constructor(public nav: Nav,
              private sharedObjects: SharedObjects,
              private data: DataProvider) {

    this.allTimeTable = this.sharedObjects.allTimeTable;
    if (!this.sharedObjects.isConnected) {
      this.data.showToastMessage('У Вас відсутнє підключення до Мережі!', 'bottom',
        'warningToast', true, 3000);
    }
    // showToastMessage(message, position, cssClass, showCloseButton, duration) {

  }


  getTeacher(ev: any): Array<string> {

    // построіть сортірований почіщенний спісок преподов
    const rgx = new RegExp('^(ас )|^(проф )|^(вик )|^(доц )|^(ст в )');
    let fullList = _.filter(Object.keys(this.allTimeTable).sort(), (x) => rgx.exec(x));

    // получить вводиое поисковое значеие
    let input = ev.target.value;

    if (!input) return [];

    //  начиная с 2-й введенной буквы фильтруем полный список по этим вхождениям
    if (input.trim().length >= 2) {
      this.teachers = fullList.filter((item) => {
        return (item.toLowerCase().indexOf(input.toLowerCase()) > -1);
      })
    }
    else {
      return [];
    }

  }

  selectedTeacher(teacher) {

    // this.wdp = $.extend(true, {}, this.sharedObjects.WeekDayPara);    //  очищаем расписание группы

    const teacheInfo: any[] = this.data.getTeacherWdp(teacher);
    this.wdp = teacheInfo[0];
    this.teacherDetails = teacheInfo[1];

    /*
        _.each(this.allTimeTable, (fio, teacherName) =>
          _.each(this.sharedObjects.weekNames.map(x => fio[x]), (week, weekIndex) =>
            _.each(week, (day, dayName) =>
              _.each(day, (para, paraNumber) => {
                  if (teacherName === teacher) {
                    this.teacherDetails = fio.details;
                    let weekName = this.sharedObjects.weekNames[weekIndex];
                    this.wdp[weekName][dayName][paraNumber] = [].concat(para[5], para[3], para[4],
                      para[0], para[1], para[2]);
                  }
                }
              )
            )
          )
        );
    */

    this.nav.push(TeacherTtComponent,
      {
        wdp: this.wdp,
        teacher: teacher,
        details: this.teacherDetails
      });

  }

}
