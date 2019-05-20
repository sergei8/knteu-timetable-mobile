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
import { Stitch, RemoteMongoClient, AnonymousCredential, } from 'mongodb-stitch-browser-sdk';
var MongodbStitchProvider = /** @class */ (function () {
    function MongodbStitchProvider() {
    }
    /**
     *  Инициализация stitch-клиента (выполняется 1 раз при входе)
     * @return {boolean} true - успешно, false - нет
     */
    MongodbStitchProvider.prototype.initClients = function () {
        try {
            // this.client = Stitch.initializeDefaultAppClient(appId);
            this.clientRatings = Stitch.initializeAppClient('rating-kvicy');
            this.dbRatings = this.clientRatings.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('ratings');
            // this.client = Stitch.initializeDefaultAppClient(appId);
            this.clientNews = Stitch.initializeAppClient('knteu-news-psqjs');
            this.dbNews = this.clientNews.getServiceClient(RemoteMongoClient.factory, 'mongodb-atlas').db('knteu-news');
        }
        catch (e) {
            console.log(e);
            return false;
        }
        return true;
    };
    /**
     * Ищет в коллекции `teachers`список рейтиногов для имя препода
     * если препода нету, возвращает пустой обїект
     * @param teacherName - имя препода
     * @return {Promise<number>} - массив с рейтингами
     */
    MongodbStitchProvider.prototype.getTeacherRatingsList = function (teacherName) {
        var _this = this;
        return new Promise((function (resolve) {
            _this.clientRatings.auth.loginWithCredential(new AnonymousCredential())
                .then(function () { return _this.dbRatings.collection('teachers')
                .find({ "name": teacherName }).asArray(); })
                .then(function (docs) {
                resolve(docs);
            })
                .catch(function (error) { return console.log('Error getTeacherRatingsList', error); });
        }));
    };
    /**
     * перезаписывает досумент препода новыми рейтингами или создает новый док-т, если препода нет в БД
     * @param {object} rateList - объект с рейтингами препода
     * @param {string} name - имя препода
     * @return {Promise<any>}
     */
    MongodbStitchProvider.prototype.writeTeacherDoc = function (rateList, name) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.clientRatings.auth.loginWithCredential(new AnonymousCredential())
                .then(function () { return _this.dbRatings.collection('teachers')
                .updateOne({ name: name }, { $set: { rateList: rateList } }, { upsert: true }); })
                .catch(function (error) { return console.log('writeTeacherDoc', error); });
            resolve();
        });
    };
    /**
     * вибирает из БД новостей все новости
     * @return {Promise<any>} - массив документов-новостей,
     * без поля `details` и `blog_urk`, сортированый обратно порядку записи
     */
    MongodbStitchProvider.prototype.getShortNewsList = function () {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            "projection": { "details": 0 },
                            "sort": { "$natural": -1 }
                        };
                        return [4 /*yield*/, this.clientNews.auth.loginWithCredential(new AnonymousCredential())
                                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.dbNews.collection('news-list')
                                                .find({}, options).asArray()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * извлекает из БД `news-list` детали новости
     * @param {string} newsId - id новостного док-та
     * @return {Promise<Array<Object>>}
     */
    MongodbStitchProvider.prototype.getDetails = function (newsId) {
        return __awaiter(this, void 0, void 0, function () {
            var options;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        options = {
                            "projection": { "details": 1, "_id": 0 }
                        };
                        return [4 /*yield*/, this.clientNews.auth.loginWithCredential(new AnonymousCredential())
                                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.dbNews.collection('news-list')
                                                .find({ "_id": newsId }, options).asArray()];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * обновляет поле `votes` после голосования
     * @param {Object} news - новость, для которой было голосование
     * @return {Promise<any>} - делается асинхронно
     */
    MongodbStitchProvider.prototype.storeNewsVote = function (news) {
        return __awaiter(this, void 0, void 0, function () {
            var query, update;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        query = { _id: news['_id'] };
                        update = {
                            $set: {
                                votes: news['votes']
                            }
                        };
                        return [4 /*yield*/, this.clientNews.auth.loginWithCredential(new AnonymousCredential())
                                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.dbNews.collection('news-list')
                                                .updateOne(query, update).catch(function (e) { return console.log(e); })];
                                        case 1: return [2 /*return*/, _a.sent()];
                                    }
                                });
                            }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * обновляет поле `views` (просмотры) для новости с newsID
     * @param {string} newsId - id новости
     * @param {Array<string>} views - массив, содержащий id устр-в юзеров
     * @return {Promise<any>} - асинхронное обещание
     */
    MongodbStitchProvider.prototype.storeViews = function (newsId, views) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.clientNews.auth.loginWithCredential(new AnonymousCredential())
                            .then(function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, this.dbNews.collection('news-list')
                                            .updateOne({ _id: newsId }, { $set: { views: views } })
                                            .catch(function (e) { return console.log(e); })];
                                    case 1: return [2 /*return*/, _a.sent()];
                                }
                            });
                        }); })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    MongodbStitchProvider = __decorate([
        Injectable({
            providedIn: 'root'
        }),
        __metadata("design:paramtypes", [])
    ], MongodbStitchProvider);
    return MongodbStitchProvider;
}());
export { MongodbStitchProvider };
//# sourceMappingURL=mongodb-stitch.js.map