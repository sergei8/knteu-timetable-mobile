var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, EventEmitter, Input, Output } from '@angular/core';
var RatingStarsComponent = /** @class */ (function () {
    function RatingStarsComponent() {
        this.settedRateChange = new EventEmitter();
        this.rating = 0;
    }
    RatingStarsComponent.prototype.rateIt = function (num) {
        this.rating = num;
        this.settedRateChange.emit(this.rating);
    };
    RatingStarsComponent.prototype.setColor = function (num) {
        if (this.rating) {
            if (num > this.rating) {
                return 'lightgray';
            }
            else {
                return '#FFCC33';
            }
        }
        else {
            return 'lightgray';
        }
    };
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], RatingStarsComponent.prototype, "settedRate", void 0);
    __decorate([
        Output(),
        __metadata("design:type", Object)
    ], RatingStarsComponent.prototype, "settedRateChange", void 0);
    RatingStarsComponent = __decorate([
        Component({
            selector: 'rating-stars',
            templateUrl: 'rating-stars.html'
        }),
        __metadata("design:paramtypes", [])
    ], RatingStarsComponent);
    return RatingStarsComponent;
}());
export { RatingStarsComponent };
//# sourceMappingURL=rating-stars.js.map