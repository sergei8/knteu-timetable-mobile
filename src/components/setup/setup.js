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
import { SharedObjects } from '../../providers/shared-data/shared-data';
import { DataProvider } from '../../providers/data/data';
import { IonicPage } from 'ionic-angular';
var localforage = require("localforage");
var SetupComponent = /** @class */ (function () {
    function SetupComponent(sharedData, dataProvider) {
        // this.isAllowPush = true;
        var _this = this;
        this.sharedData = sharedData;
        this.dataProvider = dataProvider;
        this.dataProvider.readLocalSetup()
            .then(function (result) {
            _this.isSaveRozklad = _this.sharedData.globalParams['saveRozklad'] ? _this.sharedData.globalParams['saveRozklad'] : false;
            _this.isAllowPush = _this.sharedData.globalParams['getPush'];
        });
    }
    SetupComponent.prototype.saveParams = function (paramName, paramValue) {
        this.sharedData.globalParams[paramName] = paramValue;
        localforage.setItem('setup', this.sharedData.globalParams).then();
    };
    /*
      saveRozkladClicked() {
        this.sharedData.globalParams['saveRozklad'] = this.isSaveRozklad;
        // this.sharedData.globalParams['getPush'] = this.isAllowPush;
        localforage.setItem('setup', this.sharedData.globalParams).then();
      }
    */
    /*
      allowRating() {
        this.sharedData.globalParams['allowRating'] = this.isAllowRating;
        localforage.setItem('setup', this.sharedData.globalParams).then();
      }
    */
    SetupComponent.prototype.clearRozklad = function () {
        var _this = this;
        localforage.removeItem('student')
            .then(function () {
            localforage.removeItem('teacher')
                .then(function () {
                _this.dataProvider.showToastMessage('Ви видалили усі локальні розклади', 'bottom', 'infoToast', false, 3000);
            });
        });
    };
    SetupComponent = __decorate([
        IonicPage(),
        Component({
            selector: 'setup',
            templateUrl: 'setup.html'
        }),
        __metadata("design:paramtypes", [SharedObjects, DataProvider])
    ], SetupComponent);
    return SetupComponent;
}());
export { SetupComponent };
//# sourceMappingURL=setup.js.map