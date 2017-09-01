import {Component} from '@angular/core';
import * as _ from 'lodash';
import {SharedTimeTable, SharedWDP} from '../../providers/shared-data/shared-data'

@Component({
  selector: 'student',
  templateUrl: 'student.html'
})
export class StudentComponent {

  facNameList: string[] = [];
  courseList: string[] = [];
  groupList: string[] = [];
  timeTable = {};

  selectedFacName: string;
  selectedCourse: string;
  selectedGruppa: string;

  constructor(private sharedTimeTable: SharedTimeTable) {

    this.timeTable = this.sharedTimeTable.timeTable;
    this.getFacNameList();

  }

  getFacNameList() {

    let facNameList: string[] = [];

    _.each(this.timeTable, (fio) =>
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

    for (let fio in this.timeTable) {
      for (let week in this.timeTable[fio]) {
        for (let day in this.timeTable[fio][week]) {
          for (let para in this.timeTable[fio][week][day]) {
            let facName = _.values(this.timeTable[fio][week][day][para])[0];
            let courseNumber = _.values(this.timeTable[fio][week][day][para])[1];
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

    for (let fio in this.timeTable) {
      for (let week in this.timeTable[fio]) {
        for (let day in this.timeTable[fio][week]) {
          for (let para in this.timeTable[fio][week][day]) {
            let facName = _.values(this.timeTable[fio][week][day][para])[0];
            let courseNumber = _.values(this.timeTable[fio][week][day][para])[1];
            let groupNumber = _.values(this.timeTable[fio][week][day][para])[2];
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
  }
}
