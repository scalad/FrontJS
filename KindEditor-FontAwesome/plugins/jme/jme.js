KindEditor.lang({
    jme: '插入公式'
});
KindEditor.plugin('jme', function(e) {
    var editor = this,
        name = 'jme';
    editor.clickToolbar(name, function() {
        var dialog = editor.createDialog({
            name: 'jme',
            width: 500,
            height: 300,
            title: editor.lang('jme'),
            body: '<div style="width:100%;height:278px;">' +
                '<iframe id="math_frame" style="width:100%;height:278px;" frameborder="no" src="' + KindEditor.basePath + 'plugins/jme/dialogs/mathdialog.html"></iframe></div>',
            yesBtn: {
                name: '确定',
                click: function(e) {
                    var thedoc = document.frames ? document.frames('math_frame').document : getIFrameDOM("math_frame");
                    $("#jme-math", thedoc).find(".textarea").remove();
                    var mathHTML = '<span class="mathquill-rendered-math" style="font-size:' + '20px' + ';" >' + $("#jme-math", thedoc).html() + '</span><span>&nbsp;</span>';
                    editor.insertHtml(mathHTML).hideDialog().focus();
                    return;
                }
            }
        });
    });
});

function getIFrameDOM(fid) {
    var fm = getIFrame(fid);
    return fm.document || fm.contentDocument;
}

function getIFrame(fid) {
    return document.getElementById(fid) || document.frames[fid];
}