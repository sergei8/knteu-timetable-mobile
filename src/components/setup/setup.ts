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
  isAllowRating: boolean;

  constructor(private sharedData: SharedObjects, private data: DataProvider) {

    data.readSetup()
      .then(result => {
        this.isSaveRozklad = this.sharedData.globalParams['saveRozklad'];
      })

  }

  saveRozkladClicked() {
    this.sharedData.globalParams['saveRozklad'] = this.isSaveRozklad;
    localforage.setItem('setup', this.sharedData.globalParams).then();
  }

  allowRating() {
    this.sharedData.globalParams['allowRating'] = this.isAllowRating;
    localforage.setItem('setup', this.sharedData.globalParams).then();

  }

  clearRozklad() {
    localforage.removeItem('student')
      .then(() => {
        this.data.showToastMessage('Ви видалили збережений локально розклад', 'top',
          'infoToast', false, 3000);
        localforage.removeItem('teacher').then();
      });
  }

}
