/**
 * 官方 api
 * 封装官方api调用 TODO 封装异常，处理异常逻辑
 *
 * @type {{listPath: api.listPath, listPageByParentId: api.listPageByParentId, download: api.download, push: api.push, getTransmitId: api.getTransmitId, upload: api.upload, putResource: api.putResource}}
 */
var api = {
    // 调用 有道云笔记 api，获取路径
    listPath: function (fileId) {
        var pathList = [];

        var cstk = tool.getCstk();
        var url = tool.getUrl('/yws/api/personal/file?method=listPath&fileId=' + fileId + '&keyfrom=web&cstk=' + cstk);
        var data = {
            cstk: cstk
        };
        $.ajax({
            url: url,
            type: "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: data,
            dataType: "json",
            async: false,
            success: function(result){
                pathList = result;
            },
            error:function(e){
                console.error('ERROR: listPath error');
                console.error(e);
            }
        });

        // 返回 路径 列表
        return pathList;
    },

    // 调用 有道云笔记 api，获取 当前文件夹下的所有 文件（夹）
    listPageByParentId: function (parentId) {
        var children = [];

        var cstk = tool.getCstk();
        var url = tool.getUrl('/yws/api/personal/file/' + parentId + '?all=true&f=true&len=30&sort=1&isReverse=false&method=listPageByParentId&keyfrom=web&cstk=' + cstk);
        var data = {
            cstk: cstk
        };
        $.ajax({
            url: url,
            type: "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: data,
            dataType: "json",
            async: false,
            success: function(result){
                children = result.entries;
            },
            error:function(e){
                console.error('ERROR: listPageByParentId error');
                console.error(e);
            }
        });

        // 返回 子文件（夹） 列表
        return children;
    },

    // 调用 有道云笔记 api，获取 当前文件的 内容
    download: function (fileId) {
        var content = null;

        var cstk = tool.getCstk();
        var url = tool.getUrl('/yws/api/personal/sync?method=download&keyfrom=web&cstk=' + cstk);
        var data = {
            fileId: fileId,
            version: -1,
            read: true,
            cstk: cstk,
        };

        $.ajax({
            url: url,
            type: "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: data,
            dataType: "text",
            async: false,
            success: function(result){
                content = result;
            },
            error:function(e){
                console.error('ERROR: download error');
                console.error(e);
            }
        });

        // 返回 当前文件 内容
        return content;
    },

    // 调用 有道云笔记 api，根据 getCreateData 获取创建数据（文件夹、doc笔记 等）
    push: function (parentId, name, getCreateData) {
        var cstk = tool.getCstk();
        var url = tool.getUrl('/yws/api/personal/sync?method=push&keyfrom=web&cstk=' + cstk);
        var data = getCreateData(parentId, name);
        $.ajax({
            url: url,
            type: "POST",
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: data,
            dataType: "json",
            async: false,
            success: function(result){
                console.log('成功创建文件夹[' + name + ']， fileId = ' + fileId + '，parentId = ' + parentId);
            },
            error:function(e){
                console.error('ERROR: push error');
                console.error(e);
            }
        });

        // 返回创建的数据（文件夹、doc笔记 等）的 uuid
        return data.fileId;
    },

    // 调用 有道云笔记 api，获取上传文件的 凭证
    getTransmitId: function (fileSize) {
        var transmitId = null;

        var cstk = tool.getCstk();
        var url = tool.getUrl('/yws/api/personal/sync/upload?cstk=' + cstk + '&keyfrom=web&cstk=' + cstk);
        var data = {cstk: cstk};
        $.ajax({
            url: url,
            type: "POST",
            headers:{"File-Size": fileSize},
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: data,
            dataType: "json",
            async: false,
            success: function(result){
                transmitId = result.transmitId;
            },
            error:function(e){
                console.error('ERROR: getTransmitId error');
                console.error(e);
            }
        });

        // 返回文件上传 凭证
        return transmitId;
    },

    // 调用 有道云笔记 api，上传文件【注意：目前只支持小文件一次上传】 TODO：分片上传
    upload: function (transmitId, file) {
        var successful = false;

        var cstk = tool.getCstk();
        var url = tool.getUrl('/yws/api/personal/sync/upload/' + transmitId + '?cstk=' + cstk);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", url , false);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.onreadystatechange = function() {
            successful = true; // TODO
        };
        xhr.send(file);

        // 返回是否上传成功
        return successful;
    },

    // 调用 有道云笔记 api，给上传完成的文件添加各种信息
    putResource: function (transmitId, file) {
        var fileUrl = null;

        var cstk = tool.getCstk();
        var resourceId = tool.getUUID('WEB', 32);
        var fileName = encodeURI(file.name);
        var timeSecond = parseInt(new Date().getTime() / 1000);
        var url = tool.getUrl('/yws/api/personal/sync?method=putResource&resourceId='+ resourceId + '&resourceName=' + fileName + '&rootVersion=-1&sessionId=&transmitId=' + transmitId + '&genIcon=true&createTime=' + timeSecond + '&modifyTime=' + timeSecond + '&keyfrom=web&cstk=' + cstk);
        var data = {
            cstk: cstk
        };
        $.ajax({
            url: url,
            type: "POST",
            headers:{"YNOTE_STREAM_REQUEST": true},
            contentType: 'application/x-www-form-urlencoded;charset=UTF-8',
            data: data,
            dataType: "json",
            async: false,
            success: function(result, status, request){
                fileUrl = request.getResponseHeader("url");
                console.log('成功上传文件[' + name + ']， fileUrl = ' + fileUrl);
            },
            error:function(e){
                console.error('ERROR: putResource error');
                console.error(e);
            }
        });

        // 返回文件地址
        return fileUrl;
    },
};