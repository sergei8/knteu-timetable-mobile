// TODO: 1. Перенести time-table.json в облако MongoDB

// FIXME: 1. Поменять картинку в SplashScreen
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
// import {Geolocation}from'@ionic-native/geolocation';
import {NetworkInterface} from '@ionic-native/network-interface';

import {AngularFireModule} from 'angularfire2';
import {AngularFirestoreModule} from 'angularfire2/firestore';
import {firebaseConfig} from './credentials';
import {StarRatingModule} from 'ionic3-star-rating';

import {MyApp} from './app.component';
import {HomeComponent} from '../components/home/home';
import {TeacherComponent} from '../components/teacher/teacher';
import {StudentComponent} from '../components/student/student';
import {StudentTtComponent} from '../components/student-tt/student-tt';
import {TeacherTtComponent} from '../components/teacher-tt/teacher-tt';
import {AboutComponent} from '../components/about/about';
import {SetupComponent} from '../components/setup/setup';
import {HoursComponent} from '../components/hours/hours';
import {RatingComponent} from '../components/rating/rating';

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
    StudentTtComponent,
    TeacherTtComponent,
    AboutComponent,
    SetupComponent,
    HoursComponent,
    AboutComponent,
    RatingComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    StarRatingModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomeComponent,
    TeacherComponent,
    StudentComponent,
    StudentTtComponent,
    TeacherTtComponent,
    AboutComponent,
    SetupComponent,
    HoursComponent,
    AboutComponent,
    RatingComponent

  ],
  providers: [
    StatusBar,
    SplashScreen,
    AppRate,
    Device,
    // Geolocation,
    NetworkInterface,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    SharedObjects,
    FirestoreLogProvider,
    MongodbStitchProvider
  ]
})
export class AppModule {
}
