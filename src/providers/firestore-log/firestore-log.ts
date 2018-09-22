import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

import {AngularFirestore} from 'angularfire2/firestore';

// import {F} from 'angularfire2/firestore';

@Injectable()
export class FirestoreLogProvider {

  constructor(private fireStore: AngularFirestore) {
  }

  setHomePageLog() {
    const path = 'Home/' + Date.now();
    let userDoc = this.fireStore.doc<any>(path);
    userDoc.set({
      name: 'Jorge Vergara',
      email: 'j@javebratt.com',
    })
  }

}


export interface IHomePageLog {
  dateTime: object,
  userDeviceId: string,
  userDeviceModel: string,
  userIp: string,
  userOsVersion: string,
  userGeoPoint: object
}
