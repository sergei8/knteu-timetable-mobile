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

  constructor(private sharedData: SharedObjects, private data: DataProvider) {

    data.readSetup()
      .then(result => {
        console.log('after readSetup---', this.sharedData.globalParams);
        this.isSaveRozklad = this.sharedData.globalParams['saveRozklad'];

      })

  }

  saveRozkladClicked() {
    this.sharedData.globalParams['saveRozklad'] = this.isSaveRozklad;
    console.log('write ****', this.sharedData.globalParams);
    // localforage.setItem('setup', {});
    localforage.setItem('setup', this.sharedData.globalParams);
  }

}
