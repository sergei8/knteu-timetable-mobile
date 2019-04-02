import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {Nav} from 'ionic-angular';

import {MongodbStitchProvider} from '../../providers/mongodb-stitch/mongodb-stitch';
import {FirestoreLogProvider} from '../../providers/firestore-log/firestore-log';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {DataProvider} from '../../providers/data/data';


@IonicPage()
@Component({
  selector: 'news',
  templateUrl: 'news.html'
})
export class NewsComponent {

  text: string;
  shortNewsList: Object[];

  constructor(public nav: Nav, private mongodbStitchProvider: MongodbStitchProvider,
              private  fireStore: FirestoreLogProvider,
              private sharedObjects: SharedObjects,
              private data: DataProvider) {

    if (!this.sharedObjects.isConnected) {
      this.data.showToastMessage('Відсутній доступ до інтернет', 'bottom',
        'warningToast', true, 3000);
    }

    console.log('Hello NewsComponent Component');
    this.text = 'Hello World';

  }


  ionViewDidLoad() {
    if (!this.sharedObjects.stopLogging) {
      this.fireStore.setHomePageLog().then().catch()
    }
    this.mongodbStitchProvider.getShortNewsList()
      .then((res)=> console.log(res));
    ;

  }


}
