import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'rating-stars',
  templateUrl: 'rating-stars.html'
})
export class RatingStarsComponent {
  @Input() settedRate: number;
  @Output() settedRateChange = new EventEmitter();

  rating: number;

  constructor() {
    this.rating = 0;
  }

  rateIt(num: number) {
    this.rating = num;
    this.settedRateChange.emit(this.rating);
  }

  setColor(num: number) {
    if (this.rating) {
      if (num > this.rating) {
        return 'lightgray';
      } else {
        return '#FFCC33';
      }
    } else {
      return 'lightgray';
    }
  }

}
