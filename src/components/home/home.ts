import {Component} from '@angular/core';
import {FirestoreLogProvider} from '../../providers/firestore-log/firestore-log'

@Component({
  selector: 'home',
  templateUrl: 'home.html'
})
export class HomeComponent {

  constructor(private fireStore: FirestoreLogProvider) {
    this.fireStore.setHomePageLog().then().catch()
  }

}
