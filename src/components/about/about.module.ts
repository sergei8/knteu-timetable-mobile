import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {AboutComponent} from './about';

@NgModule({
  declarations: [AboutComponent],
  imports: [IonicPageModule.forChild(AboutComponent)],
})

export class AboutModule {
}
