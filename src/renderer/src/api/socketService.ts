export interface TsocketInstance {
    connect : (url?:string) => void,
    registerCallBack : (alia:string, callback) => void,
    unRegisterCallBack : (alia:string) => void,
    send : (alia:any) => void,
}

const wsURL = `ws://localhost:8888/`;

export default class SocketService {
    //socket 单例
    static instance:TsocketInstance;
    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService();
        }
        return this.instance;
    }

    //建立连接的socket对象
    ws;

    //存储回调函数
    callBackMap = new Map();

    //连接状态标识
    connected = false;

    //记录重试次数
    sendRetryCount = 0;

    //重新尝试连接次数
    connectRetryCount = 0;

    //连接方法
    connect(url?:string) {
        url = url || wsURL
        if (!window.WebSocket) {
            console.log("您的浏览器不支持WebSocket");
            return;
        }

        this.ws = new WebSocket(wsURL);
        this.ws.onopen = () => {
            console.log("ws 连接服务器成功!");
            this.connected = true;
            this.connectRetryCount = 0;
        };

        this.ws.onclose = () => {
            console.log("ws 连接服务器失败!");
            this.connected = false;
            this.connectRetryCount++;
            setTimeout(() => {
                this.connect();
            }, 500 * this.connectRetryCount);
        };

        this.ws.onmessage = (msg) => {
            // console.log("从服务端获取到了数据", msg);
            this.callBackMap.forEach((callback, index) => {
                callback.call(this, msg);
            });
        };
    }

    /**
     * 注册回调函数
     * @param {*} alia 别名
     * @param {*} callback 回调
     */
    registerCallBack(alia, callback) {
        this.callBackMap.set(alia, callback);
    }

    /**
     * 取消注册回调函数
     * @param {*} alia 别名
     * @param {*} callback 回调
     */
    unRegisterCallBack(alia) {
        this.callBackMap.delete(alia);
    }

    send(data) {
        if (this.connected) {
            this.sendRetryCount = 0;
            this.ws.send(data);
        } else {
            this.sendRetryCount++;
            setTimeout(() => {
                this.send(data);
            }, 500 * this.sendRetryCount);
        }
    }
}
