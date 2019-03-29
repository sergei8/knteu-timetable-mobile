import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {StudentTtComponent} from './student-tt';

@NgModule({
  declarations: [StudentTtComponent],
  imports: [IonicPageModule.forChild(StudentTtComponent)],
})

export class StudentTtModule {
}
