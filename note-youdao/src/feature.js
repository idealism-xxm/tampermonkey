/**
 * 自定义功能
 *
 * @type {{mdImageUploader: {init: feature.mdImageUploader.init, backfillPage: feature.mdImageUploader.backfillPage}}}
 */
var feature = {
    // md图片上传功能
    mdImageUploader: {
        // 初始化，当md文件上传弹框出来的时候，添加上传图片按钮
        init: function() {
            // 有道云笔记用 on 绑定 DOMNodeInserted 不生效 - -|||
            $('body')[0].addEventListener("DOMNodeInserted", function(e){
                // 如果是 markdown 上传图片的节点被添加
                if(e.target.nodeName.toLowerCase()== 'markdown-upload-image') {
                    var divButtonBarSelector = 'body > dialog-overlay > div > div > div.widget-dialog-body > markdown-upload-image > div > div.button-bar';

                    // 如果 底部按钮栏已出来，并且没添加过 上传按钮，则添加 上传按钮
                    if($(divButtonBarSelector).length == 1 && $('#diy-uploader-button').length == 0) {
                        // 添加按钮
                        var uploaderButton = '<div id="diy-uploader-button" class="loadbtn local-img" style="margin-right:15px;height:34px">上传图片</div>';
                        $('body > dialog-overlay > div > div > div.widget-dialog-body > markdown-upload-image > div > div.button-bar').prepend(uploaderButton);

                        // 给按钮添加事件
                        $('#diy-uploader-button').on('click', function() {
                            component.uploader.upload('image/*', feature.mdImageUploader.backfillPage);
                        });
                    }
                }
            }, false);
        },

        // 回填页面
        backfillPage: function(file, url) {
            // 填入url
            var urlSelector = 'body > dialog-overlay > div > div > div.widget-dialog-body > markdown-upload-image > div > div:nth-child(2) > div.edit-container > input';
            $(urlSelector).val(url);
            // 触发 input 事件，更新双向绑定的数据
            tool.trigger(urlSelector, 'input');

            // 填入文件名
            var nameSelector = 'body > dialog-overlay > div > div > div.widget-dialog-body > markdown-upload-image > div > div:nth-child(3) > div.edit-container > input';
            var name = file.name.substring(0, file.name.lastIndexOf('.'));
            $(nameSelector).val(name);
            // 触发 input 事件，更新双向绑定的数据
            tool.trigger(nameSelector, 'input');
        },
    },
};