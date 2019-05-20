var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { SharedObjects } from '../../providers/shared-data/shared-data';
import { DataProvider } from '../../providers/data/data';
import { FirestoreLogProvider } from '../../providers/firestore-log/firestore-log';
import { Nav } from 'ionic-angular';
import * as _ from 'lodash';
var StudentTtComponent = /** @class */ (function () {
    function StudentTtComponent(navParams, sharedObjects, data, nav, fireStore) {
        this.navParams = navParams;
        this.sharedObjects = sharedObjects;
        this.data = data;
        this.nav = nav;
        this.fireStore = fireStore;
        this.weekShowSwitch = {}; // скрывают/открывают дни недели
        this.wdp = navParams.get('wdp');
        this.facName = navParams.get('facName');
        this.course = navParams.get('course');
        this.group = navParams.get('group');
        this.weekNames = this.sharedObjects.weekNames;
        this.dayNamesList = this.sharedObjects.dayNamesList;
        this.paraNamberList = this.sharedObjects.paraNamberList;
        this.eyeOffSwitch = [true, true];
        this.eyeOnSwitch = [false, false];
        this.showAddButton = this.sharedObjects.globalParams['saveRozklad'];
        // заполним переключатели видимости недель
        for (var i in this.weekNames) {
            this.weekShowSwitch[this.weekNames[i]] = true;
        }
    }
    // если пар нет - сигнализирует не выводить этот день
    StudentTtComponent.prototype.checkForEmptyDay = function (day) {
        var result = _.reduce(day, function (acum, item) { return acum += item.length; }, 0);
        return result > 0;
    };
    // видеть/скрыть дни недели `weekName`
    StudentTtComponent.prototype.weekClicked = function (weekName, index) {
        this.eyeOffSwitch[index] = !this.eyeOffSwitch[index];
        this.eyeOnSwitch[index] = !this.eyeOnSwitch[index];
        this.weekShowSwitch[weekName] = !this.weekShowSwitch[weekName];
    };
    // возвражает количество преподавателей на пару (м.б. 1 или 2)
    StudentTtComponent.prototype.getPrepodsCount = function (week, day, para) {
        return _.range(this.wdp[week][day][para].length);
    };
    /**
     * сохраняет распісаніе в локальном хранилище
     */
    StudentTtComponent.prototype.saveTimeTable = function () {
        var rozklad = {
            id: 'student',
            facName: this.facName,
            course: this.course,
            group: this.group,
            wdp: this.wdp
        };
        this.data.saveTimeTable(rozklad);
    };
    /**
     * Открывает экран преподавателя
     * @param {string} name - имя препода
     * @param {string} discipline - дисциплина, с которой делать переход на препода (для лога)
     */
    StudentTtComponent.prototype.openTeacher = function (name, discipline) {
        var teacherInfo = this.data.getTeacherWdp(name);
        var wdp = teacherInfo[0];
        var teacherDetails = teacherInfo[1];
        this.fireStore.setTeacherPageLog(name, discipline, true).then().catch();
        this.nav.push("TeacherTtComponent", {
            wdp: wdp,
            teacher: name,
            details: teacherDetails
        }).then().catch();
    };
    StudentTtComponent = __decorate([
        IonicPage(),
        Component({
            selector: 'student-tt',
            templateUrl: 'student-tt.html'
        }),
        __metadata("design:paramtypes", [NavParams, SharedObjects,
            DataProvider, Nav, FirestoreLogProvider])
    ], StudentTtComponent);
    return StudentTtComponent;
}());
export { StudentTtComponent };
//# sourceMappingURL=student-tt.js.map