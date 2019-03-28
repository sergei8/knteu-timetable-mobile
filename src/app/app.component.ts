import {Component, ViewChild, OnInit} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {Push, PushObject, PushOptions} from '@ionic-native/push';
import {AlertController} from 'ionic-angular';
import {Device} from '@ionic-native/device';

// import {SetupComponent} from '../components/setup/setup';
import {HomeComponent} from '../components/home/home';
import {TeacherComponent} from '../components/teacher/teacher';
import {StudentComponent} from '../components/student/student';
import {StudentTtComponent} from '../components/student-tt/student-tt';
import {TeacherTtComponent} from "../components/teacher-tt/teacher-tt";
// import {AboutComponent} from '../components/about/about';
// import {HoursComponent} from '../components/hours/hours';

import {DataProvider} from '../providers/data/data';
import {SharedObjects} from '../providers/shared-data/shared-data';
import {FirestoreLogProvider} from '../providers/firestore-log/firestore-log'
import {MongodbStitchProvider} from '../providers/mongodb-stitch/mongodb-stitch';

// import {timer} from 'rxjs/observable/timer';

@Component({
  templateUrl: 'app.html'
})
export class MyApp implements OnInit {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomeComponent;

  // appConfig = {};
  timeTableUrl: string;
  // configUrl = 'https://firebasestorage.googleapis.com/v0/b/knteu-timetable.appspot.com/o/app-config.json?alt=media&token=dcd8029a-18cd-4adc-bcd0-d39d4bb31e0d';
  configUrl = 'https://raw.githubusercontent.com/sergei8/knteu-timetable-mobile/master/app-config.json';
  // configUrl = 'http://localhost:8100/assets/db/app-config.json';

  askForSavedRozklad: boolean;
  showSplash = true; // <-- show animation


  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private dataProvider: DataProvider,
              public sharedObjects: SharedObjects,
              private alert: AlertController,
              private fireStore: FirestoreLogProvider,
              private mongodbStitchProvider: MongodbStitchProvider,
              private device: Device,
              private push: Push) {

    this.splashScreen.show();
    this.initializeApp();
    this.dataProvider.readLocalSetup().then();
    this.readConfig();

    /*
        this.platform.ready().then(() => {
          this.splashScreen.hide();
          if (this.sharedObjects.runPush) {
            this.pushSetup();
          }
        });
    */
    // подключение к mongodb через mongo stitch
    if (this.mongodbStitchProvider.initClient()) {
      console.log("[mongoClient] : done!")
    } else {
      console.log("[mongoClient] : error!")
    }
  }

  pushSetup(): void {

    const options: PushOptions = {
      android: {
        senderID: '186245343652',
        iconColor: '#343434',
        forceShow: true
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    };

    const pushObject: PushObject = this.push.init(options);
    pushObject.on('notification').subscribe((notification: any) => console.log('*** Уведомление: ', notification));
    pushObject.on('registration').subscribe((registration: any) => console.log('*** Регистрация [токен]: ', registration));
    pushObject.on('error').subscribe(error => console.error('***Error with Push plugin', error));
  }

  initializeApp(): void {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      // this.statusBar.backgroundColorByHexString('#FFFFFF');
      this.statusBar.hide();
      this.splashScreen.hide();
      /* включить push уведомления, если это разрешено в общем конфиге и в локальном */
      if (this.sharedObjects.runPush && this.sharedObjects.globalParams['getPush']) {
        this.pushSetup();
      }
      // timer(3000).subscribe(() => this.showSplash = true)
    });
  }

  ngOnInit(): void {
    this.sharedObjects.currentUserDeviceId = this.device.uuid;
  }

  openStudent(): void {

    this.dataProvider.readLocalSetup()
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
                          this.nav.push(StudentComponent).then().catch();
                        }
                      },
                      {
                        text: 'Так',
                        cssClass: 'alertButton',
                        handler: () => {
                          // пишем лог по экрану студента
                          this.fireStore.setStudentPageLog(studentRozklad['facName'],
                            studentRozklad['course'], studentRozklad['group'], true);
                          // переход на экран студента
                          this.nav.push(StudentTtComponent,
                            {
                              wdp: studentRozklad['wdp'],
                              facName: studentRozklad['facName'],
                              course: studentRozklad['course'],
                              group: studentRozklad['group']
                            }).then().catch();
                        }
                      }
                    ]
                  });
                  confirm.present().then().catch();
                } else {
                  this.nav.push(StudentComponent).then().catch();
                }
              }
            );
        } else {
          this.nav.push(StudentComponent).then().catch();
        }
      })
      .catch(() => {
        this.nav.push(StudentComponent).then().catch();
      });

  }

  openTeacher(): void {
    this.dataProvider.readLocalSetup()
      .then(() => {
        this.askForSavedRozklad = this.sharedObjects.globalParams['saveRozklad'];

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
                          }).catch();
                      }
                    }
                  ]
                });
                confirm.present().catch();
              } else {
                this.nav.push(TeacherComponent).then().catch();
              }
            });
        } else {
          this.nav.push(TeacherComponent).then().catch();
        }

      });
  }

  openSetup(): void {
    this.nav.push('SetupComponent').then().catch();
  }

  openAbout(): void {
    this.nav.push('AboutComponent').then().catch();
  }

  openHours(): void {
    this.nav.push('HoursComponent').then().catch();
  }


  /**
   * подписаться на получение файла time-table.json
   */
  readTimeTable(): void {
    // todo отладочная вставка - удалить потом assets/db/time-table...
    // this.timeTableUrl = 'http://localhost:8100/assets/db/time-table.json';
    // this.timeTableUrl = 'https://raw.githubusercontent.com/sergei8/TT-site/master/assets/db/time-table.json?token=AF9ePDy24bBr6i0sumR3FfqincFJhcSnks5cVbOWwA%3D%3D';
    // this.timeTableUrl = 'http://raw.githubusercontent.com/sergei8/TT-site/master/assets/db/time-table.json';
    // ------------------
    this.dataProvider.getFile(this.timeTableUrl)
      .subscribe(
        response => {
          this.sharedObjects.allTimeTable = response;
        },
        error => {
          this.sharedObjects.isConnected = false;
          console.log('ERROR time-table: ', error);
        }
      );

  }

  /**
   * читает конфиг, заполняет из него общие конфигурационные переменные
   * и вызывает чтение `time-table.json`
   */
  readConfig(): void {
    this.dataProvider.getFile(this.configUrl)
      .subscribe(
        response => {
          console.log('########', response);
          this.timeTableUrl = response['time-table-url'];
          this.sharedObjects.stopLogging = response['stop-logging'];
          this.sharedObjects.appVersion = response['version'];
          this.sharedObjects.runPush = response['run-push'];
        },
        error => {
          console.log('Error config', error);
          this.sharedObjects.isConnected = false;
        },
        () => {
          /* когда app-config прочітан визиваем загрузку time-table.json*/
          this.readTimeTable();
        }
      );
  }

}
