/**
 * 自定义功能组件，封装各种功能
 *
 * @type {{uploader: {upload: component.uploader.upload, doUpload: component.uploader.doUpload}}}
 */
var component = {
    // 上传器
    uploader: {
        // 上传文件，触发后，会选择文件，并执行上传文件获取url，最后执行回调（回调的第一个参数是文件，第二个参数是上传的url）
        upload: function(accept, callback) {
            // 1. 创建 input 节点
            if($('#diy-uploader-input').length == 0) {
                $('body').append('<input id="diy-uploader-input" type="file" style="position: absolute; top: -1000px; left: -1000px;" accept="' + accept + '">');
            }

            // 2. 并绑定点击事件，用于触发 实际执行上传
            var $this = this;
            $('#diy-uploader-input').on('change', function(event) {
                var file = event.target.files[0];
                var url = $this.doUpload(file);
                // 执行回调
                callback(file, url);
            });

            // 3. 执行模拟点击
            $('#diy-uploader-input').click();
        },

        // 调用 3个 官方api 上传文件，并返回文件 url
        doUpload: function(file) {
            // (1) 获取上传文件文件的凭证
            var transmitId = api.getTransmitId(file.size);

            // (2) 上传文件
            var successful = api.upload(transmitId, file);
            if(successful) {
                // (3) 添加各种信息，并返回url
                return api.putResource(transmitId, file);
            }
        },
    }
};