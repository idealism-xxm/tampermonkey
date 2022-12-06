/**
 * 官方api 的 创建数据 获取器
 *
 * @type {{getCreateFolderData: createDataGetter.getCreateFolderData, getCreateDocNoteData: createDataGetter.getCreateDocNoteData}}
 */
var createDataGetter = {
    // 获取创建 文件夹 的 数据
    getCreateFolderData: function (parentId, name) {
        var fileId = tool.getUUID('WEB', 32);
        var cstk = tool.getCstk();
        var timeSecond = parseInt(new Date().getTime() / 1000);

        var data ={
            fileId: fileId,
            name: name,
            domain: 1,
            parentId: parentId,
            rootVersion: -1,
            sessionId: '',
            dir: true,
            createTime: timeSecond,
            modifyTime: timeSecond,
            cstk: cstk
        };

        return data;
    },

    // 获取创建 doc 笔记 的 数据
    getCreateDocNoteData: function(parentId, name) {
        var fileId = tool.getUUID('WEB', 32);
        var timeSecond = parseInt(new Date().getTime() / 1000);
        var cstk = tool.getCstk();

        var data = {
            fileId: fileId,
            parentId: parentId,
            name: name + '.note',
            domain: 0,
            rootVersion: -1,
            sessionId: '',
            dir: false,
            createTime: timeSecond,
            modifyTime: timeSecond,
            bodyString: '<?xml version="1.0" encoding="UTF-8" standalone="no"?><note xmlns="http://note.youdao.com" file-version="0" schema-version="1.0.3"><head/><body><para><text/><inline-styles/><styles/></para></body></note>',
            transactionId: fileId,
            transactionTime: timeSecond,
            orgEditorType: 1,
            cstk: cstk
        };

        return data;
    }
};