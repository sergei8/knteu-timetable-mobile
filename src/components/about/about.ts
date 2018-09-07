import {Component} from '@angular/core';
import {AppRate} from '@ionic-native/app-rate'

@Component({
  selector: 'about',
  templateUrl: 'about.html'
})
export class AboutComponent {

  text: string;

  constructor(private appRate: AppRate) {

/*
    this.appRate.preferences.storeAppURL = {
      android: 'market://details?id=ek.knteu.timetable'
    };

    this.appRate.preferences.useLanguage = 'uk-UK'
*/
  }


  goToWeb() {
    window.location.href = 'https://goo.gl/EhAU9z';
  }

  goToPlayMarket() {
    this.appRate.promptForRating(true);
  }
}

