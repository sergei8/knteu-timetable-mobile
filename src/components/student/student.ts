import {Component} from '@angular/core';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {StudentTtComponent} from '../../components/student-tt/student-tt';
import {Nav} from 'ionic-angular';

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

  constructor(public nav: Nav, private sharedObjects: SharedObjects) {

    this.allTimeTable = this.sharedObjects.allTimeTable;
    this.getFacNameList();

  }

  getFacNameList() {

    let facNameList: string[] = [];

    _.each(this.allTimeTable, (fio) =>
      _.each(fio, (week) =>
        _.each(week, (day) =>
          _.each(day, (para) => {
              if (!(_.includes(facNameList, para[0]))) {
                facNameList.push(para[0]);    // build faculties menu
              }
            }
          )
        )
      )
    );

    this.facNameList = facNameList.sort();
    this.groupList = [];
    this.groupList = [];
  }

  getCourseList() {

    let courseNamberList = [];

    for (let fio in this.allTimeTable) {
      for (let week in this.allTimeTable[fio]) {
        for (let day in this.allTimeTable[fio][week]) {
          for (let para in this.allTimeTable[fio][week][day]) {
            let facName = _.values(this.allTimeTable[fio][week][day][para])[0];
            let courseNumber = _.values(this.allTimeTable[fio][week][day][para])[1];
            if ((facName == this.selectedFacName) && !(_.includes(courseNamberList, courseNumber))) {
              courseNamberList.push(courseNumber);
            }
          }
        }
      }
    }
    this.courseList = courseNamberList.sort();
    this.groupList = [];

  }

  getGroupList() {
    let groupNumberList = [];

    for (let fio in this.allTimeTable) {
      for (let week in this.allTimeTable[fio]) {
        for (let day in this.allTimeTable[fio][week]) {
          for (let para in this.allTimeTable[fio][week][day]) {
            let facName = _.values(this.allTimeTable[fio][week][day][para])[0];
            let courseNumber = _.values(this.allTimeTable[fio][week][day][para])[1];
            let groupNumber = _.values(this.allTimeTable[fio][week][day][para])[2];
            // push fac. group i number into array if it is not present yet
            if ((facName == this.selectedFacName)
              && (courseNumber == this.selectedCourse)
              && !(_.includes(groupNumberList, groupNumber))) {
              groupNumberList.push(groupNumber);
            }
          }
        }
      }
    }
    // groupNumberList.sort();
    this.groupList = groupNumberList.sort();
  }


  okClicked() {
    console.log(this.selectedFacName);
    console.log(this.selectedCourse);
    console.log(this.selectedGruppa);

    this.wdp = $.extend(true, {}, this.sharedObjects.WeekDayPara);    //  очищаем расписание группы

    _.each(this.allTimeTable, (fio, teacherName) =>
      _.each(fio, (week, weekName) =>
        _.each(week, (day, dayName) =>
          _.each(day, (para, paraNumber) => {
              if (this.selectedFacName === para[0]
                && this.selectedCourse === para[1]
                && this.selectedGruppa === para[2]) {
                this.wdp[weekName][dayName][paraNumber] = [].concat(para[5], para[3], para[4], teacherName);
              }
            }
          )
        )
      )
    );
    // console.log(this.wdp);

    this.nav.push(StudentTtComponent,
      {
        wdp: this.wdp,
        facName: this.selectedFacName,
        course: this.selectedCourse,
        group: this.selectedGruppa
      });

  }

}

