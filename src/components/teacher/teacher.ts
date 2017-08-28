import { Component } from '@angular/core';

/**
 * Generated class for the TeacherComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'teacher',
  templateUrl: 'teacher.html'
})
export class TeacherComponent {

  text: string;

  constructor() {
    console.log('Hello TeacherComponent Component');
    this.text = 'Hello World';
  }

}
