import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import {Observable} from "rxjs/Observable";
import {AlertController} from 'ionic-angular';

declare const require: any;
const localforage: LocalForage = require("localforage");

@Injectable()
export class DataProvider {

  askForSaveSwitch: boolean;

  constructor(public http: Http, private alert: AlertController) {
  }

  getFile(url): Observable<Object> {
    return this.http.get(url)
      .map(response => response.json());
  }

  saveTimeTable(type, wdp) {
    console.log(type, wdp);
    this.askForSaveSwitch = false;
    this.askForSave();

  }

  askForSave() {
    let confirm = this.alert.create({
      title: 'Збереження розкладу',
      message: 'Ви бажаєте зберегти цей розклад у локальне сховище Вашого пристрою?',
      buttons: [
        {
          text: 'Ні',
          handler: () => {
            this.askForSaveSwitch = false;
          }
        },
        {
          text: 'Так',
          handler: () => {
            this.askForSaveSwitch = true;
            this.saveOk();
          }
        }
      ]
    });
    confirm.present();
  }

  saveOk() {
    console.log(this.askForSaveSwitch);

  }

}

