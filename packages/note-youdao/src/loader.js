// ==UserScript==
// @name         note-youdao-plus
// @namespace    https://github.com/idealism-xxm/tampermonkey/tree/master/note-youdao
// @version      0.0.1
// @icon         https://note.youdao.com/favicon.ico
// @description  有道云笔记加强功能
// @supportURL   https://github.com/idealism-xxm/tampermonkey/tree/master/note-youdao
// @updateURL    https://raw.githubusercontent.com/idealism-xxm/tampermonkey/master/note-youdao/src/loader.js
// @author       idealism-xxm
// @match        https://note.youdao.com/web/
// @grant        none
// @run-at       document-end
// @require      https://raw.githubusercontent.com/madmurphy/cookies.js/master/cookies.min.js
// @require      https://raw.githubusercontent.com/idealism-xxm/tampermonkey/master/note-youdao/src/tool.js
// @require      https://raw.githubusercontent.com/idealism-xxm/tampermonkey/master/note-youdao/src/createDataGetter.js
// @require      https://raw.githubusercontent.com/idealism-xxm/tampermonkey/master/note-youdao/src/api.js
// @require      https://raw.githubusercontent.com/idealism-xxm/tampermonkey/master/note-youdao/src/component.js
// @require      https://raw.githubusercontent.com/idealism-xxm/tampermonkey/master/note-youdao/src/feature.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function(){
        // 初始化 全部自定义功能
        for(var key in feature) {
            feature[key].init();
        }
    }
})();