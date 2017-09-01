import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomeComponent} from '../components/home/home';
import {TeacherComponent} from '../components/teacher/teacher';
import {StudentComponent} from '../components/student/student';

import {DataProvider} from '../providers/data/data';
import {SharedTimeTable} from '../providers/shared-data/shared-data';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomeComponent;

  appConfig = {};
  timeTableUrl: string;
  configUrl = 'https://raw.githubusercontent.com/sergei8/tt-mobile/master/app-config.json';

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private dataProvider: DataProvider,
              private sharedTimeTable: SharedTimeTable) {
    this.initializeApp();
    this.readConfig();
    // this.readTimeTable();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openStudent() {
    console.log('student open');
    this.nav.setRoot(StudentComponent);
  }

  openTeacher() {
    console.log('teacher open');
    this.nav.setRoot(TeacherComponent);
  }

  // подписаться на получение файла time-table.json
  readTimeTable() {
    this.dataProvider.getFile(this.timeTableUrl)
      .subscribe(
        response => {
          console.log("!!!!!!!!!!!!!!!!!!!!");
          this.sharedTimeTable.timeTable = response;
          console.log(this.sharedTimeTable.timeTable);
        },
        error => console.log('ERROR time-table!'));
  }

  // получіть конфіг-файл
  readConfig() {
    console.log(this.configUrl);
    this.dataProvider
      .getFile(this.configUrl)
      .subscribe(
        response => {
          this.timeTableUrl = response['time-table-url'];
          console.log(this.timeTableUrl);
        },
        error => console.log('Error config'),
        () => {
          /* когда app-config прочітан визиваем загрузку time-table.json*/
          console.log('CONFIG COMPETE!!!');
          this.readTimeTable();
        }
      );
  }

}
