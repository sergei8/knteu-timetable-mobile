import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {HomeComponent} from '../components/home/home';
import {TeacherComponent} from '../components/teacher/teacher';
import {StudentComponent} from '../components/student/student';
import {AboutComponent} from '../components/about/about';

import {DataProvider} from '../providers/data/data';
import {SharedObjects} from '../providers/shared-data/shared-data';

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
              private sharedObjects: SharedObjects) {

    this.splashScreen.show();
    this.readConfig();
    this.initializeApp();
    this.splashScreen.hide();

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      // this.splashScreen.hide();
    });
  }

  openStudent() {
    this.nav.push(StudentComponent);
  }

  openTeacher() {
    this.nav.push(TeacherComponent);
  }

  openAbout() {
    this.nav.push(AboutComponent);
  }

  // подписаться на получение файла time-table.json
  readTimeTable() {
    this.dataProvider.getFile(this.timeTableUrl)
      .subscribe(
        response => {
          this.sharedObjects.allTimeTable = response;
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
        },
        error => console.log('Error config'),
        () => {
          /* когда app-config прочітан визиваем загрузку time-table.json*/
          this.readTimeTable();
        }
      );
  }

}
