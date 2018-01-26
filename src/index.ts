"use strict";

import httpRequest from "lk-http-request";
// import _second from "./second";
// export { _second as second };
// import _third from "./third";
// export { _third as Third };

interface ILogConfig {
    logUrl: string;
    logLevel: number;
    host: string;
}
const defaultOpts: ILogConfig = {
    logUrl: "./command/hall/log/print",
    logLevel: -1,
    host: ""
};
const levelMap = [
    { code: 0, text: "close" },
    { code: 1, text: "primary" },
    { code: 2, text: "major" },
    { code: 3, text: "normal" },
    { code: 4, text: "minor" }
];

/**
 * 获取log开启level
 */
function getShowLogLevel(): Promise<number> {
    return new Promise((resolve, reject) => {
        if (defaultOpts.logLevel !== -1) {
            resolve(defaultOpts.logLevel);
        } else {
            httpRequest(defaultOpts.host + "./resource/symbols/getProperty", {
                type: "post",
                data: {
                    key: "eagle.app.loglevel"
                }
            }).then((level: string) => {
                defaultOpts.logLevel = parseInt(level, 10);
                resolve(defaultOpts.logLevel);
            }, () => {
                reject();
            });
        }
    });
}

interface ILogDataReq { level: string; fileName: string; info: string; }
interface ILogDataRes { requestLog: boolean; logs: any[]; }

/**
 * 获取日志内容
 * @param data
 */
function getLogData(data: ILogDataReq): Promise<ILogDataRes> {
    return new Promise((resolve, reject) => {
        getShowLogLevel().then((showLevel: number) => {
            const levelInfo = levelMap.find(item => item.text === data.level);
            const isRequestLog = levelInfo.code > showLevel ? false : true;
            const defaults = {
                level: data.level,
                time: (new Date()).getTime(),
                custname: sessionStorage.getItem("custname"),
                fundid: sessionStorage.getItem("fundid")
            };
            const contents = (Array.isArray(data) ? data : [data]).map((item) => {
                const newItem = Object.assign({}, defaults, item);
                return {
                    level: newItem.level,
                    info: `client time: ${newItem.time}, fileName: ${newItem.fileName}, custname: ${newItem.custname}, fundid: ${newItem.fundid}, info: ${newItem.info}`
                };
            });
            resolve({
                requestLog: isRequestLog,
                logs: contents
            });
        }, () => {
            reject();
        });
    });
}

function requestLog(data: ILogDataReq) {
    getLogData(data).then((sendData) => {
        if (!sendData.requestLog) {
            console.log("log:", sendData.logs);
            return;
        }
        httpRequest(defaultOpts.host + defaultOpts.logUrl, {
            type: "post",
            data: { logs: sendData.logs }
        });
    });
}

export default {
    config(opts: ILogConfig) {
        Object.assign(defaultOpts, opts);
    },
    getLogger(fileName: string) {
        return {
            getLogData(level: string, info: string) {
                return getLogData({
                    level,
                    fileName,
                    info
                });
            },
            primary(info: string) {
                requestLog({
                    level: "primary",
                    fileName,
                    info
                });
            },
            major(info: string) {
                requestLog({
                    level: "major",
                    fileName,
                    info
                });
            },
            normal(info: string) {
                requestLog({
                    level: "normal",
                    fileName,
                    info
                });
            },
            minor(info: string) {
                requestLog({
                    level: "minor",
                    fileName,
                    info
                });
            }
        };
    }
};