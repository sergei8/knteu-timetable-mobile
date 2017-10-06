import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {AlertController} from 'ionic-angular';
import {SharedObjects} from '../../providers/shared-data/shared-data';
import {ToastController} from 'ionic-angular';

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


}


