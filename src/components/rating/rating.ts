import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {NavParams} from 'ionic-angular';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {DataProvider} from '../../providers/data/data';

@Component({
  selector: 'rating',
  templateUrl: 'rating.html'
})
export class RatingComponent {

  details: object;
  img_url: string;
  showAvatar: boolean; // не виводіт аватар препода, если нет фотки
  last: string; // фамілія
  first: string; // імя
  middle: string; // отчество
  teacherRatingList: object;
  settedRate: number = 0; // выбранный рейт

  constructor(private sharedObjects: SharedObjects,
              public nav: NavController, public navParams: NavParams,
              public data: DataProvider) {

    this.showAvatar = true;

    this.details = navParams.get('details');
    // получіть адрес фоткі
    try {
      this.img_url = this.details['img_url'];
    }

    catch {
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

    this.teacherRatingList = this.sharedObjects.teacherInfo.currentRates;
  }

  acceptClicked() {
    this.writeRateToDb()
      .then(() => {
        this.data.showToastMessage('Дякуємо! Вашу думку враховано.', 'bottom',
          'infoToast', false, 5000);
      })
      .then(() => {
        this.nav.pop().then(() => {
        });
      })
      .catch((err) => console.log(err))

  }

  writeRateToDb(): Promise<any> {
    // обновить this.sharedObjects.teacherInfo.currentRates выставленным рейтингом `settedRate`

    const newRateObj = {
      'date': new Date(),
      'rating': this.settedRate
    };

    return new Promise<any>(resolve => {
      if (this.sharedObjects.teacherInfo.newUserId) {
        this.sharedObjects.teacherInfo.rateList[this.sharedObjects.currentUserDeviceId] = [newRateObj]
      } else {
        this.sharedObjects.teacherInfo.rateList[this.sharedObjects.currentUserDeviceId].push(newRateObj)
      }

      const teacherDoc = {
          name: this.sharedObjects.teacherInfo.teacherName,
          rateList: this.sharedObjects.teacherInfo.rateList
        };

       this.data.writeTeacherRates(teacherDoc);

      resolve();
    });

  }


}
