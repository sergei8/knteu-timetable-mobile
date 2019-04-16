import {Injectable} from '@angular/core';
import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential,
  StitchAppClient,
  RemoteMongoDatabase,
} from 'mongodb-stitch-browser-sdk';

@Injectable({
  providedIn: 'root'
})
export class MongodbStitchProvider {

  clientRatings: StitchAppClient;
  dbRatings: RemoteMongoDatabase;
  clientNews: StitchAppClient;
  dbNews: RemoteMongoDatabase;

  constructor() {
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

    return await this.clientNews.auth.loginWithCredential(new AnonymousCredential())
      .then(async () => await this.dbNews.collection('news-list')
        .find({}, options).asArray())
  }

  /**
   * извлекает из БД `news-list` детали новости
   * @param {string} newsId - id новостного док-та
   * @return {Promise<Array<Object>>}
   */
  async getDetails(newsId: string): Promise<Array<Object>> {

    const options = {
      "projection": {"details": 1, "_id": 0}
    };

    return await this.clientNews.auth.loginWithCredential(new AnonymousCredential())
      .then(async () => await this.dbNews.collection('news-list')
        .find({"_id": newsId}, options).asArray())

  }

  /**
   * обновляет поле `votes` после голосования
   * @param {Object} news - новость, для которой было голосование
   * @return {Promise<any>} - делается асинхронно
   */
  async storeNewsVote(news: Object): Promise<any> {
    const query = {_id: news['_id']};
    const update = {
      $set: {
        votes: news['votes']
      }
    };

    return await this.clientNews.auth.loginWithCredential(new AnonymousCredential())
      .then(async () => await this.dbNews.collection('news-list')
        .updateOne(query, update).catch(e => console.log(e)))
  }

  /**
   * обновляет поле `views` (просмотры) для новости с newsID
   * @param {string} newsId - id новости
   * @param {Array<string>} views - массив, содержащий id устр-в юзеров
   * @return {Promise<any>} - асинхронное обещание
   */
  async storeViews(newsId: string, views: Array<string>): Promise<any> {
    return await this.clientNews.auth.loginWithCredential(new AnonymousCredential())
      .then(async () => await this.dbNews.collection('news-list')
        .updateOne({_id: newsId}, {$set: {views: views}})
        .catch(e => console.log(e)))

  }

}
