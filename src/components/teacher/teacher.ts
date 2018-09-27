import {Component} from '@angular/core';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {DataProvider} from '../../providers/data/data';
import {FirestoreLogProvider} from '../../providers/firestore-log/firestore-log';
import {Nav} from 'ionic-angular';
import {TeacherTtComponent} from '../teacher-tt/teacher-tt';

import * as _ from 'lodash';

@Component({
  selector: 'teacher',
  templateUrl: 'teacher.html'
})
export class TeacherComponent {

  allTimeTable = {};    //   сюда передается общее расписание
  wdp: object;          // объект куда формируется расписание преподавателя
  teachers: string[];
  teacherDetails: Object;

  selectedFacName: string;
  selectedDepName: string;
  facNameList: string[];
  depNameList: string[];

  constructor(public nav: Nav,
              private sharedObjects: SharedObjects,
              private data: DataProvider,
              private  fireStore: FirestoreLogProvider) {

    if (!this.sharedObjects.isConnected) {
      this.data.showToastMessage('У Вас відсутнє підключення до Мережі!', 'bottom',
        'warningToast', true, 3000);
    }
    this.selectedFacName = null;
    this.selectedDepName = null;
    this.teachers = [];
    this.allTimeTable = this.sharedObjects.allTimeTable;
    this.facNameList = data.getFacDepNameList()['fac'];
    this.depNameList = data.getFacDepNameList()['dep'];
  }


  getTeacher(ev: any): void {

    // построіть сортірований почіщенний спісок преподов
    const rgx = new RegExp('^(ас )|^(проф )|^(вик )|^(доц )|^(ст в )');
    let fullList = _.filter(Object.keys(this.allTimeTable).sort(), x => rgx.exec(x));

    // получить вводиое поисковое значеие
    let input = ev.target.value;
    // console.log(input);

    if (!input) {
      this.teachers = [];
      return;
    }

    //  начиная с 2-й введенной буквы фильтруем полный список по этим вхождениям
    if (input.trim().length >= 2) {
      this.teachers = fullList.filter(item => item.toLowerCase().indexOf(input.toLowerCase()) > -1
      )
    }
    else {
      this.teachers = [];
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

    this.fireStore.setTeacherPageLog(teacher).then().catch();

    this.nav.push(TeacherTtComponent,
      {
        wdp: this.wdp,
        teacher: teacher,
        details: this.teacherDetails
      });

  }

  /**
   * выбирает кафедры для конкретного фак-та
   * @param {string} facName - название фак-та
   */
  getDepsByFac(): void {
    this.depNameList = [];
    this.depNameList = this.data.getFacDepNameList(this.selectedFacName)['dep'];
  }

  /**
   * строит список преподавателей по выбранной в меню кафедре
   */
  getDepTeachers(): void {
    this.teachers = [];
    _.forEach(this.allTimeTable, (x, fio) => {
      if (x.details) {
        if (x.details.dep === this.selectedDepName) {
          this.teachers.push(fio);
        }
      }
    })
  }

  /**
   * строит список преподов для выбранного в меню факультета
   */
  getFacTeachers(): void {
    this.teachers = [];
    _.forEach(this.allTimeTable, (x, fio) => {
      if (x.details) {
        if (x.details.fac === this.selectedFacName) {
          this.teachers.push(fio);
        }
      }
    })

  }

  /**
   * вызывает построитель списка преподов для кафедры, если не выбрано,
   * то для факультета
   */
  okClicked() {
    if (this.selectedDepName) {
      this.getDepTeachers()
    } else {
      this.getFacTeachers();
    }
  }

}
