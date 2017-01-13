/*******************************************************************************
 * KindEditor - WYSIWYG HTML Editor for Internet
 * Copyright (C) 2006-2011 kindsoft.net
 *
 * @author Roddy <luolonghao@gmail.com>
 * @site http://www.kindsoft.net/
 * @licence http://www.kindsoft.net/license.php
 *******************************************************************************/

KindEditor.plugin('audio', function(K) {
    var self = this,
        name = 'audio',
        lang = self.lang(name + '.'),
        allowMediaUpload = K.undef(self.allowMediaUpload, true),
        allowFileManager = K.undef(self.allowFileManager, false),
        formatUploadUrl = K.undef(self.formatUploadUrl, true),
        filePostName = K.undef(self.filePostName, 'imgFile'),
        fieldAccept = K.undef(self.filedAccept, 'audio/mp3'),
        uploadJson = K.undef(self.uploadJson, self.basePath + 'php/upload_json.php');
    self.plugin.media = {
        edit: function() {
            var html = [
                '<div style="padding:20px;">',
                //url
                '<div class="ke-dialog-row">',
                '<label for="keUrl" style="width:60px;">URL</label>',
                '<input class="ke-input-text" type="text" id="keUrl" name="url" value="" style="width:273px;" />  ',
                '<input type="button" class="ke-upload-button" value="上传" />  ',
                '</div>',
                '<div class="ke-dialog-row">',
                '<label for="keAutostart" style="width:56px;">' + lang.autostart + '</label>',
                '<input type="checkbox" id="keAutostart" name="autostart" value="" /> ',
                '</div>',
                '</div>'
            ].join('');
            var dialog = self.createDialog({
                    name: name,
                    width: 450,
                    height: 230,
                    title: self.lang(name),
                    body: html,
                    yesBtn: {
                        name: self.lang('yes'),
                        click: function(e) {
                            var url = K.trim(urlBox.val()),
                                width = widthBox.val(),
                                height = heightBox.val();
                            if (url == 'http://' || K.invalidUrl(url)) {
                                alert(self.lang('invalidUrl'));
                                urlBox[0].focus();
                                return;
                            }
                            if (!/^\d*$/.test(width)) {
                                alert(self.lang('invalidWidth'));
                                widthBox[0].focus();
                                return;
                            }
                            if (!/^\d*$/.test(height)) {
                                alert(self.lang('invalidHeight'));
                                heightBox[0].focus();
                                return;
                            }
                            var isAutoStart = autostartBox[0].checked ? 'true' : 'false';
                            var html = '<p><audio src="' + url + '" controls="controls" autostart="' + isAutoStart + '"></audio>&nbsp; &nbsp; &nbsp;&nbsp;&nbsp;<br/></p>';
                            self.insertHtml(html).hideDialog().focus();
                        }
                    }
                }),
                div = dialog.div,
                urlBox = K('[name="url"]', div),
                viewServerBtn = K('[name="viewServer"]', div),
                widthBox = K('[name="width"]', div),
                heightBox = K('[name="height"]', div),
                autostartBox = K('[name="autostart"]', div);
            urlBox.val('http://');

            if (allowMediaUpload) {
                var uploadbutton = K.uploadbutton({
                    button: K('.ke-upload-button', div)[0],
                    fieldName: filePostName,
                    fieldAccept: fieldAccept,
                    url: K.addParam(uploadJson, 'dir=audio'),
                    afterUpload: function(data) {
                        dialog.hideLoading();
                        if (data.error === 0) {
                            var url = data.url;
                            if (formatUploadUrl) {
                                url = K.formatUrl(url, 'absolute');
                            }
                            urlBox.val(url);
                            if (self.afterUpload) {
                                self.afterUpload.call(self, url);
                            }
                            alert(self.lang('uploadSuccess'));
                        } else {
                            alert(data.message);
                        }
                    },
                    afterError: function(html) {
                        dialog.hideLoading();
                        self.errorDialog(html);
                    }
                });
                uploadbutton.fileBox.change(function(e) {
                    dialog.showLoading(self.lang('uploadLoading'));
                    uploadbutton.submit();
                });
            } else {
                K('.ke-upload-button', div).hide();
            }

            if (allowFileManager) {
                viewServerBtn.click(function(e) {
                    self.loadPlugin('filemanager', function() {
                        self.plugin.filemanagerDialog({
                            viewType: 'LIST',
                            dirName: 'media',
                            clickFn: function(url, title) {
                                if (self.dialogs.length > 1) {
                                    K('[name="url"]', div).val(url);
                                    self.hideDialog();
                                }
                            }
                        });
                    });
                });
            } else {
                viewServerBtn.hide();
            }

            var img = self.plugin.getSelectedMedia();
            if (img) {
                var attrs = K.mediaAttrs(img.attr('data-ke-tag'));
                urlBox.val(attrs.src);
                widthBox.val(K.removeUnit(img.css('width')) || attrs.width || 0);
                heightBox.val(K.removeUnit(img.css('height')) || attrs.height || 0);
                autostartBox[0].checked = (attrs.autostart === 'true');
            }
            urlBox[0].focus();
            urlBox[0].select();
        },
        'delete': function() {
            self.plugin.getSelectedMedia().remove();
        }
    };
    self.clickToolbar(name, self.plugin.media.edit);
});