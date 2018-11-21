import {Component, OnInit} from '@angular/core';
import {NavController} from 'ionic-angular';
import {NavParams} from 'ionic-angular';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {DataProvider} from '../../providers/data/data';
import {FirestoreLogProvider} from '../../providers/firestore-log/firestore-log'
import {Device} from '@ionic-native/device';

import {MongodbStitchProvider} from '../../providers/mongodb-stitch/mongodb-stitch';

@Component({
  selector: 'rating',
  templateUrl: 'rating.html'
})
export class RatingComponent implements OnInit {

  details: object;
  img_url: string;
  showAvatar: boolean; // не виводіт аватар препода, если нет фотки
  last: string; // фамілія
  first: string; // імя
  middle: string; // отчество
  teacherRatingList: object;
  settedRate: number = 0; // выбранный рейт

  constructor(public sharedObjects: SharedObjects,
              public nav: NavController, public navParams: NavParams,
              public data: DataProvider,
              public fireStore: FirestoreLogProvider,
              private mongodbStitchProvider: MongodbStitchProvider,
              public device: Device) {

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

  ngOnInit() {

    if (!this.sharedObjects.stopLogging) {
      this.fireStore.setRatingPageLog(this.sharedObjects.teacherInfo.teacherName)
        .then().catch()
    }

  }

  /**
   * выполняет цепочку асинхронных функций:
   *  - запись рейта в БД
   *  - вывод высплывающего сообщение
   *  - запись статистики в лог
   *  - возврат на предыдущий экран
   */
  acceptClicked(): void {
    this.writeRateToDb()
      .then((): void => {
        this.data.showToastMessage('Дякуємо! Вашу думку враховано.', 'bottom',
          'infoToast', false, 4000);
      })
      .then((): void => {
        if (!this.sharedObjects.stopLogging) {
          this.fireStore.setRatingPageLog(this.sharedObjects.teacherInfo.teacherName,
            "vote")
            .then().catch()
        }
      })
      .then((): void => {
        this.nav.popTo(this.nav.getByIndex(this.nav.length()-2));
/*
        this.nav.pop().then(() => {
        });
*/
      })
      .catch((err) => console.log('Ошибка в Rating: ', err))

  }

  writeRateToDb(): Promise<any> {
    // обновить this.sharedObjects.teacherInfo.currentRates выставленным рейтингом `settedRate`

    return new Promise<any>(resolve => {

      // console.log('*******', this.sharedObjects.teacherInfo, this.device.uuid);
      const newRateObj = {
        'date': new Date(),
        'rating': this.settedRate
      };

      if (this.sharedObjects.teacherInfo.newUserId) {
        this.sharedObjects.teacherInfo.rateList[this.device.uuid] = [newRateObj];
        this.sharedObjects.teacherInfo.newUserId = true;

      } else {
        this.sharedObjects.teacherInfo.rateList[this.device.uuid].push(newRateObj);
        this.sharedObjects.teacherInfo.newUserId = false;
      }

      const teacherDoc = {
        name: this.sharedObjects.teacherInfo.teacherName,
        rateList: this.sharedObjects.teacherInfo.rateList
      };

      // this.data.writeTeacherRates(teacherDoc);
      this.mongodbStitchProvider.writeTeacherDoc(teacherDoc['rateList'], teacherDoc['name'])
        .then(() => resolve());

      // resolve();
    });

  }


}
