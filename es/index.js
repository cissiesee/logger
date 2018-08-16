"use strict";

var _assign = require("babel-runtime/core-js/object/assign");

var _assign2 = _interopRequireDefault(_assign);

var _promise = require("babel-runtime/core-js/promise");

var _promise2 = _interopRequireDefault(_promise);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

Object.defineProperty(exports, "__esModule", { value: true });
var lk_http_request_1 = require("lk-http-request");
var defaultOpts = {
    logUrl: "./command/hall/log/print",
    logLevel: -1,
    host: ""
};
var levelMap = [{ code: 0, text: "close" }, { code: 1, text: "primary" }, { code: 2, text: "major" }, { code: 3, text: "normal" }, { code: 4, text: "minor" }];
/**
 * 获取log开启level
 */
function getShowLogLevel() {
    return new _promise2.default(function (resolve, reject) {
        if (defaultOpts.logLevel !== -1) {
            resolve(defaultOpts.logLevel);
        } else {
            var level = sessionStorage.getItem("loglevel");
            if (level) {
                defaultOpts.logLevel = parseInt(level, 10);
                resolve(defaultOpts.logLevel);
            } else {
                reject();
            }
        }
    });
}
/**
 * 获取日志内容
 * @param data
 */
function _getLogData(data) {
    return new _promise2.default(function (resolve, reject) {
        getShowLogLevel().then(function (showLevel) {
            var levelInfo = levelMap.find(function (item) {
                return item.text === data.level;
            });
            var isRequestLog = levelInfo.code > showLevel ? false : true;
            var defaults = {
                level: data.level,
                time: new Date().getTime(),
                fundid: sessionStorage.getItem("fundid")
            };
            var newItem = (0, _assign2.default)({}, defaults, data);
            var content = {
                level: newItem.level,
                id: defaultOpts.id,
                info: "client time: " + newItem.time + ", fileName: " + newItem.fileName + ", fundid: " + newItem.fundid + ", info: " + newItem.info
            };
            resolve({
                requestLog: isRequestLog,
                log: content
            });
        }, function () {
            reject();
        });
    });
}
function requestLog(data) {
    return new _promise2.default(function (resolve, reject) {
        _getLogData(data).then(function (sendData) {
            if (!sendData.requestLog) {
                console.log("log:", sendData.log);
                return;
            }
            lk_http_request_1.default(defaultOpts.host + defaultOpts.logUrl, {
                type: "post",
                data: { log: sendData.log }
            }).then(function () {
                resolve();
            }).catch(function (err) {
                reject(err);
            });
        });
    });
}
exports.default = {
    config: function config(opts) {
        (0, _assign2.default)(defaultOpts, opts);
    },
    getLogger: function getLogger(fileName) {
        return {
            getLogData: function getLogData(level, info) {
                return _getLogData({
                    level: level,
                    fileName: fileName,
                    info: info
                });
            },
            primary: function primary(info) {
                return requestLog({
                    level: "primary",
                    fileName: fileName,
                    info: info
                });
            },
            major: function major(info) {
                return requestLog({
                    level: "major",
                    fileName: fileName,
                    info: info
                });
            },
            normal: function normal(info) {
                return requestLog({
                    level: "normal",
                    fileName: fileName,
                    info: info
                });
            },
            minor: function minor(info) {
                return requestLog({
                    level: "minor",
                    fileName: fileName,
                    info: info
                });
            }
        };
    }
};
//# sourceMappingURL=index.js.map