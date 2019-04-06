import {Component} from '@angular/core';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {DataProvider} from '../../providers/data/data';
import {FirestoreLogProvider} from '../../providers/firestore-log/firestore-log';
import {Nav} from 'ionic-angular';
// import {TeacherTtComponent} from '../teacher-tt/teacher-tt';

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
      this.data.showToastMessage('Нема доступу до розкладу в мережі!', 'bottom',
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

    const teacherInfo: any[] = this.data.getTeacherWdp(teacher);
    this.wdp = teacherInfo[0];
    this.teacherDetails = teacherInfo[1];

    // логировать если разрешено
    if (!this.sharedObjects.stopLogging) {
      this.fireStore.setTeacherPageLog(teacher).then().catch();
    }

    this.nav.push('TeacherTtComponent',
      {
        wdp: this.wdp,
        teacher: teacher,
        details: this.teacherDetails
      }).then().catch();

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
