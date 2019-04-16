import {Component} from '@angular/core';
import {Nav} from 'ionic-angular';
import {FirestoreLogProvider} from '../../providers/firestore-log/firestore-log'

import {MongodbStitchProvider} from '../../providers/mongodb-stitch/mongodb-stitch';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {DataProvider} from '../../providers/data/data';
import {NewsDetailsComponent} from "../news-details/news-details";


@Component({
  selector: 'news',
  templateUrl: 'news.html'
})
export class NewsComponent {

  text: string;
  shortNewsList: any;
  private showSpinner: boolean;
  positiveAmount: number;
  negativeAmount: number;

  constructor(public nav: Nav, private mongodbStitchProvider: MongodbStitchProvider,
              private  fireStore: FirestoreLogProvider,
              private sharedObjects: SharedObjects,
              private data: DataProvider) {

    if (!this.sharedObjects.isConnected) {
      this.data.showToastMessage('Відсутній доступ до інтернет', 'bottom',
        'warningToast', true, 3000);
      this.showSpinner = false;
    }
  }

  /**
   * вызывается после загрузки экрана
   * пишет лог, если разрешено
   * инициирует асинхронное чтение новостей из БД
   */
  ionViewDidLoad() {

    if (!this.sharedObjects.stopLogging) {
      this.fireStore.setNewsPageLog().then().catch()
    }

    this.showSpinner = true;
    this.mongodbStitchProvider.getShortNewsList()
      .then((res) => {
        this.showSpinner = false;
        this.shortNewsList = res;
      });

  }


  /**
   * считает разницу между положительными и отрицательными мнениями
   * число голосов - это длина массива в объекте `votes` коллекции `news-list`
   * @param votes - объект из документа БД
   * @return {number} - разница + и -
   */
  getVotesBalance(votes: any): number {
    if (votes) {
      this.positiveAmount = votes["like"] ? votes["like"].length : 0;
      this.negativeAmount = votes["dislike"] ? votes["dislike"].length : 0;
      return this.positiveAmount - this.negativeAmount
    }
    else {
      return 0;
    }
  }

  /**
   * вычисляет количество прсмотров новости
   * @param news - объект из документа БД `news-list`
   * @return {number} - количество просмотров
   */
  getTotalViews(news: Object): number {
    return 'views' in news ? news['views'].length : 0
  }


  changeVotes(voteType: number, newsId: string): void {

    // console.log(this.shortNewsList);
    this.shortNewsList.forEach(news => {
      if (news._id == newsId) {
        this.setVote(news, voteType);
        this.mongodbStitchProvider.storeNewsVote(news).then();
      }
    });
  }

  /**
   * изменяет счетчик голосований в зависимости от нажатой стрелки (верх/низ)
   * @param {Object} news - новость, которая голосуется
   * @param {number} voteType - тип голоса: 1 - положит. 0 - отрицат.
   */
  setVote(news: Object, voteType: number): void {
    //отладка
    this.sharedObjects.currentUserDeviceId = '222222';
    //
    // id устройства пользователя
    const devId = this.sharedObjects.currentUserDeviceId;
    // имя поля в поле `votes` новости
    const voteName = voteType == 1 ? 'like' : 'dislike';
    // если поля `votes` присутствует в новости
    if ('votes' in news) {
      // если тип мнения есть в `votes`
      if (voteName in news['votes']) {
        // проверяем, был ли уже голос от этого юзера
        //todo изменить на include...
        if (news['votes'][voteName].indexOf(devId) === -1) {
          // не было - дописываем id в массив голосов
          news['votes'][voteName].push(devId);
        }
      } else {
        // поля типа нету - создаем его и дописываем массив с id
        news['votes'][voteName] = [devId];
      }
    } else {
      // поля `vote` нету - создаем его и дописываеи в тип голоса новый id
      news['votes'] = {};
      news['votes'][voteName] = [devId];
    }
  }


  /**
   * заносит в поле `views` id юзера при переходе на экран деталей новости
   * @param {Object} news - новость, на которой открыли детали
   */
  setViews(news: Object): void {

    //отладка
    this.sharedObjects.currentUserDeviceId = '333333';
    //
    // id устройства пользователя
    const devId = this.sharedObjects.currentUserDeviceId;

    if (news.hasOwnProperty('views')) {
      if (news['views'].indexOf(devId) === -1) {
        news['views'].push(devId);
      } else {
        return;
      }
    } else {
      news['views'] = [];
      news['views'] = [devId];
    }
    // обновляем док-т в БД
    this.mongodbStitchProvider.storeViews(news['_id'], news['views']).then()
  }

  /**
   * загружает экран отображения деталей новости и передает ему id новости
   * @param {Object} news - новость
   */
  showNewsDetails(news: Object): void {
    this.setViews(news);
    this.nav.push('NewsDetailsComponent',
      {
        newsId: news['_id'],
        title: news['title']
      }).then();
  }

}
