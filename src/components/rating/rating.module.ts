import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {RatingComponent} from './rating';
// import {RatingChartComponent} from '../rating-chart/rating-chart';
import {RatingStarsComponent} from '../rating-stars/rating-stars';

@NgModule({
  declarations: [RatingComponent, RatingStarsComponent,],
  imports: [IonicPageModule.forChild(RatingComponent)],
  // entryComponents: [RatingChartComponent, RatingStarsComponent,]
})

export class RatingModule {
}
