import {Component, Input, OnChanges} from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'rating-chart',
  templateUrl: 'rating-chart.html'
})
export class RatingChartComponent {
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
      backgroundColor: 'ffcb53'
    }];

  public barChartData: Array<object> = [
    {data: this.totalRatesCount}
  ];

  constructor() {
  }

  ngOnChanges() {
    console.log('#######', this.rating)
    let ratesCountObj = _.countBy(this.rating);
    let ratesData = [0, 0, 0, 0, 0];
    _.each(Object.keys(ratesCountObj), key => {
      let rateKey = parseInt(key) - 1;
      ratesData[rateKey] = ratesCountObj[key];
    });

    if (this.newRate > 0) {
      console.log('@@@@@@', this.newRate);
      ratesData[this.newRate - 1] += 1;
    }

    // console.log('ratesData:',ratesData);
    this.totalRatesCount = _.reverse(ratesData);
    this.barChartData = [{data: this.totalRatesCount}];
  }


// events
  /*
    public chartClicked(e: any): void {
      console.log(e);
    }

    public chartHovered(e: any): void {
      console.log(e);
    }
  */

}
