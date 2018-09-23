import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Device} from '@ionic-native/device';

import {AngularFirestore} from 'angularfire2/firestore';

// import {F} from 'angularfire2/firestore';

@Injectable()
export class FirestoreLogProvider {

  constructor(private fireStore: AngularFirestore,
              private device: Device) {
  }

  setHomePageLog() {
    const path = `Home/${Date.now()}`;
    let userDoc = this.fireStore.doc<any>(path);
    userDoc.set({
      userDeviceId: this.device.uuid,
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
