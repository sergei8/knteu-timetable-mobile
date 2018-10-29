import {Injectable} from '@angular/core';
import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
  StitchAppClient,
  RemoteMongoDatabase
} from 'mongodb-stitch-browser-sdk';
import * as _ from 'lodash';

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
   * подсчитывает и возвращает средний рейтинг
   * @param teacherName - имя препода
   * @return {Promise<number>}
   */
  getTeacherRating(teacherName): Promise<number> {
    return new Promise((resolve => {
        this.client.auth.loginWithCredential(new AnonymousCredential())
          .then(() => this.db.collection('teachers')
            .find({"name": teacherName}).asArray())
          .then(docs => {
            let rating = 0;
            if (docs.length > 0) {
              rating = _.meanBy(docs, o => o.rating);
            }
            resolve(rating);
          })
      }
    ))
  }
}
