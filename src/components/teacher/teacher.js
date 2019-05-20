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
import { SharedObjects } from '../../providers/shared-data/shared-data';
import { DataProvider } from '../../providers/data/data';
import { FirestoreLogProvider } from '../../providers/firestore-log/firestore-log';
import { Nav } from 'ionic-angular';
// import {TeacherTtComponent} from '../teacher-tt/teacher-tt';
import * as _ from 'lodash';
var TeacherComponent = /** @class */ (function () {
    function TeacherComponent(nav, sharedObjects, data, fireStore) {
        this.nav = nav;
        this.sharedObjects = sharedObjects;
        this.data = data;
        this.fireStore = fireStore;
        this.allTimeTable = {}; //   сюда передается общее расписание
        if (!this.sharedObjects.isConnected) {
            this.data.showToastMessage('Нема доступу до розкладу в мережі!', 'bottom', 'warningToast', true, 3000);
        }
        this.selectedFacName = null;
        this.selectedDepName = null;
        this.teachers = [];
        this.allTimeTable = this.sharedObjects.allTimeTable;
        this.facNameList = data.getFacDepNameList()['fac'];
        this.depNameList = data.getFacDepNameList()['dep'];
    }
    TeacherComponent.prototype.getTeacher = function (ev) {
        // построіть сортірований почіщенний спісок преподов
        var rgx = new RegExp('^(ас )|^(проф )|^(вик )|^(доц )|^(ст в )');
        var fullList = _.filter(Object.keys(this.allTimeTable).sort(), function (x) { return rgx.exec(x); });
        // получить вводиое поисковое значеие
        var input = ev.target.value;
        if (!input) {
            this.teachers = [];
            return;
        }
        //  начиная с 2-й введенной буквы фильтруем полный список по этим вхождениям
        if (input.trim().length >= 2) {
            this.teachers = fullList.filter(function (item) { return item.toLowerCase().indexOf(input.toLowerCase()) > -1; });
        }
        else {
            this.teachers = [];
        }
    };
    TeacherComponent.prototype.selectedTeacher = function (teacher) {
        var teacherInfo = this.data.getTeacherWdp(teacher);
        this.wdp = teacherInfo[0];
        this.teacherDetails = teacherInfo[1];
        // логировать если разрешено
        if (!this.sharedObjects.stopLogging) {
            this.fireStore.setTeacherPageLog(teacher).then().catch();
        }
        this.nav.push('TeacherTtComponent', {
            wdp: this.wdp,
            teacher: teacher,
            details: this.teacherDetails
        }).then().catch();
    };
    /**
     * выбирает кафедры для конкретного фак-та
     * @param {string} facName - название фак-та
     */
    TeacherComponent.prototype.getDepsByFac = function () {
        this.depNameList = [];
        this.depNameList = this.data.getFacDepNameList(this.selectedFacName)['dep'];
    };
    /**
     * строит список преподавателей по выбранной в меню кафедре
     */
    TeacherComponent.prototype.getDepTeachers = function () {
        var _this = this;
        this.teachers = [];
        _.forEach(this.allTimeTable, function (x, fio) {
            if (x.details) {
                if (x.details.dep === _this.selectedDepName) {
                    _this.teachers.push(fio);
                }
            }
        });
    };
    /**
     * строит список преподов для выбранного в меню факультета
     */
    TeacherComponent.prototype.getFacTeachers = function () {
        var _this = this;
        this.teachers = [];
        _.forEach(this.allTimeTable, function (x, fio) {
            if (x.details) {
                if (x.details.fac === _this.selectedFacName) {
                    _this.teachers.push(fio);
                }
            }
        });
    };
    /**
     * вызывает построитель списка преподов для кафедры, если не выбрано,
     * то для факультета
     */
    TeacherComponent.prototype.okClicked = function () {
        if (this.selectedDepName) {
            this.getDepTeachers();
        }
        else {
            this.getFacTeachers();
        }
    };
    TeacherComponent = __decorate([
        Component({
            selector: 'teacher',
            templateUrl: 'teacher.html'
        }),
        __metadata("design:paramtypes", [Nav,
            SharedObjects,
            DataProvider,
            FirestoreLogProvider])
    ], TeacherComponent);
    return TeacherComponent;
}());
export { TeacherComponent };
//# sourceMappingURL=teacher.js.map