// ==UserScript==
// @name         teambition-plus
// @namespace    https://github.com/idealism-xxm/tampermonkey/tree/master/packages/teambition
// @version      0.0.2
// @icon         https://www.teambition.com/favicon.ico
// @description  1. 切换迭代时默认取消选中包含子任务 2. 选成员时，支持选择自己
// @supportURL   https://github.com/idealism-xxm/tampermonkey/tree/master/packages/teambition
// @updateURL    https://raw.githubusercontent.com/idealism-xxm/tampermonkey/master/packages/teambition/src/main.js
// @author       idealism-xxm
// @match        https://www.teambition.com/*
// ==/UserScript==

(function() {
    'use strict';

    // 1. 默认取消选中【包含子任务】
    let originalOnclick = document.onclick
    document.onclick = function(e) {
        // 如果原来有事件，则先执行原来的事件
        if (originalOnclick) {
            originalOnclick(e)
        }

        // 如果点击的是
        // 1. 详情页的迭代：sprint-name
        // 2. 列表页的迭代：task-sprint...
        if (typeof(e.target.className) == "string" && (e.target.className == 'sprint-name' || e.target.className.startsWith('task-sprint'))) {
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


    // 2. 成员选项，加上【添加我】
    let addMeHtml = '<div class="item-wrapper add-me"><i class="next-icon next-icon-distribute next-medium"><svg viewBox="0 0 1024 1024"><use xlink:href="#at-distribute"></use></svg></i></div>'
    let MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver
    // 创建 body 观察者对象
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(addedNode) {
                // 如果不是 section 或者 不含 icon-users ，则直接返回
                if((addedNode.tagName != 'SECTION' && addedNode.tagName != 'DIV' || !addedNode.querySelector('span.icon-users'))) {
                    return
                }
                console.log(addedNode)

                // 找到右侧内容，加上【添加我】
                let userContentEle = addedNode.querySelector('div.detail-infos-content > div')
                userContentEle.append($(addMeHtml)[0])
                let addMeEle = userContentEle.querySelector('div.item-wrapper.add-me')

                // 添加点击事件
                addMeEle.onclick = function(e) {
                    // 点击【添加】按钮
                    let addButton = userContentEle.querySelector('div[data-role="add-button-text"') || userContentEle.querySelector('span.icon-circle-plus')
                    addButton.click()
                    // 获取当前登录用户名
                    let tbConfig = document.querySelector('#teambition-config')
                    let currentUserName = JSON.parse(tbConfig.innerText)['user']['name']
                    setTimeout(function() {
                        let inputEle = document.querySelector('body > div.slide-enter-done > div > div > div > div.search-input-wrap > div > input')
                        setInputValue(inputEle, currentUserName)
                    }, 400)
                }
            })
        })
    })
    observer.observe(document.body, {'childList': true, 'subtree': true})

    let setInputValue = function(inputEle, value) {
        // 设置值
        Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(inputEle, value);
        // 触发修改事件
        inputEle.dispatchEvent(new Event('change', {'bubbles': true, 'cancelable': true}))
    }
})();
