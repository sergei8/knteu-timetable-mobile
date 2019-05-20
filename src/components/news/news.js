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
import { Nav } from 'ionic-angular';
import { FirestoreLogProvider } from '../../providers/firestore-log/firestore-log';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MongodbStitchProvider } from '../../providers/mongodb-stitch/mongodb-stitch';
import { SharedObjects } from '../../providers/shared-data/shared-data';
import { DataProvider } from '../../providers/data/data';
import { IonicPage } from 'ionic-angular';
var NewsComponent = /** @class */ (function () {
    function NewsComponent(nav, mongodbStitchProvider, socialSharing, fireStore, sharedObjects, data) {
        this.nav = nav;
        this.mongodbStitchProvider = mongodbStitchProvider;
        this.socialSharing = socialSharing;
        this.fireStore = fireStore;
        this.sharedObjects = sharedObjects;
        this.data = data;
        if (!this.sharedObjects.isConnected) {
            this.data.showToastMessage('Відсутній доступ до інтернет', 'bottom', 'warningToast', true, 3000);
            this.showSpinner = false;
        }
    }
    /**
     * вызывается после загрузки экрана
     * пишет лог, если разрешено
     * инициирует асинхронное чтение новостей из БД
     */
    NewsComponent.prototype.ionViewDidLoad = function () {
        var _this = this;
        if (!this.sharedObjects.stopLogging) {
            this.fireStore.setNewsPageLog().then().catch();
        }
        this.showSpinner = true;
        this.mongodbStitchProvider.getShortNewsList()
            .then(function (res) {
            _this.showSpinner = false;
            _this.shortNewsList = res;
        });
    };
    /**
     * считает разницу между положительными и отрицательными мнениями
     * число голосов - это длина массива в объекте `votes` коллекции `news-list`
     * @param votes - объект из документа БД
     * @return {number} - разница + и -
     */
    NewsComponent.prototype.getVotesBalance = function (votes) {
        if (votes) {
            this.positiveAmount = votes["like"] ? votes["like"].length : 0;
            this.negativeAmount = votes["dislike"] ? votes["dislike"].length : 0;
            return this.positiveAmount - this.negativeAmount;
        }
        else {
            return 0;
        }
    };
    /**
     * вычисляет количество прсмотров новости
     * @param news - объект из документа БД `news-list`
     * @return {number} - количество просмотров
     */
    NewsComponent.prototype.getTotalViews = function (news) {
        return 'views' in news ? news['views'].length : 0;
    };
    NewsComponent.prototype.changeVotes = function (voteType, newsId) {
        var _this = this;
        this.shortNewsList.forEach(function (news) {
            if (news._id == newsId) {
                _this.setVote(news, voteType);
                _this.mongodbStitchProvider.storeNewsVote(news).then();
            }
        });
    };
    /**
     * изменяет счетчик голосований в зависимости от нажатой стрелки (верх/низ)
     * @param {Object} news - новость, которая голосуется
     * @param {number} voteType - тип голоса: 1 - положит. 0 - отрицат.
     */
    NewsComponent.prototype.setVote = function (news, voteType) {
        //отладка
        // this.sharedObjects.currentUserDeviceId = '222222';
        //
        // id устройства пользователя
        var devId = this.sharedObjects.currentUserDeviceId;
        // имя поля в поле `votes` новости
        var voteName = voteType == 1 ? 'like' : 'dislike';
        // если поля `votes` присутствует в новости
        if ('votes' in news) {
            // если тип мнения есть в `votes`
            if (voteName in news['votes']) {
                // проверяем, был ли уже голос от этого юзера
                if (news['votes'][voteName].indexOf(devId) === -1) {
                    // не было - дописываем id в массив голосов
                    news['votes'][voteName].push(devId);
                }
            }
            else {
                // поля типа нету - создаем его и дописываем массив с id
                news['votes'][voteName] = [devId];
            }
        }
        else {
            // поля `vote` нету - создаем его и дописываеи в тип голоса новый id
            news['votes'] = {};
            news['votes'][voteName] = [devId];
        }
    };
    /**
     * заносит в поле `views` id юзера при переходе на экран деталей новости
     * @param {Object} news - новость, на которой открыли детали
     */
    NewsComponent.prototype.setViews = function (news) {
        //отладка
        // this.sharedObjects.currentUserDeviceId = '333333';
        //
        // id устройства пользователя
        var devId = this.sharedObjects.currentUserDeviceId;
        if (news.hasOwnProperty('views')) {
            if (news['views'].indexOf(devId) === -1) {
                news['views'].push(devId);
            }
            else {
                return;
            }
        }
        else {
            news['views'] = [];
            news['views'] = [devId];
        }
        // обновляем док-т в БД
        this.mongodbStitchProvider.storeViews(news['_id'], news['views']).then();
    };
    NewsComponent.prototype.shareClick = function (news) {
        // console.log(news);
        var message = news['title'];
        var subject = news['annotation'];
        var link = news['blog_url'];
        var image = news['pict_url'] || null;
        this.socialSharing.share(message, subject, image, link).then();
    };
    /**
     * загружает экран отображения деталей новости и передает ему id новости
     * @param {Object} news - новость
     */
    NewsComponent.prototype.showNewsDetails = function (news) {
        this.setViews(news);
        this.nav.push('NewsDetailsComponent', {
            newsId: news['_id'],
            title: news['title']
        }).then();
    };
    var _a;
    NewsComponent = __decorate([
        IonicPage(),
        Component({
            selector: 'news',
            templateUrl: 'news.html'
        }),
        __metadata("design:paramtypes", [Nav, MongodbStitchProvider, typeof (_a = typeof SocialSharing !== "undefined" && SocialSharing) === "function" ? _a : Object, FirestoreLogProvider,
            SharedObjects,
            DataProvider])
    ], NewsComponent);
    return NewsComponent;
}());
export { NewsComponent };
//# sourceMappingURL=news.js.map