var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map';
import { AlertController } from 'ionic-angular';
import { SharedObjects } from '../shared-data/shared-data';
import { ToastController } from 'ionic-angular';
import { MongodbStitchProvider } from '../mongodb-stitch/mongodb-stitch';
import * as $ from 'jquery';
import * as _ from 'lodash';
var localforage = require("localforage");
var DataProvider = /** @class */ (function () {
    function DataProvider(http, alert, sharedObjects, toast, mongodbStitchProvider) {
        this.http = http;
        this.alert = alert;
        this.sharedObjects = sharedObjects;
        this.toast = toast;
        this.mongodbStitchProvider = mongodbStitchProvider;
    }
    /**
     * получает json одним куском из url
     * @param url - место, где лежит time-table
     * @return {Observable<Object>}
     */
    DataProvider.prototype.getFile = function (url) {
        console.log(url);
        var headers = new HttpHeaders();
        headers.set('Accept-Encoding', 'gzip');
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type', 'application/json');
        return this.http.get(url, { headers: headers });
    };
    // сохраняет распісаніе студента или препода локально
    DataProvider.prototype.saveTimeTable = function (rozklad) {
        var _this = this;
        var confirm = this.alert.create({
            // subTitle: 'Збереження розкладу',
            message: 'Ви бажаєте зберегти цей розклад у локальне сховище Вашого пристрою?',
            buttons: [
                {
                    text: 'Ні',
                    // cssClass: 'alertButton',
                    handler: function () {
                    }
                },
                {
                    text: 'Так',
                    // cssClass: 'alertButton',
                    handler: function () {
                        if (rozklad.id === 'student') {
                            _this.saveStudentRozklad(rozklad);
                        }
                        else {
                            _this.savePrepodRozklad(rozklad);
                        }
                        _this.showToastMessage('Розклад збережено', 'bottom', 'infoToast', false, 3000);
                    }
                }
            ]
        });
        confirm.present().then();
    };
    DataProvider.prototype.readStudentRozklad = function () {
        var rozklad = {
            facName: '',
            course: '',
            group: '',
            wdp: {}
        };
        return localforage.getItem('student')
            .then(function (result) {
            if (result) {
                rozklad['facName'] = result['facName'];
                rozklad['course'] = result['course'];
                rozklad['group'] = result['group'];
                rozklad['wdp'] = result['wdp'];
                return rozklad;
            }
            else {
                return {};
            }
        }, function (error) {
            return {};
        });
    };
    DataProvider.prototype.saveStudentRozklad = function (rozklad) {
        localforage.setItem("student", rozklad).then().catch();
    };
    DataProvider.prototype.readPrepodRozklad = function () {
        var rozklad = {
            teacher: '',
            wdp: {}
        };
        return localforage.getItem('teacher')
            .then(function (result) {
            if (result) {
                rozklad['teacher'] = result['teacher'];
                rozklad['wdp'] = result['wdp'];
                return rozklad;
            }
            else {
                return {};
            }
        }, function (error) {
            return {};
        });
    };
    DataProvider.prototype.savePrepodRozklad = function (rozklad) {
        localforage.setItem("teacher", rozklad).then().catch();
    };
    /**
     * читает локальные настройки из cookie в globalParams
     * @return {Promise<void>}
     */
    DataProvider.prototype.readLocalSetup = function () {
        var _this = this;
        return localforage.getItem('setup')
            .then(function (result) {
            if (result || result == {}) {
                // console.log('local setup: ', result);
                _this.sharedObjects.globalParams = result;
            }
        }, function (error) { return console.log('ошибка чтения Setup:', error); });
    };
    DataProvider.prototype.showToastMessage = function (message, position, cssClass, showCloseButton, duration) {
        var toast = this.toast.create({
            message: message,
            showCloseButton: showCloseButton,
            closeButtonText: 'Ok',
            duration: duration,
            cssClass: cssClass,
            position: position
        });
        toast.present().then().catch();
    };
    /**
     * выбирает расписание преподавателя из TimeTable
     * @param {string} name - фио препода
     * @return {any[]} расписание и сведения о преподе (фио, фотка, ...)
     */
    DataProvider.prototype.getTeacherWdp = function (name) {
        var _this = this;
        var wdp = $.extend(true, {}, this.sharedObjects.WeekDayPara); //  очищаем расписание группы
        var teacherDetails = {};
        _.each(this.sharedObjects.allTimeTable, function (fio, teacherName) {
            return _.each(_this.sharedObjects.weekNames.map(function (x) { return fio[x]; }), function (week, weekIndex) {
                return _.each(week, function (day, dayName) {
                    return _.each(day, function (para, paraNumber) {
                        if (teacherName === name) {
                            teacherDetails = fio.details;
                            var weekName = _this.sharedObjects.weekNames[weekIndex];
                            wdp[weekName][dayName][paraNumber] = [].concat(para[5], para[3], para[4], para[0], para[1], para[2]);
                        }
                    });
                });
            });
        });
        return [wdp, teacherDetails];
    };
    /**
     * строит список факультетов из TimeTable
     * @return {string[]} - список фак-тов
     */
    DataProvider.prototype.getFacNameList = function () {
        var _this = this;
        var facNameList = [];
        _.each(this.sharedObjects.allTimeTable, function (fio) {
            return _.forEach(_this.sharedObjects.weekNames.map(function (x) { return fio[x]; }), function (week) {
                return _.each(week, function (day) {
                    return _.each(day, function (para) {
                        if (!(_.includes(facNameList, para[0]))) {
                            facNameList.push(para[0]); // build faculties menu
                        }
                    });
                });
            });
        });
        return facNameList.sort();
    };
    /**
     * Выбирает из Timetable...details полные названия факультетов и кафедр
     * @return {object} - {'fac' - список факультетов, 'dep' - список кафедр}
     */
    DataProvider.prototype.getFacDepNameList = function (facName) {
        if (facName === void 0) { facName = null; }
        var depFacNames = {
            'fac': [],
            'dep': []
        };
        _.each(this.sharedObjects.allTimeTable, function (fio) {
            // если свойство `details` присутствует у препода то формируем списки
            if (fio.details) {
                if (_.indexOf(depFacNames.fac, fio.details.fac) === -1) {
                    depFacNames.fac.push(fio.details.fac);
                }
                // если название фак-та не задано, то выбираем все каф-ры
                if (!facName) {
                    if (_.indexOf(depFacNames.dep, fio.details.dep) === -1) {
                        depFacNames.dep.push(fio.details.dep);
                    }
                }
                else { /* иначе выбираем каф-ры по факультету facName*/
                    if (_.indexOf(depFacNames.dep, fio.details.dep) === -1 && facName === fio.details.fac) {
                        depFacNames.dep.push(fio.details.dep);
                    }
                }
            }
        });
        return depFacNames;
    };
    /**
     * извлекает из БД документ с рейтингами препода teacherName
     * @param teacherName - фио препода с кафедральной страницы (в detail)
     * @return {Promise<Array<any>>} массив: [rating, votedUser, showVote]
     */
    DataProvider.prototype.getTeacherRating = function (teacherName) {
        var _this = this;
        // в ratings накапливаются последние рейтинги выданные пользователями
        var ratings = [];
        // инициализируем переменные возврата
        var rating = 0;
        var votedUsers = 0;
        var showVotes = true;
        return new Promise(function (resolve) {
            // если фио препода нету то возвращаем фигу
            if (teacherName == '') {
                resolve(null);
            }
            // выбираем из БД рейтинги препода
            _this.mongodbStitchProvider.getTeacherRatingsList(teacherName)
                .then(function (docs) {
                var ratingObj = _this.sharedObjects.teacherRate = docs.length > 0 ? docs[0]['rateList'] : {};
                _this.sharedObjects.teacherRate = ratingObj;
                _this.sharedObjects.teacherInfo.rateList = ratingObj;
                _this.sharedObjects.teacherInfo.teacherName = teacherName;
                _this.analyseDocs(ratingObj, teacherName);
                if (Object.keys(ratingObj).length > 0) {
                    // в ratingObj - все рейтинги, оставленные преподу
                    // перебираем рейтинги по каждому пользователю;
                    for (var userId in ratingObj) {
                        // в userRatesList - рейтинги, оставленные пользователем для этого препода
                        var userRatesList = ratingObj[userId];
                        // выбираем из рейтингов пользователя последний оставленный
                        var lastRate = _this.selectLastRate(userRatesList);
                        // добавляем его в массив актуальных рейтов
                        ratings.push(lastRate[0]);
                        // }
                    }
                }
                // сохраняем актуальные рейты препода в глоб. массиве
                _this.sharedObjects.teacherInfo.currentRates = ratings;
                rating = _.round(_.sum(ratings) / ratings.length, 1);
                votedUsers = ratings.length;
                resolve([rating, votedUsers, showVotes]);
            })
                // если ошибка доступа к БД, то выключаем показ рейтинга
                .catch(function (err) {
                console.log('ошибка при доступе к БД', err);
                showVotes = false;
                resolve([0, 0, false]);
            });
        });
    };
    DataProvider.prototype.analyseDocs = function (ratingObj, teacherName) {
        // еслі препод не найден - ставім флаг newTeacher
        if (!ratingObj) {
            this.sharedObjects.teacherInfo.newTeacher = true;
            return;
        }
        // устанавливаем флаг есть ли id юзера  в ratingList (нету - true:newUser)
        if (Object.keys(ratingObj).indexOf(this.sharedObjects.currentUserDeviceId) === -1) {
            this.sharedObjects.teacherInfo.newUserId = true;
        }
    };
    /**
     * находит последний рейт, установленный данным пользователем
     * @param userRatesList - массив рейтингов [{date:__, rating:__}...]
     * @return {number} - последний рейтинг и его дата
     */
    DataProvider.prototype.selectLastRate = function (userRatesList) {
        var lastRate = 0;
        var maxDate = new Date("01/01/01");
        userRatesList.forEach(function (rate) {
            if (rate['date'] > maxDate) {
                lastRate = rate['rating'];
                maxDate = rate['date'];
            }
        });
        return [lastRate, maxDate];
    };
    DataProvider.prototype.createStarsList = function (rating) {
        var starsList = new Array(5).fill("star-outline");
        var numberOfStars = Math.floor(rating);
        var halfStar = rating - numberOfStars > 0;
        for (var i = 0; i < numberOfStars; i++) {
            starsList[i] = "star";
        }
        if (halfStar) {
            starsList[numberOfStars] = 'star-half';
        }
        return starsList;
    };
    DataProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [HttpClient,
            AlertController,
            SharedObjects,
            ToastController,
            MongodbStitchProvider])
    ], DataProvider);
    return DataProvider;
}());
export { DataProvider };
//# sourceMappingURL=data.js.map