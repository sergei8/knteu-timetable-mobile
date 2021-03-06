import {Injectable} from '@angular/core';
import {Device} from '@ionic-native/device';
import {AngularFirestore} from 'angularfire2/firestore';
// import {Geolocation} from '@ionic-native/geolocation';
import {NetworkInterface} from '@ionic-native/network-interface';
import {SharedObjects} from '../shared-data/shared-data';

@Injectable()
export class FirestoreLogProvider {

  constructor(private fireStore: AngularFirestore,
              private device: Device,
              private networkInterface: NetworkInterface,
              public sharedObjects: SharedObjects) {
  }

  async setHomePageLog():Promise<void> {
    const path = `Home/${Date.now()}`;
    const homeDoc = this.fireStore.doc<any>(path);

    let userIpAddr = {ip: null};
    // перехват runtime-error при отладке
    try {
      userIpAddr = await this.networkInterface.getCarrierIPAddress();
    } catch (e) {
    }

    await homeDoc.set({
      userDeviceId: this.sharedObjects.currentUserDeviceId,
      userDeviceModel: this.device.model,
      userDevicePlatform: this.device.platform,
      userOsVersion: this.device.version,
      userDeviceManufacturer: this.device.manufacturer,
      userIp: userIpAddr.ip,
      /*
            userLatitude: location[0],
            userLongitude: location[2],
      */
    }).then().catch();
  }

  async setStudentPageLog(faculty: string, course: string, group: string, saved = false): Promise<void> {
    const path = `Student/${Date.now()}`;
    const studentDoc = this.fireStore.doc<any>(path);

    await studentDoc.set({
        userDeviceId: this.device.uuid,
        faculty: faculty,
        course: course,
        group: group,
        saved: saved
      }
    ).then().catch()
  }

  async setTeacherPageLog(teacherName: string, fromDiscipline: string = null, saved = false): Promise<void> {
    const path = `Teacher/${Date.now()}`;
    const teacherDoc = this.fireStore.doc<any>(path);
    await teacherDoc.set({
      userDeviceId: this.device.uuid,
      name: teacherName,
      fromDiscipline: fromDiscipline,
      saved: saved
    }).then().catch()
  }

  async setRatingPageLog(teacherName: string, action: string = 'view'): Promise<void> {
    const path = `Rating/${Date.now()}`;
    const ratingDoc = this.fireStore.doc<any>(path);
    await ratingDoc.set({
      userDeviceId: this.device.uuid,
      teacherName: teacherName,
      action: action
    }).then().catch()
  }

  async setNewsPageLog(): Promise<void> {
    const path = `News/${Date.now()}`;
    const newsDoc = this.fireStore.doc<any>(path);
    await newsDoc.set({
      userDeviceId: this.device.uuid,
      // newsId: ""
    }).then().catch()

  }

  async setNewsDetailsPageLog(newsId: string): Promise<void> {
    const path = `News-details/${Date.now()}`;
    const newsDoc = this.fireStore.doc<any>(path);
    await newsDoc.set({
      userDeviceId: this.device.uuid,
      newsId: newsId
    }).then().catch()

  }


}
