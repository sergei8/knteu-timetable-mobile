import {Component} from '@angular/core';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {DataProvider} from '../../providers/data/data';

declare const require: any;
const localforage: LocalForage = require("localforage");

@Component({
  selector: 'setup',
  templateUrl: 'setup.html'
})
export class SetupComponent {

  isSaveRozklad: boolean;
  // isAllowRating: boolean;
  isAllowPush: boolean;

  constructor(private sharedData: SharedObjects, private dataProvider: DataProvider) {

    this.dataProvider.readLocalSetup()
      .then(result => {
        this.isSaveRozklad = this.sharedData.globalParams['saveRozklad'];
        this.isAllowPush = this.sharedData.globalParams['getPush'];
      })
  }

  saveRozkladClicked() {
    this.sharedData.globalParams['saveRozklad'] = this.isSaveRozklad;
    this.sharedData.globalParams['getPush'] = this.isAllowPush;
    localforage.setItem('setup', this.sharedData.globalParams).then();
  }

/*
  allowRating() {
    this.sharedData.globalParams['allowRating'] = this.isAllowRating;
    localforage.setItem('setup', this.sharedData.globalParams).then();
  }
*/

  clearRozklad() {
    localforage.removeItem('student')
      .then(() => {
        this.dataProvider.showToastMessage('Ви видалили збережений локально розклад', 'bottom',
          'infoToast', false, 3000);
        localforage.removeItem('teacher').then();
      });
  }

}
