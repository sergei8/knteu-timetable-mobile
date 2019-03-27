import {Component} from '@angular/core';
import {IonicPage} from 'ionic-angular';
import {AppRate} from '@ionic-native/app-rate'
import {SharedObjects} from '../../providers/shared-data/shared-data';

@IonicPage()
@Component({
  selector: 'about',
  templateUrl: 'about.html'
})
export class AboutComponent {

  text: string;
  appVersion: string;

  constructor(private appRate: AppRate, private sharedObjects: SharedObjects) {
    this.appVersion = sharedObjects.appVersion;
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
    this.appRate.navigateToAppStore();
  }
}

