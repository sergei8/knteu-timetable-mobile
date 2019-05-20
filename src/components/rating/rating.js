var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { SharedObjects } from '../../providers/shared-data/shared-data';
import { DataProvider } from '../../providers/data/data';
import { FirestoreLogProvider } from '../../providers/firestore-log/firestore-log';
import { Device } from '@ionic-native/device';
import { MongodbStitchProvider } from '../../providers/mongodb-stitch/mongodb-stitch';
var RatingComponent = /** @class */ (function () {
    function RatingComponent(sharedObjects, nav, navParams, data, fireStore, mongodbStitchProvider, device) {
        this.sharedObjects = sharedObjects;
        this.nav = nav;
        this.navParams = navParams;
        this.data = data;
        this.fireStore = fireStore;
        this.mongodbStitchProvider = mongodbStitchProvider;
        this.device = device;
        this.settedRate = 0; // выбранный рейт
        this.showAvatar = true;
        this.details = navParams.get('details');
        try {
            //  установим ссылку на аватар или на фотку если аватара нету
            this.img_url = this.details["avatar_url"] || this.details["img_url"];
            /*
                if (this.details.hasOwnProperty("avatar_url")) {
                  this.img_url = this.details["avatar_url"];
                } else {
                  // аватара нету, может есть фотка?
                  if (this.details.hasOwnProperty("img_url")) {
                    this.img_url = this.details["img_url"];
                  } else {
                    // ничего нет - скроеим поле аватара
                    this.showAvatar = false;
                  }
                }
            */
        }
        catch (_a) {
            //что-то пошло не так ...
            this.showAvatar = false;
        }
        // распарсіть ФІО
        var name = this.details['name'].split(' ');
        this.last = name[0];
        this.first = name[1];
        this.middle = name[2];
        this.teacherRatingList = this.sharedObjects.teacherInfo.currentRates;
    }
    RatingComponent.prototype.ngOnInit = function () {
        if (!this.sharedObjects.stopLogging) {
            this.fireStore.setRatingPageLog(this.sharedObjects.teacherInfo.teacherName)
                .then().catch();
        }
    };
    /**
     * выполняет цепочку асинхронных функций:
     *  - запись рейта в БД
     *  - вывод высплывающего сообщение
     *  - запись статистики в лог
     *  - возврат на предыдущий экран
     */
    RatingComponent.prototype.acceptClicked = function () {
        var _this = this;
        this.writeRateToDb()
            .then(function () {
            _this.data.showToastMessage('Дякуємо! Вашу думку враховано.', 'bottom', 'infoToast', false, 4000);
        })
            .then(function () {
            if (!_this.sharedObjects.stopLogging) {
                _this.fireStore.setRatingPageLog(_this.sharedObjects.teacherInfo.teacherName, "vote")
                    .then().catch();
            }
        })
            .then(function () {
            _this.nav.popTo(_this.nav.getByIndex(_this.nav.length() - 2)).catch();
        })
            .catch(function (err) { return console.log('Ошибка в Rating: ', err); });
    };
    /**
     * добавляет в рейтинги препода новый рейт и вызывает mongo-stich для записи
     * нобновленного списка рейтингов в документ препода
     * @return {Promise<any>}
     */
    RatingComponent.prototype.writeRateToDb = function () {
        // обновить this.sharedObjects.teacherInfo.currentRates выставленным рейтингом `settedRate`
        var _this = this;
        return new Promise(function (resolve) {
            var newRateObj = {
                'date': new Date(),
                'rating': _this.settedRate
            };
            if (_this.sharedObjects.teacherInfo.newUserId) {
                _this.sharedObjects.teacherInfo.rateList[_this.device.uuid] = [newRateObj];
                _this.sharedObjects.teacherInfo.newUserId = true;
            }
            else {
                _this.sharedObjects.teacherInfo.rateList[_this.device.uuid].push(newRateObj);
                _this.sharedObjects.teacherInfo.newUserId = false;
            }
            var teacherDoc = {
                name: _this.sharedObjects.teacherInfo.teacherName,
                rateList: _this.sharedObjects.teacherInfo.rateList
            };
            _this.mongodbStitchProvider.writeTeacherDoc(teacherDoc['rateList'], teacherDoc['name'])
                .then(function () { return resolve(); });
        });
    };
    var _a;
    RatingComponent = __decorate([
        Component({
            selector: 'rating',
            templateUrl: 'rating.html'
        }),
        __metadata("design:paramtypes", [SharedObjects,
            NavController, NavParams,
            DataProvider,
            FirestoreLogProvider,
            MongodbStitchProvider, typeof (_a = typeof Device !== "undefined" && Device) === "function" ? _a : Object])
    ], RatingComponent);
    return RatingComponent;
}());
export { RatingComponent };
//# sourceMappingURL=rating.js.map