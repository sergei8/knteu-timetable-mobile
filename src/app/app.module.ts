// TODO: 1. Перенести time-table.json в облако MongoDB
// TOdo: 2. сделать возможность остановки/запуска логов на всех устройствах
//          через конфиг на сервере
// FIXME: 2. Спрятать как-то config.json
// FIXME: 3. Поправить в конфиге ссылку на time-table.json


import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {HttpClientModule} from '@angular/common/http';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AppRate} from '@ionic-native/app-rate';
import {Device} from '@ionic-native/device';
import {NetworkInterface} from '@ionic-native/network-interface';
import {ChartsModule} from 'ng2-charts/ng2-charts';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {firebaseConfig} from './credentials';
import {Push } from '@ionic-native/push';
import {SocialSharing} from '@ionic-native/social-sharing/ngx';

import {MyApp} from './app.component';
import {HomeComponent} from '../components/home/home';
import {TeacherComponent} from '../components/teacher/teacher';
import {StudentComponent} from '../components/student/student';

import {NewsComponent} from '../components/news/news';
// import {NewsDetailsComponent} from '../components/news-details/news-details';

import {RatingComponent} from '../components/rating/rating';
import {RatingStarsComponent} from '../components/rating-stars/rating-stars';
import {RatingChartComponent} from '../components/rating-chart/rating-chart';

import {DataProvider} from '../providers/data/data';
import {SharedObjects} from '../providers/shared-data/shared-data';
import {FirestoreLogProvider} from '../providers/firestore-log/firestore-log';
import {MongodbStitchProvider} from '../providers/mongodb-stitch/mongodb-stitch';

@NgModule({
  declarations: [
    MyApp,
    HomeComponent,
    TeacherComponent,
    StudentComponent,
    NewsComponent,
    RatingComponent,
    RatingStarsComponent,
    RatingChartComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    ChartsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomeComponent,
    TeacherComponent,
    StudentComponent,
    NewsComponent,
    RatingComponent,
    RatingStarsComponent,
    RatingChartComponent,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppRate,
    Device,
    NetworkInterface,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    SharedObjects,
    FirestoreLogProvider,
    MongodbStitchProvider,
    Push,
    SocialSharing,
  ]
})
export class AppModule {
}
