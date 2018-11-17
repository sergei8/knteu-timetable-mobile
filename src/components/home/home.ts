import {Component, OnInit} from '@angular/core';
import {FirestoreLogProvider} from '../../providers/firestore-log/firestore-log'
import {SharedObjects} from '../../providers/shared-data/shared-data';

@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class HomeComponent implements OnInit {

  constructor(private fireStore: FirestoreLogProvider,
              public sharedObjects: SharedObjects) {
  }

  ngOnInit() {
    if (!this.sharedObjects.stopLogging) {
      this.fireStore.setHomePageLog().then().catch()
    }
  }

}
