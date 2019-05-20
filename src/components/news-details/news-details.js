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
import { DomSanitizer } from "@angular/platform-browser";
import { IonicPage } from 'ionic-angular';
import { Nav } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { MongodbStitchProvider } from '../../providers/mongodb-stitch/mongodb-stitch';
import { FirestoreLogProvider } from '../../providers/firestore-log/firestore-log';
import { SharedObjects } from '../../providers/shared-data/shared-data';
var NewsDetailsComponent = /** @class */ (function () {
    function NewsDetailsComponent(nav, navParams, mongoStitch, sanitizer, fireStore, sharedObjects) {
        this.nav = nav;
        this.navParams = navParams;
        this.mongoStitch = mongoStitch;
        this.sanitizer = sanitizer;
        this.fireStore = fireStore;
        this.sharedObjects = sharedObjects;
        this.showSpinner = true;
        this.newsId = this.navParams.get('newsId');
        this.title = this.navParams.get('title');
    }
    /**
     * при входе в экран логтрует юзера и читает из БД поле `details` новости
     */
    NewsDetailsComponent.prototype.ionViewDidEnter = function () {
        var _this = this;
        if (!this.sharedObjects.stopLogging) {
            this.fireStore.setNewsDetailsPageLog(this.newsId).then().catch();
        }
        this.mongoStitch.getDetails(this.newsId)
            .then(function (res) {
            if (res) {
                _this.details = res[0]['details'];
                _this.detailsHTML = _this.details['text'];
                _this.showSpinner = false;
                // сделать абсолютные внутренние ссылкив на фото в html
                _this.detailsHTML = _this.detailsHTML.replace(/<img src="\/image\//g, '<img src="http://knute.edu.ua/image/');
            }
            else {
                _this.detailsHTML = 'нема деталей';
            }
        })
            .catch(function (e) {
            console.log('error', e);
            _this.showSpinner = false;
        });
    };
    // защита innerHTML
    NewsDetailsComponent.prototype.safeHTML = function (detailsHTML) {
        // console.log("safeHTML");
        return this.sanitizer.bypassSecurityTrustHtml(detailsHTML);
    };
    NewsDetailsComponent = __decorate([
        IonicPage(),
        Component({
            selector: 'news-details',
            templateUrl: 'news-details.html'
        }),
        __metadata("design:paramtypes", [Nav, NavParams,
            MongodbStitchProvider,
            DomSanitizer,
            FirestoreLogProvider,
            SharedObjects])
    ], NewsDetailsComponent);
    return NewsDetailsComponent;
}());
export { NewsDetailsComponent };
//# sourceMappingURL=news-details.js.map