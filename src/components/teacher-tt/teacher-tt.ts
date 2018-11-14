import {Component} from '@angular/core';
import {NavParams} from 'ionic-angular';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {DataProvider} from '../../providers/data/data';
import {Nav} from 'ionic-angular';
import {RatingComponent} from "../rating/rating";
import {AlertController} from 'ionic-angular';

import * as _ from 'lodash';

@Component({
  selector: 'teacher-tt',
  templateUrl: 'teacher-tt.html'
})
export class TeacherTtComponent {

  checkForEmptyDay = TeacherTtComponent.checkForEmptyDay;

  teacher: string;  // фио препода из расписания
  teacherFullName: string; // фио препода со страницы кафедры
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
  showSpinner: boolean;

  showAddButton: boolean;

  constructor(public navParams: NavParams, private sharedObjects: SharedObjects,
              public data: DataProvider, public nav: Nav,
              private alert: AlertController) {

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
    this.showSpinner = true;


    // заполним переключатели видимости недель
    for (let i in this.weekNames) {
      this.weekShowSwitch[this.weekNames[i]] = true;
    }
  }


  /**
   * Выполняется каждый раз при показе экрана
   * вызывает считывание актуального рейта препода
   */
  ionViewDidLoad() {

    // отладка --------------------------------------------
    this.sharedObjects.currentUserDeviceId = '1539103546771';
    // this.sharedObjects.currentUserDeviceId = Date.now().toString();
    //-----------------------------------------------------

    // получить текущий рейтинг препода и построить звездочки
    // ВСЕГДА при открытии этого экрана!!!
    this.data.getTeacherRating(this.teacherFullName)
      .then((result) => {
          // когда фио препода обработалось в getTeacherRating
          if (result) {
            [this.rating, this.votedUsers, this.showVotes] = result;
            this.starsList = this.data.createStarsList(this.rating);
          }
          else {
            this.starsList = [];
          }
          this.showSpinner = false;
        }
      )
      .catch((err) => console.log(err));
  }

  /**
   * Проверяет, есть ли на данный день пары у прпода для вывода в расписании
   * @param day
   * @return {boolean}
   */
  static checkForEmptyDay(day): boolean {
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
    this.teacherFullName = this.details ? this.details['name'] : '';
    return this.teacherFullName;
  }

  getFacultet(): string {
    return this.details ? this.details['fac'] : '';
  }

  getDepartment(): string {
    return this.details ? this.details['dep'] : '';
  }

  /**
   * проверяет было ли уже голосование с этого девайса
   * выводит диалог да/нет и вызывает экран голосования
   */
  setRatingPage() {


    // если общий объект teacherRate содержит список рейтингов
    // то делаем обработку
    if (Object.keys(this.sharedObjects.teacherRate).length > 0) {
      const lastRates = this.sharedObjects.teacherRate;
      const deviceId = this.sharedObjects.currentUserDeviceId;
      // проверяем, голосовал ли уже юзер за єтого препода
      if (Object.keys(lastRates).indexOf(deviceId) != -1) {
        //  если голосовал, находим результаты последнего гососования
        let [rate, date] = this.data.selectLastRate(lastRates[deviceId]);
        const warningMessage = `Ваша оцінка за ${date.toLocaleDateString()} була ${rate}. Бажаєте змінити її?`
        // вывод предупреждения
        let confirm = this.alert.create({
          subTitle: 'Попередження',
          message: warningMessage,
          buttons: [
            {
              text: 'Ні ',
              cssClass: 'alertButton',
              handler: () => {
              }
            },
            {
              text: 'Так',
              cssClass: 'alertButton',
              handler: () => {
                this.showRating().then();
              }
            }
          ]
        });
        confirm.present().then();
      }
      else {
        this.showRating().then();
      }
    } else {
      // иначе, если общий объект `teacherRate` пустой, то значит рейтингов
      // по этому преподу не было и пееходим на экрай рейтов
      // this.data.addNewTeacher(this.teacherFullName);
      this.showRating().then();
    }
  }


  async showRating() {
    await this.nav.push(RatingComponent,
      {
        teacher: this.teacher,
        details: this.details
      });

  }

}
