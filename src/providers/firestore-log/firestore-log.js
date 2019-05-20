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
import { Injectable } from '@angular/core';
import { Device } from '@ionic-native/device';
import { AngularFirestore } from 'angularfire2/firestore';
// import {Geolocation} from '@ionic-native/geolocation';
import { NetworkInterface } from '@ionic-native/network-interface';
import { SharedObjects } from '../shared-data/shared-data';
var FirestoreLogProvider = /** @class */ (function () {
    function FirestoreLogProvider(fireStore, device, networkInterface, sharedObjects) {
        this.fireStore = fireStore;
        this.device = device;
        this.networkInterface = networkInterface;
        this.sharedObjects = sharedObjects;
    }
    FirestoreLogProvider.prototype.setHomePageLog = function () {
        return __awaiter(this, void 0, void 0, function () {
            var path, homeDoc, userIpAddr, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = "Home/" + Date.now();
                        homeDoc = this.fireStore.doc(path);
                        userIpAddr = { ip: null };
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.networkInterface.getCarrierIPAddress()];
                    case 2:
                        userIpAddr = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        return [3 /*break*/, 4];
                    case 4: return [4 /*yield*/, homeDoc.set({
                            userDeviceId: this.sharedObjects.currentUserDeviceId,
                            userDeviceModel: this.device.model,
                            userDevicePlatform: this.device.platform,
                            userOsVersion: this.device.version,
                            userDeviceManufacturer: this.device.manufacturer,
                            userIp: userIpAddr.ip,
                        }).then().catch()];
                    case 5:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FirestoreLogProvider.prototype.setStudentPageLog = function (faculty, course, group, saved) {
        if (saved === void 0) { saved = false; }
        return __awaiter(this, void 0, void 0, function () {
            var path, studentDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = "Student/" + Date.now();
                        studentDoc = this.fireStore.doc(path);
                        return [4 /*yield*/, studentDoc.set({
                                userDeviceId: this.device.uuid,
                                faculty: faculty,
                                course: course,
                                group: group,
                                saved: saved
                            }).then().catch()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FirestoreLogProvider.prototype.setTeacherPageLog = function (teacherName, fromDiscipline, saved) {
        if (fromDiscipline === void 0) { fromDiscipline = null; }
        if (saved === void 0) { saved = false; }
        return __awaiter(this, void 0, void 0, function () {
            var path, teacherDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = "Teacher/" + Date.now();
                        teacherDoc = this.fireStore.doc(path);
                        return [4 /*yield*/, teacherDoc.set({
                                userDeviceId: this.device.uuid,
                                name: teacherName,
                                fromDiscipline: fromDiscipline,
                                saved: saved
                            }).then().catch()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FirestoreLogProvider.prototype.setRatingPageLog = function (teacherName, action) {
        if (action === void 0) { action = 'view'; }
        return __awaiter(this, void 0, void 0, function () {
            var path, ratingDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = "Rating/" + Date.now();
                        ratingDoc = this.fireStore.doc(path);
                        return [4 /*yield*/, ratingDoc.set({
                                userDeviceId: this.device.uuid,
                                teacherName: teacherName,
                                action: action
                            }).then().catch()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FirestoreLogProvider.prototype.setNewsPageLog = function () {
        return __awaiter(this, void 0, void 0, function () {
            var path, newsDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = "News/" + Date.now();
                        newsDoc = this.fireStore.doc(path);
                        return [4 /*yield*/, newsDoc.set({
                                userDeviceId: this.device.uuid,
                            }).then().catch()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    FirestoreLogProvider.prototype.setNewsDetailsPageLog = function (newsId) {
        return __awaiter(this, void 0, void 0, function () {
            var path, newsDoc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        path = "News-details/" + Date.now();
                        newsDoc = this.fireStore.doc(path);
                        return [4 /*yield*/, newsDoc.set({
                                userDeviceId: this.device.uuid,
                                newsId: newsId
                            }).then().catch()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    var _a, _b;
    FirestoreLogProvider = __decorate([
        Injectable(),
        __metadata("design:paramtypes", [AngularFirestore, typeof (_a = typeof Device !== "undefined" && Device) === "function" ? _a : Object, typeof (_b = typeof NetworkInterface !== "undefined" && NetworkInterface) === "function" ? _b : Object, SharedObjects])
    ], FirestoreLogProvider);
    return FirestoreLogProvider;
}());
export { FirestoreLogProvider };
//# sourceMappingURL=firestore-log.js.map