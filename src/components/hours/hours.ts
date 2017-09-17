import {Component} from '@angular/core';

@Component({
  selector: 'hours',
  templateUrl: 'hours.html'
})
export class HoursComponent {

  paraByHours = [];

  constructor() {
    this.paraByHours = [
      {'number': 1, 'hours': '08:20 – 09:40', 'break': '15'},
      {'number': 2, 'hours': '09:55 – 11:15', 'break': '35'},
      {'number': 3, 'hours': '11:50 – 13:10', 'break': '20'},
      {'number': 4, 'hours': '13:30 – 14:50', 'break': ''},
      {'number': 5, 'hours': '15:00 – 16:20', 'break': ''},
      {'number': 6, 'hours': '16:30 – 17:50', 'break': '10'},
      {'number': 7, 'hours': '18:00 – 19:20', 'break': ''},
    ]


  }

}
