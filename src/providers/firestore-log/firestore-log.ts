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

  async setHomePageLog() {
    const path = `Home/${Date.now()}`;
    const homeDoc = this.fireStore.doc<any>(path);
    let userIpAddr = {ip: null};
    // перехват runtime-error при отладке
    try {
      userIpAddr = await this.networkInterface.getCarrierIPAddress();
    } catch (e) {
    }
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
      userIp: userIpAddr.ip,
      /*
            userLatitude: location[0],
            userLongitude: location[2],
      */
    });
  }

  async setStudentPageLog(faculty: string, course: string, group: string, saved = false) {
    const path = `Student/${Date.now()}`;
    const studentDoc = this.fireStore.doc<any>(path);

    studentDoc.set({
        userDeviceId: this.device.uuid,
        faculty: faculty,
        course: course,
        group: group,
        saved: saved
      }
    ).then().catch()
  }

  async setTeacherPageLog(teacherName: string, fromDiscipline: string = null, saved = false) {
    const path = `Teacher/${Date.now()}`;
    const teacherDoc = this.fireStore.doc<any>(path);
    teacherDoc.set({
      userDeviceId: this.device.uuid,
      name: teacherName,
      fromDiscipline: fromDiscipline,
      saved: saved
    }).then().catch()
  }
}
