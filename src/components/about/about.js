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
import { IonicPage } from 'ionic-angular';
import { AppRate } from '@ionic-native/app-rate';
import { SharedObjects } from '../../providers/shared-data/shared-data';
var AboutComponent = /** @class */ (function () {
    function AboutComponent(appRate, sharedObjects) {
        this.appRate = appRate;
        this.sharedObjects = sharedObjects;
        this.appVersion = sharedObjects.appVersion;
        this.appRate.preferences = {
            usesUntilPrompt: 1,
            storeAppURL: {
                android: 'market://details?id=ek.knteu.timetable'
            },
            useLanguage: 'uk-UK',
            displayAppName: 'розклад КНТЕУ'
        };
    }
    AboutComponent.prototype.goToPlayMarket = function () {
        this.appRate.navigateToAppStore();
    };
    var _a;
    AboutComponent = __decorate([
        IonicPage(),
        Component({
            selector: 'about',
            templateUrl: 'about.html'
        }),
        __metadata("design:paramtypes", [typeof (_a = typeof AppRate !== "undefined" && AppRate) === "function" ? _a : Object, SharedObjects])
    ], AboutComponent);
    return AboutComponent;
}());
export { AboutComponent };
//# sourceMappingURL=about.js.map