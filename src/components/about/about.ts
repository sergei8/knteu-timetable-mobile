import {Component} from '@angular/core';

@Component({
  selector: 'about',
  templateUrl: 'about.html'
})
export class AboutComponent {

  text: string;

  constructor() {
  }


  goToWeb() {
    window.location.href = 'https://goo.gl/EhAU9z';
  }

  goToPlayMarket() {
  }
}

