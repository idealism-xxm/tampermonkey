// ==UserScript==
// @name         thoughts-plus
// @namespace    https://github.com/idealism-xxm/tampermonkey/tree/master/thoughts
// @version      0.0.1
// @icon         https://g.alicdn.com/thoughts/thoughts-front/server/favicon.7d745459.png
// @description  支持在页面中直接复制链接
// @supportURL   https://github.com/idealism-xxm/tampermonkey/tree/master/thoughts
// @updateURL    https://raw.githubusercontent.com/idealism-xxm/tampermonkey/master/thoughts/src/main.js
// @author       idealism-xxm
// @match        https://thoughts.teambition.com/*
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let trim = function (text, firstCh, sufCh) {
        return text.substr(text.indexOf(firstCh), text.lastIndexOf(sufCh))
    }

    let copyText = function (text) {
        document.body.blur()
        document.body.focus()
        navigator.clipboard.writeText(text)
            .then(() => { console.log(`Copied: ${text}`) })
            .catch((error) => { console.error(`Copy failed! ${error}`) })
    }


    let relationNodes = []

    // 收集关联节点
    let collectRelationNodes = function (xhr) {
        let urlReg = /^https:\/\/thoughts-edit\.teambition\.com\/edit\/\?clientId=.*&source=thoughts&_userId=.*&_documentId=.*&_workspaceId=.*&EIO=3&transport=polling&t=.*&sid=.*$/
        // 非当前函数处理的 url ，则直接返回
        if (!urlReg.test(xhr.responseURL)) {
            return
        }

        // 长度不够，则是其他前置操作
        if (xhr.getResponseHeader('content-length') < 10) {
            return
        }

        let document = JSON.parse(trim(xhr.responseText, '[', ']'))[1].data.response.document
        let dfs = function(root, sectionKey) {
            // 目前发现只有 text 是叶子节点，所以直接返回即可
            if (['text'].includes(root.object)) {
                return []
            }
            // 需要赋值连接的部分的类型就是 RELATION
            if ('RELATION' == root.type) {
                root.data.sectionKey = sectionKey
                return [root.data]
            }

            // 如果是 block 节点，则需要记录其 key ，方便后续定位到具体的部分
            if ('block' == root.object) {
                sectionKey = root.key
            }
            // 递归收集子节点产生的结果
            let result = []
            root.nodes.forEach(node => {
                result = result.concat(dfs(node, sectionKey))
            })
            return result
        }

        console.log(relationNodes = dfs(document, ''))
    }

    // 收集关联的 tb 任务的信息
    let collectRelatedTeambition = function (xhr) {
        let urlReg = /^https:\/\/thoughts\.teambition\.com\/api\/integration\/teambition\/getRelatedTeambition\?pageSize=1000&_id=.*&type=task&_organizationId=.*&_=.*$/
        // 非当前函数处理的 url ，则直接返回
        if (!urlReg.test(xhr.responseURL)) {
            return
        }

        // 长度不够，则是其他前置操作
        if (xhr.getResponseHeader('content-length') < 10) {
            return
        }

        let taskInfo = xhr.response
        relationNodes.forEach(relationNode => {
            if (relationNode.nodeId == taskInfo._id) {
                relationNode.url = taskInfo.url
                relationNode.title = taskInfo.title
            }
        })
    }

    // 收集关联的 thoughts 的信息
    let collectRelatedThoughts = function (xhr) {
        let urlReg = /^https:\/\/thoughts\.teambition\.com\/api\/workspaces\/[^/]*\/nodes\/[^/]*\?pageSize=1000&_=.*$/
        // 非当前函数处理的 url ，则直接返回
        if (!urlReg.test(xhr.responseURL)) {
            return
        }

        let docInfo = xhr.response
        relationNodes.forEach(relationNode => {
            if (relationNode.nodeId == docInfo._id) {
                relationNode.url = 'https://thoughts.teambition.com/workspaces/' + docInfo._workspaceId + '/docs/' + docInfo._id
                relationNode.title = docInfo.title
            }
        })
        console.log(relationNodes)
    }

    let addEvent = function () {
        relationNodes.forEach(relationNode => {
            Array.from(document.querySelectorAll('li[data-key="' + relationNode.sectionKey + '"] span[data-is-teambition] span'))
                .filter(element => element.innerText == relationNode.title)
                .forEach(element => {
                    // 按住任意功能键，进入当前元素，则展示 url
                    element.addEventListener('mouseenter', function(event) {
                        if (event.ctrlKey || event.altKey || event.metaKey) {
                            copyText(relationNode.url)
                        }
                    })
                })
        })
    }

    let onLoad = function (progressEvent) {
        let xhr = progressEvent.target
        // 没有正常获取到结果，则直接返回
        if (xhr.readyState != 4 || xhr.status != 200) {
            return
        }

        collectRelationNodes(xhr)
        collectRelatedThoughts(xhr)
        collectRelatedTeambition(xhr)
    }

    let originalOpen = XMLHttpRequest.prototype.open;
    // 重写 open ，使其可以添加自定义的 load 事件处理逻辑
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('load', onLoad);

        originalOpen.apply(this, arguments);
    };
    setTimeout(function(){
        addEvent()
    }, 5000)
})();
