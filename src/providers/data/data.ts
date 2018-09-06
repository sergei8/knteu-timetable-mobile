import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {AlertController} from 'ionic-angular';
import {SharedObjects} from '../shared-data/shared-data';
import {ToastController} from 'ionic-angular';

import * as $ from 'jquery';
import * as _ from 'lodash';

declare const require: any;
const localforage: LocalForage = require("localforage");

@Injectable()
export class DataProvider {

  constructor(public http: Http,
              private alert: AlertController,
              private sharedData: SharedObjects,
              private toast: ToastController) {
  }

  getFile(url): Observable<Object> {
    return this.http.get(url)
      .map(response => response.json());
  }

  // сохраняет распісаніе студента или препода локально
  saveTimeTable(rozklad) {

    let confirm = this.alert.create({
      // subTitle: 'Збереження розкладу',
      message: 'Ви бажаєте зберегти цей розклад у локальне сховище Вашого пристрою?',
      buttons: [
        {
          text: 'Ні',
          cssClass: 'alertButton',
          handler: () => {
          }
        },
        {
          text: 'Так',
          cssClass: 'alertButton',
          handler: () => {
            if (rozklad.id === 'student') {
              this.saveStudentRozklad(rozklad);
            }
            else {
              this.savePrepodRozklad(rozklad);
            }
            this.showToastMessage('Розклад збережено', 'bottom',
              'infoToast', false, 3000);
          }
        }
      ]
    });
    confirm.present();
  }

  readStudentRozklad() {
    const rozklad = {
      facName: '',
      course: '',
      group: '',
      wdp: {}
    };
    return localforage.getItem('student')
      .then((result) => {
          if (result) {
            rozklad['facName'] = result['facName'];
            rozklad['course'] = result['course'];
            rozklad['group'] = result['group'];
            rozklad['wdp'] = result['wdp'];
            return rozklad;
          }
          else {
            return {}
          }
        },
        (error) => {
          return {}
        })

  }

  saveStudentRozklad(rozklad) {
    // console.log(rozklad);
    localforage.setItem("student", rozklad);
  }

  readPrepodRozklad() {
    const rozklad = {
      teacher: '',
      wdp: {}
    };
    return localforage.getItem('teacher')
      .then((result) => {
          if (result) {
            rozklad['teacher'] = result['teacher'];
            rozklad['wdp'] = result['wdp'];
            return rozklad;
          }
          else {
            return {}
          }
        },
        (error) => {
          return {}
        })

  }

  savePrepodRozklad(rozklad) {
    localforage.setItem("teacher", rozklad);
  }

  readSetup() {
    return localforage.getItem('setup')
      .then(result => {
          if (result || result == {}) {
            this.sharedData.globalParams = result;
          }
        },
        (error) => console.log(error))
  }

  showToastMessage(message, position, cssClass, showCloseButton, duration) {
    const toast = this.toast.create({
      message: message,
      showCloseButton: showCloseButton,
      closeButtonText: 'Ok',
      duration: duration,
      cssClass: cssClass,
      position: position
    });
    toast.present();
  }

  getPrepodImgUrl(name: string): string {
    let url = '';
    const dummy_img = 'assets/img/person.png';
    /* если в allTimeTables нету поля  details (ошибка) то замещаем url заставкой*/
    try {
      url = this.sharedData.allTimeTable[name]['details']['img_url'];
    } catch (e) {
      url = dummy_img;
    }
    // return this.sharedData.allTimeTable[name]['details']['img_url'];
    // console.log(url);

    // возвращает или реальный урл или заставку
    return url != null ? url : dummy_img;
  }

  getTeacherWdp(name: string): any[] {
    let wdp = $.extend(true, {}, this.sharedData.WeekDayPara);    //  очищаем расписание группы
    let teacherDetails: object = {};

    _.each(this.sharedData.allTimeTable, (fio, teacherName) =>
      _.each(this.sharedData.weekNames.map(x => fio[x]), (week, weekIndex) =>
        _.each(week, (day, dayName) =>
          _.each(day, (para, paraNumber) => {
              if (teacherName === name) {
                teacherDetails = fio.details;
                const weekName = this.sharedData.weekNames[weekIndex];
                wdp[weekName][dayName][paraNumber] = [].concat(para[5], para[3], para[4],
                  para[0], para[1], para[2]);
              }
            }
          )
        )
      )
    );
    return [wdp, teacherDetails];
  }

}


