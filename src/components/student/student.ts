import { Component } from '@angular/core';

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

  text: string;

  constructor() {
    console.log('Hello student Component');
    this.text = 'Hello World';
  }

}
