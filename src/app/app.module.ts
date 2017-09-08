import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {HttpModule} from '@angular/http';

import {MyApp} from './app.component';
import {HomeComponent} from '../components/home/home';
import {TeacherComponent} from '../components/teacher/teacher';
import {StudentComponent} from '../components/student/student';
import {StudentTtComponent} from '../components/student-tt/student-tt';
import {TeacherTtComponent} from '../components/teacher-tt/teacher-tt';
import {AboutComponent} from '../components/about/about';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import { DataProvider } from '../providers/data/data';
import { SharedObjects } from '../providers/shared-data/shared-data';

@NgModule({
  declarations: [
    MyApp,
    HomeComponent,
    TeacherComponent,
    StudentComponent,
    StudentTtComponent,
    TeacherTtComponent,
    AboutComponent
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomeComponent,
    TeacherComponent,
    StudentComponent,
    StudentTtComponent,
    TeacherTtComponent,
    AboutComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DataProvider,
    SharedObjects
  ]
})
export class AppModule {
}
