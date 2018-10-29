import {Component} from '@angular/core';
import {MongodbStitchProvider} from '../../providers/mongodb-stitch/mongodb-stitch';

@Component({
  selector: 'rating',
  templateUrl: 'rating.html'
})
export class RatingComponent {

  text: any;
  client;

  constructor(private mongodbStitchProvider: MongodbStitchProvider) {
/*
    mongodbStitchProvider.initClient();
    this.text = mongodbStitchProvider.getTeacherRating();
*/

  }

}
