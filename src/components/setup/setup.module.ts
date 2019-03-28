import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {SetupComponent} from './setup';

@NgModule({
  declarations: [SetupComponent],
  imports: [IonicPageModule.forChild(SetupComponent)],
})

export class SetupModule {
}
