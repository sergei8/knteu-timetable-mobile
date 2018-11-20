import {Injectable} from '@angular/core';
import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
  StitchAppClient,
  RemoteMongoDatabase
} from 'mongodb-stitch-browser-sdk';

@Injectable({
  providedIn: 'root'
})
export class MongodbStitchProvider {

  client: StitchAppClient;
  db: RemoteMongoDatabase;
  appId: string;
  dbName: string;

  constructor() {
    this.appId = 'rating-kvicy';
    this.dbName = 'ratings';
  }

  /**
   *  Инициализация stitch-клиента (выполняется 1 раз при входе)
   * @return {boolean} true - успешно, false - нет
   */
  initClient(): boolean {
    try {
      this.client = Stitch.initializeDefaultAppClient(this.appId);
      this.db = this.client.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db(this.dbName);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ищет в коллекции `teachers`список рейтиногов для имя препода
   * если препода нету, возвращает пустой обїект
   * @param teacherName - имя препода
   * @return {Promise<number>} - массив с рейтингами
   */
  getTeacherRatingsList(teacherName): Promise<any> {
    return new Promise((resolve => {
        this.client.auth.loginWithCredential(new AnonymousCredential())
          .then(() => this.db.collection('teachers')
            .find({"name": teacherName}).asArray())
          .then(docs => {
            resolve(docs);
          })
          .catch((error) => console.log('Error getTeacherRatingsList' ,error))
      }
    ))
  }

  writeTeacherDoc(rateList: object, name:string): Promise<any> {
    return new Promise<any>(resolve => {
      this.client.auth.loginWithCredential(new AnonymousCredential())
        .then(() => this.db.collection('teachers')
          .updateOne({name: name}, {$set: {rateList: rateList} }, {upsert: true}))
        .catch((error) => console.log('writeTeacherDoc', error));

      resolve();
    });
  }


}
