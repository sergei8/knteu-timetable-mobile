import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {AlertController} from 'ionic-angular';
import {SetupComponent} from '../components/setup/setup';

import {HomeComponent} from '../components/home/home';
import {TeacherComponent} from '../components/teacher/teacher';
import {StudentComponent} from '../components/student/student';
import {StudentTtComponent} from '../components/student-tt/student-tt';
import {AboutComponent} from '../components/about/about';

import {DataProvider} from '../providers/data/data';
import {SharedObjects} from '../providers/shared-data/shared-data';
import {TeacherTtComponent} from "../components/teacher-tt/teacher-tt";
import {elementAt} from "rxjs/operator/elementAt";


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomeComponent;

  appConfig = {};
  timeTableUrl: string;
  configUrl = 'https://raw.githubusercontent.com/sergei8/tt-mobile/master/app-config.json';

  askForSavedRozklad: boolean;

  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private dataProvider: DataProvider,
              private sharedObjects: SharedObjects,
              private  alert: AlertController) {

    this.splashScreen.show();


    this.readConfig();
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openStudent() {

    this.dataProvider.readSetup()
      .then(() => {
        this.askForSavedRozklad = this.sharedObjects.globalParams['saveRozklad'];
        if (this.askForSavedRozklad) {  // если включен режим сохранения расписания
          this.dataProvider.readStudentRozklad()
            .then((studentRozklad) => {
                if (Object.keys(studentRozklad).length !== 0) {   // если розклад был удален
                  let confirm = this.alert.create({
                    // title: 'Збереження розкладу',
                    message: 'У Вас є збережений розклад ' + studentRozklad['facName'] + ' ' +
                    studentRozklad['course'] + ' курса ' + studentRozklad['group'] + ' групи. ' +
                    'бажаєте відкрити цей розклад?',
                    buttons: [
                      {
                        text: 'Ні',
                        cssClass: 'alertButton',
                        handler: () => {
                          this.nav.push(StudentComponent);
                        }
                      },
                      {
                        text: 'Так',
                        cssClass: 'alertButton',
                        handler: () => {
                          this.nav.push(StudentTtComponent,
                            {
                              wdp: studentRozklad['wdp'],
                              facName: studentRozklad['facName'],
                              course: studentRozklad['course'],
                              group: studentRozklad['group']
                            });
                        }
                      }
                    ]
                  });
                  confirm.present();
                } else {
                  this.nav.push(StudentComponent);
                }
              }
            );
        } else {
          this.nav.push(StudentComponent);
        }
      })
      .catch(() => {
        this.nav.push(StudentComponent);
      });

  }

  openTeacher() {
    this.dataProvider.readSetup()
      .then(() => {
        this.askForSavedRozklad = this.sharedObjects.globalParams['saveRozklad'];
        // console.log(this.askForSavedRozklad);

        if (this.askForSavedRozklad) {  // если включен режим сохранения расписания
          this.dataProvider.readPrepodRozklad()
            .then((prepodRozklad) => {
              if (Object.keys(prepodRozklad).length !== 0) {
                let confirm = this.alert.create({
                  // title: 'Збереження розкладу',
                  message: 'У Вас є збережений розклад ' + prepodRozklad['teacher'] + ' ' +
                  'бажаєте відкрити цей розклад?',
                  buttons: [
                    {
                      text: 'Ні',
                      cssClass: 'alertButton',
                      handler: () => {
                        this.nav.push(TeacherComponent);
                      }
                    },
                    {
                      text: 'Так',
                      cssClass: 'alertButton',
                      handler: () => {
                        this.nav.push(TeacherTtComponent,
                          {
                            wdp: prepodRozklad['wdp'],
                            teacher: prepodRozklad['teacher']
                          });
                      }
                    }
                  ]
                });
                confirm.present();
              } else {
                this.nav.push(TeacherComponent);
              }
            });
        } else {
          this.nav.push(TeacherComponent);
        }

      });
  }

  openSetup() {
    this.nav.push(SetupComponent);
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
//todo сделать алерт с оія к сетітсутствіем подключен
        error => console.log('ERROR time-table!'));
  }

  // получіть конфіг-файл
  readConfig() {
    // console.log(this.configUrl);
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
