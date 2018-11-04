import {Component} from '@angular/core';
import {MongodbStitchProvider} from '../../providers/mongodb-stitch/mongodb-stitch';
import {SharedObjects} from '../../providers/shared-data/shared-data';

@Component({
  selector: 'rating',
  templateUrl: 'rating.html'
})
export class RatingComponent {

  text: any;
  client;

  constructor(private mongodbStitchProvider: MongodbStitchProvider,
              private sharedObjects: SharedObjects) {
    mongodbStitchProvider.initClient();
    console.log(this.sharedObjects.teacherRate, this.sharedObjects.currentUserDeviceId);
  }

}
