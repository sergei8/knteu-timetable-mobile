var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { NavParams } from 'ionic-angular';
import { SharedObjects } from '../../providers/shared-data/shared-data';
import { DataProvider } from '../../providers/data/data';
import { Nav } from 'ionic-angular';
import { RatingComponent } from "../rating/rating";
import { AlertController } from 'ionic-angular';
import * as _ from 'lodash';
var TeacherTtComponent = /** @class */ (function () {
    function TeacherTtComponent(navParams, sharedObjects, data, nav, alert) {
        this.navParams = navParams;
        this.sharedObjects = sharedObjects;
        this.data = data;
        this.nav = nav;
        this.alert = alert;
        this.checkForEmptyDay = TeacherTtComponent_1.checkForEmptyDay;
        this.weekShowSwitch = {}; // скрывают/открывают дни недели
        this.teacher = this.navParams.get('teacher');
        this.wdp = this.navParams.get('wdp');
        this.details = this.navParams.get('details');
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
        for (var i in this.weekNames) {
            this.weekShowSwitch[this.weekNames[i]] = true;
        }
    }
    TeacherTtComponent_1 = TeacherTtComponent;
    /**
     * Выполняется каждый раз при показе экрана
     * вызывает считывание актуального рейта препода
     */
    TeacherTtComponent.prototype.ionViewDidEnter = function () {
        var _this = this;
        // получить текущий рейтинг препода и построить звездочки
        // ВСЕГДА при открытии этого экрана!!!
        this.data.getTeacherRating(this.teacherFullName)
            .then(function (result) {
            // когда фио препода обработалось в getTeacherRating
            if (result) {
                _this.rating = result[0], _this.votedUsers = result[1], _this.showVotes = result[2];
                _this.starsList = _this.data.createStarsList(_this.rating);
            }
            else {
                _this.starsList = [];
            }
            _this.showSpinner = false;
        })
            .catch(function (err) { return console.log(err); });
    };
    /**
     * Проверяет, есть ли на данный день пары у прпода для вывода в расписании
     * @param day
     * @return {boolean}
     */
    TeacherTtComponent.checkForEmptyDay = function (day) {
        var result = _.reduce(day, function (acum, item) { return acum += item.length; }, 0);
        return result > 0;
    };
    // видеть/скрыть дни недели `weekName`
    TeacherTtComponent.prototype.weekClicked = function (weekName, index) {
        this.eyeOffSwitch[index] = !this.eyeOffSwitch[index];
        this.eyeOnSwitch[index] = !this.eyeOnSwitch[index];
        this.weekShowSwitch[weekName] = !this.weekShowSwitch[weekName];
    };
    TeacherTtComponent.prototype.saveTimeTable = function () {
        var rozklad = {
            id: 'teacher',
            teacher: this.teacher,
            wdp: this.wdp
        };
        this.data.saveTimeTable(rozklad);
    };
    /**
     * возвращает url фотки препода
     * @return {string}
     */
    TeacherTtComponent.prototype.getImage = function () {
        if (this.details) {
            // если фотки нету
            if (this.details['img_url'] == null) {
                return '';
            }
            else {
                return this.details['img_url'];
            }
        }
        else {
            // если нету поля `details`
            return '';
        }
    };
    TeacherTtComponent.prototype.getName = function () {
        this.teacherFullName = this.details ? this.details['name'] : '';
        return this.teacherFullName;
    };
    TeacherTtComponent.prototype.getFacultet = function () {
        return this.details ? this.details['fac'] : '';
    };
    TeacherTtComponent.prototype.getDepartment = function () {
        return this.details ? this.details['dep'] : '';
    };
    /**
     * проверяет было ли уже голосование с этого девайса
     * выводит диалог да/нет и вызывает экран голосования
     */
    TeacherTtComponent.prototype.setRatingPage = function () {
        var _this = this;
        // если общий объект teacherRate содержит список рейтингов
        // то делаем обработку
        if (Object.keys(this.sharedObjects.teacherRate).length > 0) {
            var lastRates = this.sharedObjects.teacherRate;
            var deviceId = this.sharedObjects.currentUserDeviceId;
            // проверяем, голосовал ли уже юзер за єтого препода
            if (Object.keys(lastRates).indexOf(deviceId) != -1) {
                //  если голосовал, находим результаты последнего гососования
                var _a = this.data.selectLastRate(lastRates[deviceId]), rate = _a[0], date = _a[1];
                var warningMessage = "\u0412\u0430\u0448\u0430 \u043E\u0446\u0456\u043D\u043A\u0430 \u0437\u0430 " + date.toLocaleDateString() + " \u0431\u0443\u043B\u0430 " + rate + ". \u0411\u0430\u0436\u0430\u0454\u0442\u0435 \u0437\u043C\u0456\u043D\u0438\u0442\u0438 \u0457\u0457?";
                // вывод предупреждения
                var confirm_1 = this.alert.create({
                    subTitle: 'Попередження',
                    message: warningMessage,
                    buttons: [
                        {
                            text: 'Ні ',
                            handler: function () {
                            }
                        },
                        {
                            text: 'Так',
                            handler: function () {
                                _this.showRating().then();
                            }
                        }
                    ]
                });
                confirm_1.present().then();
            }
            else {
                this.showRating().then();
            }
        }
        else {
            // иначе, если общий объект `teacherRate` пустой, то значит рейтингов
            // по этому преподу не было и пееходим на экрай рейтов
            // this.data.addNewTeacher(this.teacherFullName);
            this.showRating().then();
        }
    };
    TeacherTtComponent.prototype.showRating = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.nav.push(RatingComponent, {
                            teacher: this.teacher,
                            details: this.details
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    var TeacherTtComponent_1;
    TeacherTtComponent = TeacherTtComponent_1 = __decorate([
        IonicPage(),
        Component({
            selector: 'teacher-tt',
            templateUrl: 'teacher-tt.html'
        }),
        __metadata("design:paramtypes", [NavParams, SharedObjects,
            DataProvider, Nav,
            AlertController])
    ], TeacherTtComponent);
    return TeacherTtComponent;
}());
export { TeacherTtComponent };
//# sourceMappingURL=teacher-tt.js.map