"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lk_http_request_1 = require("lk-http-request");
var defaultOpts = {
    logUrl: "./command/hall/log/print",
    logLevel: -1,
    host: ""
};
var levelMap = [
    { code: 0, text: "close" },
    { code: 1, text: "primary" },
    { code: 2, text: "major" },
    { code: 3, text: "normal" },
    { code: 4, text: "minor" }
];
/**
 * 获取log开启level
 */
function getShowLogLevel() {
    return new Promise(function (resolve, reject) {
        if (defaultOpts.logLevel !== -1) {
            resolve(defaultOpts.logLevel);
        }
        else {
            lk_http_request_1.default(defaultOpts.host + "./resource/symbols/getProperty", {
                type: "post",
                data: {
                    key: "eagle.app.loglevel"
                }
            }).then(function (level) {
                defaultOpts.logLevel = parseInt(level, 10);
                resolve(defaultOpts.logLevel);
            }, function () {
                reject();
            });
        }
    });
}
/**
 * 获取日志内容
 * @param data
 */
function getLogData(data) {
    return new Promise(function (resolve, reject) {
        getShowLogLevel().then(function (showLevel) {
            var levelInfo = levelMap.find(function (item) { return item.text === data.level; });
            var isRequestLog = levelInfo.code > showLevel ? false : true;
            var defaults = {
                level: data.level,
                time: (new Date()).getTime(),
                custname: sessionStorage.getItem("custname"),
                fundid: sessionStorage.getItem("fundid")
            };
            var contents = (Array.isArray(data) ? data : [data]).map(function (item) {
                var newItem = Object.assign({}, defaults, item);
                return {
                    level: newItem.level,
                    info: "client time: " + newItem.time + ", fileName: " + newItem.fileName + ", custname: " + newItem.custname + ", fundid: " + newItem.fundid + ", info: " + newItem.info
                };
            });
            resolve({
                requestLog: isRequestLog,
                logs: contents
            });
        }, function () {
            reject();
        });
    });
}
function requestLog(data) {
    getLogData(data).then(function (sendData) {
        if (!sendData.requestLog) {
            console.log("log:", sendData.logs);
            return;
        }
        lk_http_request_1.default(defaultOpts.host + defaultOpts.logUrl, {
            type: "post",
            data: { logs: sendData.logs }
        });
    });
}
exports.default = {
    config: function (opts) {
        Object.assign(defaultOpts, opts);
    },
    getLogger: function (fileName) {
        return {
            getLogData: function (level, info) {
                return getLogData({
                    level: level,
                    fileName: fileName,
                    info: info
                });
            },
            primary: function (info) {
                requestLog({
                    level: "primary",
                    fileName: fileName,
                    info: info
                });
            },
            major: function (info) {
                requestLog({
                    level: "major",
                    fileName: fileName,
                    info: info
                });
            },
            normal: function (info) {
                requestLog({
                    level: "normal",
                    fileName: fileName,
                    info: info
                });
            },
            minor: function (info) {
                requestLog({
                    level: "minor",
                    fileName: fileName,
                    info: info
                });
            }
        };
    }
};
//# sourceMappingURL=index.js.map