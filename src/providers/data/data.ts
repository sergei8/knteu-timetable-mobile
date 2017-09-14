import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {AlertController} from 'ionic-angular';
import {SharedObjects} from '../../providers/shared-data/shared-data';

declare const require: any;
const localforage: LocalForage = require("localforage");

@Injectable()
export class DataProvider {

  constructor(public http: Http, private alert: AlertController,
              private sharedData: SharedObjects) {
  }

  getFile(url): Observable<Object> {
    return this.http.get(url)
      .map(response => response.json());
  }

  // сохраняет распісаніе студента или препода локально
  saveTimeTable(rozklad) {

    let confirm = this.alert.create({
      title: 'Збереження розкладу',
      message: 'Ви бажаєте зберегти цей розклад у локальне сховище Вашого пристрою?',
      buttons: [
        {
          text: 'Ні',
          handler: () => {
          }
        },
        {
          text: 'Так',
          handler: () => {
            if (rozklad.id === 'student') {
              this.saveStudentRozklad(rozklad);
            }
            else {
              this.savePrepodRozklad();
            }
          }
        }
      ]
    });
    confirm.present();
  }

  saveStudentRozklad(rozklad) {
    // console.log(rozklad);
    localforage.setItem("student", rozklad);
  }

  savePrepodRozklad() {
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

  readSetup() {
    return localforage.getItem('setup')
      .then(result => {
          if (result || result == {}) {
            this.sharedData.globalParams = result;
            console.log('read ****', this.sharedData.globalParams);
          }
        },
        (error) => console.log(error))
  }

}


