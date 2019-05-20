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
import { Nav } from 'ionic-angular';
import { FirestoreLogProvider } from '../../providers/firestore-log/firestore-log';
import * as _ from 'lodash';
import * as $ from 'jquery';
var StudentComponent = /** @class */ (function () {
    function StudentComponent(nav, sharedObjects, data, fireStore) {
        this.nav = nav;
        this.sharedObjects = sharedObjects;
        this.data = data;
        this.fireStore = fireStore;
        this.facNameList = [];
        this.courseList = [];
        this.groupList = [];
        this.allTimeTable = {}; //   сюда передается общее расписание
        this.allTimeTable = this.sharedObjects.allTimeTable;
        if (!this.sharedObjects.isConnected) {
            this.data.showToastMessage(' Нема доступу до розкладу в мережі!', 'bottom', 'warningToast', true, 0);
        }
        this.facNameList = this.data.getFacNameList();
        this.groupList = [];
    }
    StudentComponent.prototype.getCourseList = function () {
        var _this = this;
        var courseNamberList = [];
        _.each(this.allTimeTable, function (fio) {
            return _.forEach(_this.sharedObjects.weekNames.map(function (x) { return fio[x]; }), function (week) {
                return _.each(week, function (day) {
                    return _.each(day, function (para) {
                        var facName = para[0];
                        var courseNumber = para[1];
                        if ((facName == _this.selectedFacName) && !(_.includes(courseNamberList, courseNumber))) {
                            courseNamberList.push(courseNumber);
                        }
                    });
                });
            });
        });
        this.courseList = courseNamberList.sort();
        this.groupList = [];
    };
    StudentComponent.prototype.getGroupList = function () {
        var _this = this;
        var groupNumberList = [];
        _.each(this.allTimeTable, function (fio) {
            return _.forEach(_this.sharedObjects.weekNames.map(function (x) { return fio[x]; }), function (week) {
                return _.each(week, function (day) {
                    return _.each(day, function (para) {
                        var facName = para[0];
                        var courseNumber = para[1];
                        var groupNumber = _this.extractGroupNumber(para[2]);
                        if ((facName == _this.selectedFacName)
                            && (courseNumber == _this.selectedCourse)
                            && !(_.includes(groupNumberList, groupNumber))) {
                            groupNumberList.push(groupNumber);
                        }
                    });
                });
            });
        });
        this.groupList = groupNumberList.sort();
    };
    // извлекает из параметра первую группу, если на лекции их несколько
    // '1,2,3,4' - выберет 1-ю группу
    StudentComponent.prototype.extractGroupNumber = function (groupsString) {
        return groupsString.split(',')[0];
    };
    StudentComponent.prototype.okClicked = function () {
        var _this = this;
        this.wdp = $.extend(true, {}, this.sharedObjects.WeekDayPara); //  очищаем расписание группы
        _.each(this.allTimeTable, function (fio, teacherName) {
            return _.each(fio, function (week, weekName) {
                return _.each(week, function (day, dayName) {
                    return _.each(day, function (para, paraNumber) {
                        if (_this.selectedFacName === para[0]
                            && _this.selectedCourse === para[1]
                            && para[2].split(',').indexOf(_this.selectedGruppa) !== -1) {
                            if (_this.wdp[weekName][dayName][paraNumber].length !== 0) {
                                _this.wdp[weekName][dayName][paraNumber] = _this.wdp[weekName][dayName][paraNumber]
                                    .concat([[para[5], para[3], para[4], teacherName]]);
                            }
                            else {
                                _this.wdp[weekName][dayName][paraNumber] = [[].concat(para[5], para[3], para[4], teacherName)];
                            }
                        }
                    });
                });
            });
        });
        this.fireStore.setStudentPageLog(this.selectedFacName, this.selectedCourse, this.selectedGruppa).then();
        this.nav.push('StudentTtComponent', {
            wdp: this.wdp,
            facName: this.selectedFacName,
            course: this.selectedCourse,
            group: this.selectedGruppa
        });
    };
    StudentComponent = __decorate([
        Component({
            selector: 'student',
            templateUrl: 'student.html'
        }),
        __metadata("design:paramtypes", [Nav, SharedObjects,
            DataProvider,
            FirestoreLogProvider])
    ], StudentComponent);
    return StudentComponent;
}());
export { StudentComponent };
//# sourceMappingURL=student.js.map