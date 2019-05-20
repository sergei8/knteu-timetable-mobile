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
var HoursComponent = /** @class */ (function () {
    function HoursComponent() {
        this.paraByHours = [];
        this.paraByHours = [
            { 'number': 1, 'hours': '08:20 – 09:40', 'break': '15' },
            { 'number': 2, 'hours': '09:55 – 11:15', 'break': '35' },
            { 'number': 3, 'hours': '11:50 – 13:10', 'break': '20' },
            { 'number': 4, 'hours': '13:30 – 14:50', 'break': '10' },
            { 'number': 5, 'hours': '15:00 – 16:20', 'break': '10' },
            { 'number': 6, 'hours': '16:30 – 17:50', 'break': '10' },
            { 'number': 7, 'hours': '18:00 – 19:20', 'break': '' },
        ];
    }
    HoursComponent = __decorate([
        IonicPage(),
        Component({
            selector: 'hours',
            templateUrl: 'hours.html'
        }),
        __metadata("design:paramtypes", [])
    ], HoursComponent);
    return HoursComponent;
}());
export { HoursComponent };
//# sourceMappingURL=hours.js.map