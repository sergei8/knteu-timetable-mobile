import {Component} from '@angular/core';
import {Nav} from 'ionic-angular';
import {NavParams} from 'ionic-angular';
// import {MongodbStitchProvider} from '../../providers/mongodb-stitch/mongodb-stitch';
import {SharedObjects} from '../../providers/shared-data/shared-data';

// import {RatingStarsComponent} from '../rating-stars/rating-stars';

@Component({
  selector: 'rating',
  templateUrl: 'rating.html'
})
export class RatingComponent {

  // teacher: any;
  details: object;
  img_url: string;
  showAvatar: boolean; // не виводіт аватар препода, если нет фотки
  last: string; // фамілія
  first: string; // імя
  middle: string; // отчество

  constructor(private sharedObjects: SharedObjects,
              public nav: Nav, public navParams: NavParams) {

    // mongodbStitchProvider.initClient();

    this.showAvatar = true;

    this.details = navParams.get('details');
    // получіть адрес фоткі
    try {
      this.img_url = this.details['img_url'];
    } catch {
      this.showAvatar = false;
    }
    if (!this.img_url) {
      this.showAvatar = false
    }
    // распарсіть ФІО
    const name = this.details['name'].split(' ');
    this.last = name[0];
    this.first = name[1];
    this.middle = name[2];
  }

}
