var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input } from '@angular/core';
import * as _ from 'lodash';
var RatingChartComponent = /** @class */ (function () {
    function RatingChartComponent() {
        this.totalRatesCount = [0, 0, 0, 0, 0];
        this.barChartOptions = {
            scaleShowVerticalLines: true,
            responsive: true,
        };
        this.barChartLabels = [
            '\u2605\u2605\u2605\u2605\u2605',
            '\u2605\u2605\u2605\u2605',
            '\u2605\u2605\u2605',
            '\u2605\u2605',
            '\u2605'
        ];
        this.barChartType = 'horizontalBar';
        this.barChartLegend = false;
        this.barColors = [
            {
                backgroundColor: 'rgba(225,10,24,0.2)'
            }
        ];
        this.barChartData = [
            { data: this.totalRatesCount }
        ];
    }
    RatingChartComponent.prototype.ngOnChanges = function () {
        var ratesCountObj = _.countBy(this.rating);
        var ratesData = [0, 0, 0, 0, 0];
        _.each(Object.keys(ratesCountObj), function (key) {
            var rateKey = parseInt(key) - 1;
            ratesData[rateKey] = ratesCountObj[key];
        });
        if (this.newRate > 0) {
            ratesData[this.newRate - 1] += 1;
        }
        this.totalRatesCount = _.reverse(ratesData);
        this.barChartData = [{ data: this.totalRatesCount }];
    };
    __decorate([
        Input(),
        __metadata("design:type", Object)
    ], RatingChartComponent.prototype, "rating", void 0);
    __decorate([
        Input(),
        __metadata("design:type", Number)
    ], RatingChartComponent.prototype, "newRate", void 0);
    RatingChartComponent = __decorate([
        Component({
            selector: 'rating-chart',
            templateUrl: 'rating-chart.html'
        }),
        __metadata("design:paramtypes", [])
    ], RatingChartComponent);
    return RatingChartComponent;
}());
export { RatingChartComponent };
//# sourceMappingURL=rating-chart.js.map