import {Component} from '@angular/core';
import {DomSanitizer} from "@angular/platform-browser";
import {IonicPage} from 'ionic-angular';
import {Nav} from 'ionic-angular';
import {NavParams} from 'ionic-angular';
import {MongodbStitchProvider} from '../../providers/mongodb-stitch/mongodb-stitch';
import {FirestoreLogProvider} from '../../providers/firestore-log/firestore-log'
import {SharedObjects} from '../../providers/shared-data/shared-data';

@IonicPage()
@Component({
  selector: 'news-details',
  templateUrl: 'news-details.html'
})
export class NewsDetailsComponent {

  newsId: string;
  title: string;
  details: Object;
  detailsHTML: string;
  showSpinner = true;

  constructor(public nav: Nav, public navParams: NavParams,
              public mongoStitch: MongodbStitchProvider,
              private sanitizer: DomSanitizer,
              private  fireStore: FirestoreLogProvider,
              private sharedObjects: SharedObjects) {

    this.newsId = this.navParams.get('newsId');
    this.title = this.navParams.get('title');

  }

  ionViewDidEnter() {

    if (!this.sharedObjects.stopLogging) {
      this.fireStore.setNewsDetailsPageLog(this.newsId).then().catch()
    }

    this.mongoStitch.getDetails(this.newsId)
      .then(res => {
        if (res) {
          this.details = res[0]['details'];
          this.detailsHTML = this.details['text'];
          this.showSpinner = false;
          // console.log(this.detailsHTML)
        }
        else {
          this.detailsHTML = 'нема деталей'
        }
      })
      .catch((e) => {
        console.log('error', e);
        this.showSpinner = false;
      })
  }

  safeHTML(detailsHTML) {
    // console.log("safeHTML");
    return this.sanitizer.bypassSecurityTrustHtml(detailsHTML)
    // return this.detailsHTML
  }
}
