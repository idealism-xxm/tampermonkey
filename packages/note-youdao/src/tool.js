/**
 * 工具
 *
 * @type {{prefix: string, dict: string, getCstk: tool.getCstk, getUUID: tool.getUUID, getUrl: tool.getUrl}}
 */
var tool = {
    // api 链接 前缀
    prefix: '//note.youdao.com',

    // 生成 uuid 可用的字符
    dict: "0123456789abcdefghijklmnopqrstuvwxyz",

    // 从 cooike 中获取 cstk
    getCstk: function() {
        return docCookies.getItem('YNOTE_CSTK')
    },

    // 生成 UUID，前缀为 prefix，随机长度为 length 位
    getUUID: function (prefix, length) {
        var uuid = prefix;

        for(var i = 0; i < length; ++i) {
            uuid += this.dict[Math.floor(Math.random() * this.dict.length)];
        }

        return uuid;
    },

    // 生成 url
    getUrl: function (suffix) {
        return this.prefix + suffix;
    },

    // 触发事件
    trigger: function (selector, eventName) {
        // 初始化事件
        var event = document.createEvent('Event');
        event.initEvent(eventName, true, true);

        // 触发事件
        document.querySelector(selector).dispatchEvent(event);
    },
};