import {Component} from '@angular/core';
import {Nav} from 'ionic-angular';
import {NavParams} from 'ionic-angular';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {AlertController} from 'ionic-angular';
import {DataProvider} from '../../providers/data/data';
import {async} from "rxjs/internal/scheduler/async";

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

  // navPromise = new Promise(() => this.nav.pop());

  constructor(private sharedObjects: SharedObjects,
              public nav: Nav, public navParams: NavParams,
              private alert: AlertController,
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

  async acceptClicked() {

    let confirm = this.alert.create({
      message: 'Дякуемо! Вашу думку враховано',
      enableBackdropDismiss: false,
      buttons: [
        {
          text: 'Ок',
          cssClass: 'alertButton',
          handler: () => {
            this.writeRateToDb()
              .then(() => confirm.dismiss());
            return false;
            // this.data.addNewUserRate(this.details['name'], this.sharedObjects.currentUserDeviceId, 5);
          }
        }
      ]
    });
    await this.nav.pop().then();
    await confirm.present().then();


  }

  writeRateToDb(): Promise<any> {
    // обновить this.sharedObjects.teacherInfo.currentRates выставленным рейтингом `settedRate`

    const newRateObj = {
      'date': Date.now(),
      'rating': this.settedRate
    };

    return new Promise<any>(resolve => {
      if (this.sharedObjects.teacherInfo.newUserId) {
        console.log('********', [newRateObj])
        this.sharedObjects.teacherInfo.rateList[this.sharedObjects.currentUserDeviceId] = [newRateObj]
      } else {
        this.sharedObjects.teacherInfo.rateList[this.sharedObjects.currentUserDeviceId].push(newRateObj)
      }
      console.log('new rate:', this.settedRate)
      console.log(this.sharedObjects.teacherInfo);
      console.log(this.sharedObjects.currentUserDeviceId);

      resolve(null);

    });

  }


}
