import {Component} from '@angular/core';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {DataProvider} from '../../providers/data/data';
import {StudentTtComponent} from '../student-tt/student-tt';
import {Nav} from 'ionic-angular';

import {FirestoreLogProvider} from '../../providers/firestore-log/firestore-log';

import * as _ from 'lodash';
import * as $ from 'jquery';

@Component({
  selector: 'student',
  templateUrl: 'student.html'
})
export class StudentComponent {

  facNameList: string[] = [];
  courseList: string[] = [];
  groupList: string[] = [];
  allTimeTable = {};    //   сюда передается общее расписание

  selectedFacName: string;
  selectedCourse: string;
  selectedGruppa: string;


  wdp: object;    // объект куда формируется расписание выбранной группы

  constructor(public nav: Nav, private sharedObjects: SharedObjects,
              private data: DataProvider,
              private fireStore: FirestoreLogProvider) {
    this.allTimeTable = this.sharedObjects.allTimeTable;
    if (!this.sharedObjects.isConnected) {
      this.data.showToastMessage(' Нема доступу до розкладу в мережі!', 'bottom',
        'warningToast', true, 0);
    }

    this.facNameList = this.data.getFacNameList();
    this.groupList = [];
  }

  getCourseList() {

    let courseNamberList = [];
    _.each(this.allTimeTable, (fio) =>
      _.forEach(this.sharedObjects.weekNames.map(x => fio[x]), (week) =>
        _.each(week, (day) =>
          _.each(day, (para) => {
              let facName = para[0];
              let courseNumber = para[1];
              if ((facName == this.selectedFacName) && !(_.includes(courseNamberList, courseNumber))) {
                courseNamberList.push(courseNumber);
              }
            }
          )
        )
      )
    );

    this.courseList = courseNamberList.sort();
    this.groupList = [];

  }

  getGroupList() {
    let groupNumberList = [];

    _.each(this.allTimeTable, (fio) =>
      _.forEach(this.sharedObjects.weekNames.map(x => fio[x]), (week) =>
        _.each(week, (day) =>
          _.each(day, (para) => {
              let facName = para[0];
              let courseNumber = para[1];
              let groupNumber = this.extractGroupNumber(para[2]);
              if ((facName == this.selectedFacName)
                && (courseNumber == this.selectedCourse)
                && !(_.includes(groupNumberList, groupNumber))) {
                groupNumberList.push(groupNumber);
              }
            }
          )
        )
      )
    );

    this.groupList = groupNumberList.sort();
  }

  // извлекает из параметра первую группу, если на лекции их несколько
  // '1,2,3,4' - выберет 1-ю группу
  extractGroupNumber(groupsString) {
    return groupsString.split(',')[0];
  }


  okClicked() {

    this.wdp = $.extend(true, {}, this.sharedObjects.WeekDayPara);    //  очищаем расписание группы

    _.each(this.allTimeTable, (fio, teacherName) =>
      _.each(fio, (week, weekName) =>
        _.each(week, (day, dayName) =>
          _.each(day, (para, paraNumber) => {
              if (this.selectedFacName === para[0]
                && this.selectedCourse === para[1]
                && para[2].split(',').indexOf(this.selectedGruppa) !== -1) {

                if (this.wdp[weekName][dayName][paraNumber].length !== 0) {
                  this.wdp[weekName][dayName][paraNumber] = this.wdp[weekName][dayName][paraNumber]
                    .concat([[para[5], para[3], para[4], teacherName]]);
                } else {
                  this.wdp[weekName][dayName][paraNumber] = [[].concat(para[5], para[3], para[4], teacherName)];
                }
              }
            }
          )
        )
      )
    );

    this.fireStore.setStudentPageLog(this.selectedFacName, this.selectedCourse, this.selectedGruppa).then();

    this.nav.push('StudentTtComponent',
      {
        wdp: this.wdp,
        facName: this.selectedFacName,
        course: this.selectedCourse,
        group: this.selectedGruppa
      });

  }

}

