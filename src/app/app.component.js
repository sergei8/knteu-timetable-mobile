var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Push } from '@ionic-native/push';
import { AlertController } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { HomeComponent } from '../components/home/home';
import { TeacherComponent } from '../components/teacher/teacher';
import { StudentComponent } from '../components/student/student';
import { NewsComponent } from '../components/news/news';
import { DataProvider } from '../providers/data/data';
import { SharedObjects } from '../providers/shared-data/shared-data';
import { FirestoreLogProvider } from '../providers/firestore-log/firestore-log';
import { MongodbStitchProvider } from '../providers/mongodb-stitch/mongodb-stitch';
var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen, dataProvider, sharedObjects, alert, fireStore, mongodbStitchProvider, device, push) {
        this.platform = platform;
        this.statusBar = statusBar;
        this.splashScreen = splashScreen;
        this.dataProvider = dataProvider;
        this.sharedObjects = sharedObjects;
        this.alert = alert;
        this.fireStore = fireStore;
        this.mongodbStitchProvider = mongodbStitchProvider;
        this.device = device;
        this.push = push;
        this.rootPage = HomeComponent;
        // configUrl = 'https://firebasestorage.googleapis.com/v0/b/knteu-timetable.appspot.com/o/app-config.json?alt=media&token=dcd8029a-18cd-4adc-bcd0-d39d4bb31e0d';
        this.configUrl = 'https://raw.githubusercontent.com/sergei8/knteu-timetable-mobile/master/app-config.json';
        this.showSplash = true;
        // this.splashScreen.show();
        this.initializeApp();
        this.dataProvider.readLocalSetup().then();
        this.readConfig();
        // подключение к mongodb через mongo stitch
        if (this.mongodbStitchProvider.initClients()) {
            console.log("[mongoClient ] : done!");
        }
        else {
            console.log("[mongoClient ] : error!");
        }
    }
    MyApp.prototype.pushSetup = function () {
        var options = {
            android: {
                senderID: '186245343652',
                iconColor: '#343434',
                forceShow: true
            },
            ios: {}
        };
        var pushObject = this.push.init(options);
        pushObject.on('notification').subscribe(function (notification) { return console.log('*** Уведомление: ', notification); });
        pushObject.on('registration').subscribe(function (registration) { return console.log('*** Регистрация [токен]: ', registration); });
        pushObject.on('error').subscribe(function (error) { return console.error('***Error with Push plugin', error); });
    };
    MyApp.prototype.initializeApp = function () {
        var _this = this;
        this.platform.ready().then(function () {
            // this.statusBar.styleDefault();
            _this.statusBar.hide();
            _this.showSplash = false;
            _this.splashScreen.hide();
            /* включить push уведомления, если это разрешено в общем конфиге и в локальном */
            if (_this.sharedObjects.runPush && _this.sharedObjects.globalParams['getPush']) {
                _this.pushSetup();
            }
        });
    };
    MyApp.prototype.ngOnInit = function () {
        this.sharedObjects.currentUserDeviceId = this.device.uuid;
    };
    MyApp.prototype.openStudent = function () {
        var _this = this;
        this.dataProvider.readLocalSetup()
            .then(function () {
            _this.askForSavedRozklad = _this.sharedObjects.globalParams['saveRozklad'];
            if (_this.askForSavedRozklad) { // если включен режим сохранения расписания
                _this.dataProvider.readStudentRozklad()
                    .then(function (studentRozklad) {
                    if (Object.keys(studentRozklad).length !== 0) { // если розклад был удален
                        var confirm_1 = _this.alert.create({
                            // title: 'Збереження розкладу',
                            message: 'У Вас є збережений розклад ' + studentRozklad['facName'] + ' ' +
                                studentRozklad['course'] + ' курса ' + studentRozklad['group'] + ' групи. ' +
                                'бажаєте відкрити цей розклад?',
                            buttons: [
                                {
                                    text: 'Ні',
                                    cssClass: 'alertButton',
                                    handler: function () {
                                        _this.nav.push(StudentComponent).then().catch();
                                    }
                                },
                                {
                                    text: 'Так',
                                    cssClass: 'alertButton',
                                    handler: function () {
                                        // пишем лог по экрану студента
                                        _this.fireStore.setStudentPageLog(studentRozklad['facName'], studentRozklad['course'], studentRozklad['group'], true);
                                        // переход на экран студента
                                        _this.nav.push('StudentTtComponent', {
                                            wdp: studentRozklad['wdp'],
                                            facName: studentRozklad['facName'],
                                            course: studentRozklad['course'],
                                            group: studentRozklad['group']
                                        }).then().catch();
                                    }
                                }
                            ]
                        });
                        confirm_1.present().then().catch();
                    }
                    else {
                        _this.nav.push(StudentComponent).then().catch();
                    }
                });
            }
            else {
                _this.nav.push(StudentComponent).then().catch();
            }
        })
            .catch(function () {
            _this.nav.push(StudentComponent).then().catch();
        });
    };
    MyApp.prototype.openTeacher = function () {
        var _this = this;
        this.dataProvider.readLocalSetup()
            .then(function () {
            _this.askForSavedRozklad = _this.sharedObjects.globalParams['saveRozklad'];
            if (_this.askForSavedRozklad) { // если включен режим сохранения расписания
                _this.dataProvider.readPrepodRozklad()
                    .then(function (prepodRozklad) {
                    if (Object.keys(prepodRozklad).length !== 0) {
                        var confirm_2 = _this.alert.create({
                            // title: 'Збереження розкладу',
                            message: 'У Вас є збережений розклад ' + prepodRozklad['teacher'] + ' ' +
                                'бажаєте відкрити цей розклад?',
                            buttons: [
                                {
                                    text: 'Ні',
                                    cssClass: 'alertButton',
                                    handler: function () {
                                        _this.nav.push(TeacherComponent).then();
                                    }
                                },
                                {
                                    text: 'Так',
                                    cssClass: 'alertButton',
                                    handler: function () {
                                        _this.nav.push('TeacherTtComponent', {
                                            wdp: prepodRozklad['wdp'],
                                            teacher: prepodRozklad['teacher']
                                        }).catch();
                                    }
                                }
                            ]
                        });
                        confirm_2.present().catch();
                    }
                    else {
                        _this.nav.push(TeacherComponent).then().catch();
                    }
                });
            }
            else {
                _this.nav.push(TeacherComponent).then().catch();
            }
        });
    };
    MyApp.prototype.openSetup = function () {
        this.nav.push('SetupComponent').then().catch();
    };
    MyApp.prototype.openAbout = function () {
        this.nav.push('AboutComponent').then().catch();
    };
    MyApp.prototype.openHours = function () {
        this.nav.push('HoursComponent').then().catch();
    };
    MyApp.prototype.openNews = function () {
        this.nav.push(NewsComponent).then().catch();
    };
    /**
     * подписаться на получение файла time-table.json
     */
    MyApp.prototype.readTimeTable = function () {
        var _this = this;
        // todo отладочная вставка - удалить потом assets/db/time-table...
        // this.timeTableUrl = 'http://localhost:8100/assets/db/time-table.json';
        // this.timeTableUrl = 'https://raw.githubusercontent.com/sergei8/TT-site/master/assets/db/time-table.json?token=AF9ePDy24bBr6i0sumR3FfqincFJhcSnks5cVbOWwA%3D%3D';
        // this.timeTableUrl = 'http://raw.githubusercontent.com/sergei8/TT-site/master/assets/db/time-table.json';
        // ------------------
        this.dataProvider.getFile(this.timeTableUrl)
            .subscribe(function (response) {
            _this.sharedObjects.allTimeTable = response;
        }, function (error) {
            _this.sharedObjects.isConnected = false;
            console.log('ERROR time-table: ', error);
        });
    };
    /**
     * читает конфиг, заполняет из него общие конфигурационные переменные
     * и вызывает чтение `time-table.json`
     */
    MyApp.prototype.readConfig = function () {
        var _this = this;
        this.dataProvider.getFile(this.configUrl)
            .subscribe(function (response) {
            console.log('########', response);
            _this.timeTableUrl = response['time-table-url'];
            _this.sharedObjects.stopLogging = response['stop-logging'];
            _this.sharedObjects.appVersion = response['version'];
            _this.sharedObjects.runPush = response['run-push'];
        }, function (error) {
            console.log('Error config', error);
            _this.sharedObjects.isConnected = false;
        }, function () {
            /* когда app-config прочітан визиваем загрузку time-table.json*/
            _this.readTimeTable();
        });
    };
    var _a, _b, _c, _d;
    __decorate([
        ViewChild(Nav),
        __metadata("design:type", Nav)
    ], MyApp.prototype, "nav", void 0);
    MyApp = __decorate([
        Component({
            templateUrl: 'app.html'
        }),
        __metadata("design:paramtypes", [Platform, typeof (_a = typeof StatusBar !== "undefined" && StatusBar) === "function" ? _a : Object, typeof (_b = typeof SplashScreen !== "undefined" && SplashScreen) === "function" ? _b : Object, DataProvider,
            SharedObjects,
            AlertController,
            FirestoreLogProvider,
            MongodbStitchProvider, typeof (_c = typeof Device !== "undefined" && Device) === "function" ? _c : Object, typeof (_d = typeof Push !== "undefined" && Push) === "function" ? _d : Object])
    ], MyApp);
    return MyApp;
}());
export { MyApp };
//# sourceMappingURL=app.component.js.map