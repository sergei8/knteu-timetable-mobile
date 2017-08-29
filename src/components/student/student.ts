import {Component} from '@angular/core';

/**
 * Generated class for the TeacherComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'student',
  templateUrl: 'student.html'
})
export class StudentComponent {

  facNameList: string[] = [];
  courseList: string[] = [];
  groupList: string[] = [];

  constructor() {
    this.facNameList = ['ФОАІС', 'ФЕМП', 'ФМТП'];
    this.courseList = ['1', '2', '3'];
    this.groupList = ['11', '12', '13'];

  }

}
