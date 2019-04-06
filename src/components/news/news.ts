import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {Nav} from 'ionic-angular';

import {MongodbStitchProvider} from '../../providers/mongodb-stitch/mongodb-stitch';
import {FirestoreLogProvider} from '../../providers/firestore-log/firestore-log';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {DataProvider} from '../../providers/data/data';
import {NewsDetailsComponent} from "../news-details/news-details";


// @IonicPage()
@Component({
  selector: 'news',
  templateUrl: 'news.html'
})
export class NewsComponent {

  text: string;
  shortNewsList: any;
  private showSpinner: boolean;

  constructor(public nav: Nav, private mongodbStitchProvider: MongodbStitchProvider,
              private  fireStore: FirestoreLogProvider,
              private sharedObjects: SharedObjects,
              private data: DataProvider) {

    if (!this.sharedObjects.isConnected) {
      this.data.showToastMessage('Відсутній доступ до інтернет', 'bottom',
        'warningToast', true, 3000);
      this.showSpinner = false;
    }
  }

  /**
   * вызывается после загрузки экрана
   * пишет лог, если разрешено
   * инициирует асинхронное чтение новостей из БД
   */
  ionViewDidLoad() {
/*
    if (!this.sharedObjects.stopLogging) {
      this.fireStore.setHomePageLog().then().catch()
    }
*/

    this.showSpinner = true;
    this.mongodbStitchProvider.getShortNewsList()
      .then((res) => {
        this.showSpinner = false;
        this.shortNewsList = res;
        console.log(this.shortNewsList)
      });

  }

  /**
   * загружает модуль отображения деталей новости и передает ему id новости
   * @param {string} newsId - id новости, и title новости
   */
  showNewsDetails(newsId: string, title: string): void {
    this.nav.push('NewsDetailsComponent',
      {
        newsId: newsId,
        title: title
      }).then().catch();
  }

}
