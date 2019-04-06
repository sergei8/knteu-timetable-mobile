import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {NewsDetailsComponent} from './news-details';

@NgModule({
  declarations: [NewsDetailsComponent],
  imports: [IonicPageModule.forChild(NewsDetailsComponent)],
})

export class NewsDetailModule {
}
