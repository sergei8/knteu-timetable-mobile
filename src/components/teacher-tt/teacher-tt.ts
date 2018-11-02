import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {DataProvider} from '../../providers/data/data';
import {Nav} from 'ionic-angular';
import {RatingComponent} from "../rating/rating";
// import {MongodbStitchProvider} from '../../providers/mongodb-stitch/mongodb-stitch';

import * as _ from 'lodash';

@Component({
  selector: 'teacher-tt',
  templateUrl: 'teacher-tt.html'
})
export class TeacherTtComponent {

  teacher: string;
  weekShowSwitch = {};   // скрывают/открывают дни недели
  wdp: object;
  details: object;
  weekNames: string[];
  dayNamesList: string[];
  paraNamberList: string[];
  eyeOffSwitch: boolean[];
  eyeOnSwitch: boolean[];
  rating: number;       // рейтинг
  votedUsers: number;   // число проголосовавших
  showVotes: boolean;   // выключается при ошибке доступа к БД что бы не показывать рейты
  starsList: string[];

  showAddButton: boolean;

  constructor(public navParams: NavParams, private sharedObjects: SharedObjects,
              public data: DataProvider, public nav: Nav) {
              // private mongodbStitchProvider: MongodbStitchProvider) {

    this.teacher = navParams.get('teacher');
    this.wdp = navParams.get('wdp');
    this.details = navParams.get('details');

    this.weekNames = this.sharedObjects.weekNames;
    this.dayNamesList = this.sharedObjects.dayNamesList;
    this.paraNamberList = this.sharedObjects.paraNamberList;

    this.eyeOffSwitch = [true, true];
    this.eyeOnSwitch = [false, false];

    this.showAddButton = this.sharedObjects.globalParams['saveRozklad'];

    this.rating = 0;
    this.votedUsers = 0;
    this.showVotes = true;

    this.data.showTeacherRating(this.teacher)
      .then((result) => {
          [this.rating, this.votedUsers, this.showVotes] = result;
          // console.log('*********', result);
          this.starsList = data.createStarsList(this.rating);
        }
      )
      .catch();

    // заполним переключатели видимости недель
    for (let i in this.weekNames) {
      this.weekShowSwitch[this.weekNames[i]] = true;
    }

  }

  /**
   * Проверяет, есть ли на данный день пары у прпода для вывода в расписании
   * @param day
   * @return {boolean}
   */
  checkForEmptyDay(day): boolean {
    let result = _.reduce(day, (acum, item) => acum += item.length, 0);
    return result > 0;
  }

  // видеть/скрыть дни недели `weekName`
  weekClicked(weekName, index) {
    this.eyeOffSwitch[index] = !this.eyeOffSwitch[index];
    this.eyeOnSwitch[index] = !this.eyeOnSwitch[index];
    this.weekShowSwitch[weekName] = !this.weekShowSwitch[weekName];
  }

  saveTimeTable() {
    const rozklad = {
      id: 'teacher',
      teacher: this.teacher,
      wdp: this.wdp
    };
    this.data.saveTimeTable(rozklad);
  }

  /**
   * возвращает url фотки препода
   * @return {string}
   */
  getImage(): string {
    if (this.details) {
      // если фотки нету
      if (this.details['img_url'] == null) {
        return '';
      } else {
        return this.details['img_url'];
      }
    } else {
      // если нету поля `details`
      return '';
    }
  }

  getName(): string {
    return this.details ? this.details['name'] : '';
  }

  getFacultet(): string {
    return this.details ? this.details['fac'] : '';
  }

  getDepartment(): string {
    return this.details ? this.details['dep'] : '';
  }

  /*
    /!**
     * извлекает из БД документ с рейтингами препода teacherName
     * @param teacherName - имя препода
     *!/
    showTeacherRating(teacherName): void {
      // в ratings накапливаются последние рейтинги выданные пользователями
      let ratings = [];
      // подключаемся к БД рейтингов
      this.mongodbStitchProvider.getTeacherRatingsList("препод111")
        .then(ratingList => {
          if (ratingList.length > 0) {
            // в rateList - все рейтинги, оставленные преподу
            let rateList = ratingList[0].rateList;
            // перебираем рейтинги по каждому пользователю;
            for (let userId in rateList) {
              if (rateList.hasOwnProperty(userId)) {
                // в userRatesList - рейтинги, оставленные пользователем для этого препода
                let userRatesList: object[] = rateList[userId];
                // выбираем из рейтингов пользователя последний оставленный
                let lastRate = this.selectLastRate(userRatesList);
                // добавляем его в массив актуальных рейтов
                ratings.push(lastRate);
              }
            }
          }
          this.rating = _.round(_.sum(ratings) / ratings.length, 1);
          this.votedUsers = ratings.length;
          this.createStarsList();

        })
        // если ошибка доступа к БД, то выключаем показ рейтинга
        .catch(err => {
          console.log('ошибка при доступе к БД', err);
          this.showVotes = false;
        });
    }

    /!**
     * находит последний рейт, установленный данным пользователем
     * @param userRatesList - массив рейтингов [{date:__, rating:__}...]
     * @return {number} - последний рейтинг
     *!/
    private selectLastRate(userRatesList: object[]): number {
      let lastRate = 0;
      let minDate = new Date("01/01/01");
      userRatesList.forEach((rate) => {
        if (rate['date'] > minDate) {
          lastRate = rate['rating'];
          minDate = rate['date'];
        }
      });
      return lastRate;
    }

    private createStarsList() {
      this.starsList = ["star-outline", "star-outline", "star-outline", "star-outline", "star-outline"];
      let numberOfStars = Math.floor(this.rating);
      let halfStar: boolean = this.rating - numberOfStars > 0;
      for (let i = 0; i < numberOfStars; i++) {
        this.starsList[i] = "star"
      }
      if (halfStar) {
        this.starsList[numberOfStars] = 'star-half';
      }

    }
  */

  async showRating() {
    await this.nav.push(RatingComponent,
      {
        teacher: this.teacher,
        details: this.details
      });

  }

}
