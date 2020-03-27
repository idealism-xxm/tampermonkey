// ==UserScript==
// @name         teambition-plus
// @namespace    https://github.com/idealism-xxm/tampermonkey/tree/master/teambition
// @version      0.0.1
// @icon         https://www.teambition.com/favicon.ico
// @description  切换迭代时默认取消选中包含子任务
// @supportURL   https://github.com/idealism-xxm/tampermonkey/tree/master/teambition
// @updateURL    https://raw.githubusercontent.com/idealism-xxm/tampermonkey/master/teambition/src/main.js
// @author       idealism-xxm
// @match        https://www.teambition.com/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let originalOnclick = document.onclick
    document.onclick = function(e) {
        // 如果原来有事件，则先执行原来的事件
        if (originalOnclick) {
            originalOnclick(e)
        }

        // 如果点击的是 sprint-name
        if (e.target.className == 'sprint-name') {
            setTimeout(function() {
                let checkbox = $('.checkbox-with-subtask').prev()
                let input = checkbox.find('input')
                // 如果已选中包含子任务，则需要取消选中
                if (input && input.val() == 'on') {
                    checkbox.click()
                }
            }, 200)
        }
    }
})();
