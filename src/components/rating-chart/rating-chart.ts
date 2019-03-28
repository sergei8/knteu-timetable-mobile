import {Component, Input, OnChanges} from '@angular/core';
import * as _ from 'lodash';
import {ChartsModule} from 'ng2-charts/ng2-charts';

@Component({
  selector: 'rating-chart',
  templateUrl: 'rating-chart.html'
})
export class RatingChartComponent implements OnChanges {
  @Input() rating: object;
  @Input() newRate: number;

  totalRatesCount = [0, 0, 0, 0, 0];

  public barChartOptions: any = {
    scaleShowVerticalLines: true,
    responsive: true,
  };
  public barChartLabels = [
    '\u2605\u2605\u2605\u2605\u2605',
    '\u2605\u2605\u2605\u2605',
    '\u2605\u2605\u2605',
    '\u2605\u2605',
    '\u2605'];

  public barChartType = 'horizontalBar';
  public barChartLegend = false;
  public barColors: Array<object> = [
    {
      backgroundColor: 'rgba(225,10,24,0.2)'
    }];

  public barChartData: Array<object> = [
    {data: this.totalRatesCount}
  ];

  constructor() {
  }

  ngOnChanges() {
    let ratesCountObj = _.countBy(this.rating);
    let ratesData = [0, 0, 0, 0, 0];
    _.each(Object.keys(ratesCountObj), key => {
      let rateKey = parseInt(key) - 1;
      ratesData[rateKey] = ratesCountObj[key];
    });

    if (this.newRate > 0) {
      ratesData[this.newRate - 1] += 1;
    }

    this.totalRatesCount = _.reverse(ratesData);
    this.barChartData = [{data: this.totalRatesCount}];
  }

}
