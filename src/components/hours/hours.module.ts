import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {HoursComponent} from './hours';

@NgModule({
  declarations: [HoursComponent],
  imports: [IonicPageModule.forChild(HoursComponent)],
})

export class HoursModule {
}
