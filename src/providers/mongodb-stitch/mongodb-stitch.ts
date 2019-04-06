import {Injectable} from '@angular/core';
import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
  StitchAppClient,
  RemoteMongoDatabase,
  UserPasswordCredential,
  UserApiKeyCredential
} from 'mongodb-stitch-browser-sdk';
import {resolve} from "url";
import {r} from "tar";
import {_catch} from "rxjs-compat/operator/catch";

@Injectable({
  providedIn: 'root'
})
export class MongodbStitchProvider {

  clientRatings: StitchAppClient;
  dbRatings: RemoteMongoDatabase;
  clientNews: StitchAppClient;
  dbNews: RemoteMongoDatabase;

  /*
    appId: string;
    dbName: string;
  */

  constructor() {
    // this.appId = 'rating-kvicy';
    // this.dbName = 'ratings';
  }

  /**
   *  Инициализация stitch-клиента (выполняется 1 раз при входе)
   * @return {boolean} true - успешно, false - нет
   */
  initClients(): boolean {
    try {
      // this.client = Stitch.initializeDefaultAppClient(appId);
      this.clientRatings = Stitch.initializeAppClient('rating-kvicy');
      this.dbRatings = this.clientRatings.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('ratings');

      // this.client = Stitch.initializeDefaultAppClient(appId);
      this.clientNews = Stitch.initializeAppClient('knteu-news-psqjs');
      this.dbNews = this.clientNews.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('knteu-news');

    } catch (e) {
      console.log(e);
      return false;
    }

    return true;

  }

  /**
   * Ищет в коллекции `teachers`список рейтиногов для имя препода
   * если препода нету, возвращает пустой обїект
   * @param teacherName - имя препода
   * @return {Promise<number>} - массив с рейтингами
   */
  getTeacherRatingsList(teacherName): Promise<Object[]> {
    return new Promise((resolve => {
        // this.clientRatings.auth.loginWithCredential(new AnonymousCredential()).catch();
        // const credential = new UserApiKeyCredential("f4e30324-d286-41f4-852f-d69c9d36ce11");

        this.clientRatings.auth.loginWithCredential(new AnonymousCredential())
          .then(() => this.dbRatings.collection('teachers')
            .find({"name": teacherName}).asArray())
          .then(docs => {
            resolve(docs);
          })
          .catch((error) => console.log('Error getTeacherRatingsList', error))
      }
    ))
  }

  /**
   * перезаписывает досумент препода новыми рейтингами или создает новый док-т, если препода нет в БД
   * @param {object} rateList - объект с рейтингами препода
   * @param {string} name - имя препода
   * @return {Promise<any>}
   */
  writeTeacherDoc(rateList: object, name: string): Promise<any> {
    return new Promise<any>(resolve => {
      this.clientRatings.auth.loginWithCredential(new AnonymousCredential())
        .then(() => this.dbRatings.collection('teachers')
          .updateOne({name: name}, {$set: {rateList: rateList}}, {upsert: true}))
        .catch((error) => console.log('writeTeacherDoc', error));
      resolve();
    });
  }

  /**
   * вибирает из БД новостей все новости
   * @return {Promise<any>} - массив документов-новостей,
   * без поля `details` и `blog_urk`, сортированый обратно порядку записи
   */
  async getShortNewsList(): Promise<any> {

    const options = {
      "projection": {"blog_url": 0, "details": 0},
      "sort": {"$natural": -1}
    };

    /*
        return new Promise(resolve => {
          this.clientNews.auth.loginWithCredential(new AnonymousCredential()).then()
            .then(() => this.dbNews.collection('news-list')
              .find({}, options).asArray())
            .then((doc) => resolve(doc))
        })
    */

    return await this.clientNews.auth.loginWithCredential(new AnonymousCredential())
      .then(async () => await this.dbNews.collection('news-list')
        .find({}, options).asArray())
  }

  async getDetails(newsId: string): Promise<Array<Object>>{

    const options = {
      "projection": {"details": 1, "_id": 0}
    };

    return await this.clientNews.auth.loginWithCredential(new AnonymousCredential())
      .then(async () => await this.dbNews.collection('news-list')
        .find({"_id" : newsId}, options).asArray())

  }

}
