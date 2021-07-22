// ==UserScript==
// @name         zsxq-plus
// @namespace    https://github.com/idealism-xxm/tampermonkey/tree/master/zsxq
// @version      0.0.1
// @icon         https://wx.zsxq.com/dweb2/assets/images/favicon_32.ico
// @description  知识星球加强功能
// @supportURL   https://github.com/idealism-xxm/tampermonkey/tree/master/zsxq
// @updateURL    https://raw.githubusercontent.com/idealism-xxm/tampermonkey/master/zsxq/src/main.js
// @author       idealism-xxm
// @match        https://wx.zsxq.com/dweb2/*
// @grant        none
// @run-at       document-end
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// ==/UserScript==

/**
 * 工具
 */
 const tool = {
    version: '2.8.1',

    // 获取下一毫秒的时间字符串
    getNextMsStr: function (time) {
        return new Date(Date.parse(time) + 1).toISOString()
    },

    // 获取时间戳
    getTimestamp: function () {
        return Math.floor((new Date).getTime() / 1e3)
    },

    // 获取 requestId
    getRequestId: function () {
        let requestId = ''
        for (let i = 0; i < 32; i++) {
            requestId += Math.floor(16 * Math.random()).toString(16)
            if (i == 8 || i == 12 || i == 16 || i == 20) {
                requestId += '-'
            }
        }
        return requestId
    },

    // 获取请求头
    getHeaders: function (url) {
        const timestamp = tool.getTimestamp()
        const requestId = tool.getRequestId()
        const message = url + ' ' + timestamp + ' ' + requestId
        const signature = CryptoJS.SHA1(message).toString()
        return {
            'x-request-id': requestId,
            'x-signature': signature,
            'x-timestamp': timestamp,
            'x-version': tool.version,
        }
    },

    // get 同步请求
    ajaxGet: function (apiName, url) {
        let response = null

        $.ajax({
            url: url,
            type: "GET",
            async: false,
            xhrFields: {
                withCredentials: true
            },
            headers: tool.getHeaders(url),
            success: function (result) {
                response = result
            },
            error: function (e) {
                console.error('ERROR: ' + apiName + ' error');
                console.error(e);
            }
        })

        return response?.resp_data
    },

    // post 同步请求
    ajaxPost: function (apiName, url, data) {
        let response = null

        $.ajax({
            url: url,
            type: "POST",
            async: false,
            data: data,
            xhrFields: {
                withCredentials: true
            },
            headers: tool.getHeaders(url),
            success: function (result) {
                response = result
            },
            error: function (e) {
                console.error('ERROR: ' + apiName + ' error');
                console.error(e);
            }
        })

        return response?.resp_data
    }
};

/**
 * 官方 api
 * 封装官方api调用
 */
const api = {
    // 获取知识星球列表
    listGroups: function () {
        const url = 'https://api.zsxq.com/v2/topics'
        return tool.ajaxGet('listGroups', url)
    },

    // 获取指定星球的帖子分页列表
    // @return [
    //   {
    //      "topic_id": number,
    //      "user_specific": {
    //          liked: boolean,
    //          subscribed: boolean,
    //      },
    //   },
    //   ...
    // ]
    pageTopics: function (groupId, scope, pageSize, beginTime, endTime) {
        scope = scope || 'all'
        pageSize = pageSize || 20
        let url = 'https://api.zsxq.com/v2/groups/' + groupId + '/topics?scope=' + scope + '&count=' + pageSize
        if (beginTime) {
            url += '&begin_time=' + encodeURIComponent(beginTime)
        }
        if (endTime) {
            url += '&end_time=' + encodeURIComponent(endTime)
        }
        const data = tool.ajaxGet('pageTopics', url)
        return data?.topics || []
    },

    // 获取指定星球的帖子菜单列表
    //（预置的有 preset 字段，可以通过 topics 接口指定 scope 查询）
    listMenus: function (groupId) {
        const url = 'https://api.zsxq.com/v2/groups/' + groupId + '/menus'
        return tool.ajaxGet('listMenus', url)
    },

    // 获取指定帖子详情
    // @return Optional<{
    //   "topic_id": number,
    //   "user_specific": {
    //       liked: boolean,
    //       subscribed: boolean,
    //   }
    // }>
    getTopic: function (topicId) {
        const url = 'https://api.zsxq.com/v2/topics/' + topicId
        return tool.ajaxGet('getTopic', url)
    },

    // 获取指定帖子点赞前 50 的作业列表
    getTopicSolutionTopList: function (topicId) {
        const url = 'https://api.zsxq.com/v2/topics/' + topicId + '/solutions/top_list'
        return tool.ajaxGet('getTopicSolutionTopList', url)?.solutions || []
    },

    // 获取指定帖子的作业分页列表
    pageTopicSolutions: function (topicId, pageSize, sort, beginTime, endTime) {
        pageSize = pageSize || 20
        sort = sort || 'asc'
        let url = 'https://api.zsxq.com/v2/topics/' + topicId + '/solutions?count=' + pageSize + '&sort=' + sort
        if (beginTime) {
            url += '&begin_time=' + encodeURIComponent(beginTime)
        }
        if (endTime) {
            url += '&end_time=' + encodeURIComponent(endTime)
        }
        return tool.ajaxGet('pageTopicSolutions', url)?.solutions || []
    },

    // 获取指定的帖子的评论分页列表
    pageTopicComments: function (topicId, pageSize, sort) {
        pageSize = pageSize || 20
        sort = sort || 'asc'
        const url = 'https://api.zsxq.com/v2/topics/' + topicId + '/comments?count=' + pageSize + '&sort=' + sort
        return tool.ajaxGet('pageTopicComments', url)?.comments || []
    },

    // 点赞指定帖子
    likeTopic: function (topicId) {
        const url = 'https://api.zsxq.com/v2/topics/' + topicId + '/likes'
        return tool.ajaxPost('likeTopic', url, { req_data: {} })
    }
};

/**
 * 功能封装
 */
const trait = {
    // 点赞指定帖子点赞前 50 的作业
    likeTopicTopSolutions: function (topicId) {
        api.getTopicSolutionTopList(topicId).forEach(function (solution) {
            if (!solution.user_specific.liked) {
                console.log('已点赞「' + solution.topic_id + '」')
                api.likeTopic(solution.topic_id)
            }
        })
    },

    // 点赞制定帖子所有的作业
    likeTopicAllSolutions: function (topicId) {
        let beginTime = null
        while (true) {
            const solutions = api.pageTopicSolutions(topicId, 20, 'asc', beginTime)
            console.log(solutions)
            if (solutions.length === 0) {
                break
            }

            solutions.forEach(function (solution) {
                if (!solution.user_specific.liked) {
                    console.log('已点赞「' + solution.topic_id + '」')
                    api.likeTopic(solution.topic_id)
                }
            })
            beginTime = tool.getNextMsStr(solutions[solutions.length - 1].create_time)
        }
    }
};

(function () {
    'use strict';

    window.onload = function () {

    }

    window.zsqxPlus = { api, tool, trait }
})();
