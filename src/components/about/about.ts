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

this.appRate.preferences = {
  usesUntilPrompt: 1,
  storeAppURL: {
    android: 'market://details?id=ek.knteu.timetable'
  },
  useLanguage: 'uk-UK',
  displayAppName: 'розклад КНТЕУ'
}


  }



  goToPlayMarket() {
    // this.appRate.promptForRating(true);
    this.appRate.navigateToAppStore();
  }
}

