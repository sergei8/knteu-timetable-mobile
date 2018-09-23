import {Injectable} from '@angular/core';
import {Device} from '@ionic-native/device';
import {AngularFirestore} from 'angularfire2/firestore';

@Injectable()
export class FirestoreLogProvider {

  constructor(private fireStore: AngularFirestore,
              private device: Device) {
  }

  setHomePageLog() {
    const path = `Home/${Date.now()}`;
    let homeDoc = this.fireStore.doc<any>(path);
    homeDoc.set({
      userDeviceId: this.device.uuid,
      userDeviceModel: this.device.model,
      userDevicePlatform: this.device.platform,
      userOsVersion: this.device.version,
      userDeviceManufacturer: this.device.manufacturer
    }).then()
      .catch()
  }

}


/*
export interface IHomePageLog {
  dateTime: object,
  userDeviceId: string,
  userDeviceModel: string,
  userIp: string,
  userOsVersion: string,
  userGeoPoint: object
}
*/
