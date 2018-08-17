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
    id?: string;
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
            const level = sessionStorage.getItem("loglevel");
            if (level) {
                defaultOpts.logLevel = parseInt(level, 10);
                resolve(defaultOpts.logLevel);
            } else {
                reject();
            }
        }
    });
}

interface ILogDataReq { level: string; fileName: string; info: string; }
interface ILogDataRes { requestLog: boolean; log: any; }

/**
 * 获取日志内容
 * @param data
 */
function getLogData(data: ILogDataReq): Promise<ILogDataRes> {
    return new Promise((resolve, reject) => {
        const levelInfo = levelMap.find(item => item.text === data.level);
        const defaults = {
            level: data.level,
            time: (new Date()).getTime(),
            fundid: sessionStorage.getItem("fundid")
        };
        const newItem = Object.assign({}, defaults, data);
        const content = {
            level: newItem.level,
            id: defaultOpts.id,
            info: `client time: ${newItem.time}, fileName: ${newItem.fileName}, fundid: ${newItem.fundid}, info: ${newItem.info}`
        };
        getShowLogLevel().then((showLevel: number) => {
            const isRequestLog = levelInfo.code > showLevel ? false : true;
            resolve({
                requestLog: isRequestLog,
                log: content
            });
        }, () => {
            reject();
        });
    });
}

function requestLog(data: ILogDataReq) {
    return new Promise((resolve, reject) => {
        getLogData(data).then((sendData) => {
            if (!sendData.requestLog) {
                console.log("log:", sendData.log);
                return;
            }
            httpRequest(defaultOpts.host + defaultOpts.logUrl, {
                type: "post",
                data: { log: sendData.log }
            })
                .then(() => {
                    resolve();
                })
                .catch((err: any) => {
                    reject(err);
                });
        }, () => {
            console.log("get loglevel fail");
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
                return requestLog({
                    level: "primary",
                    fileName,
                    info
                });
            },
            major(info: string) {
                return requestLog({
                    level: "major",
                    fileName,
                    info
                });
            },
            normal(info: string) {
                return requestLog({
                    level: "normal",
                    fileName,
                    info
                });
            },
            minor(info: string) {
                return requestLog({
                    level: "minor",
                    fileName,
                    info
                });
            }
        };
    }
};