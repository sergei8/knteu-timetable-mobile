import {Component} from '@angular/core';
import {FirestoreLogProvider} from '../../providers/firestore-log/firestore-log'
import {SharedObjects} from '../../providers/shared-data/shared-data';

@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class HomeComponent {

  constructor(private fireStore: FirestoreLogProvider, sharedObjects: SharedObjects) {
    if (!sharedObjects.stopLogging) {
      this.fireStore.setHomePageLog().then().catch()
    }
  }

}
