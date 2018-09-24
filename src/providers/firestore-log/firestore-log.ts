import {Injectable} from '@angular/core';
import {Device} from '@ionic-native/device';
import {AngularFirestore} from 'angularfire2/firestore';
// import {Geolocation} from '@ionic-native/geolocation';
import {NetworkInterface} from '@ionic-native/network-interface';

@Injectable()
export class FirestoreLogProvider {

  constructor(private fireStore: AngularFirestore,
              private device: Device,
              private networkInterface: NetworkInterface) {
  }

  setHomePageLog() {
    const path = `Home/${Date.now()}`;
    let homeDoc = this.fireStore.doc<any>(path);
    const userIp = this.networkInterface.getCarrierIPAddress()
      .then(addr => {console.log(addr); return addr;})
      .catch(error => 'error');
    /*
        const location = this.geolocation.getCurrentPosition()
          .then((response) => {
            const lat = response.coords.latitude;
            const lon = response.coords.longitude;
            return [lat, lon];
          }).catch((error): void => {
          });
    */
    homeDoc.set({
      userDeviceId: this.device.uuid,
      userDeviceModel: this.device.model,
      userDevicePlatform: this.device.platform,
      userOsVersion: this.device.version,
      userDeviceManufacturer: this.device.manufacturer,
      userIp: '111',
      /*
            userLatitude: location[0],
            userLongitude: location[2],
      */
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
