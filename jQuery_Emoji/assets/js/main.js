/**
 * Created by dwt on 2016/5/14 0014.
 */
require.config({
    shim :{
        'jquery.lazyload' : ['jquery'],
        jqueryUI : ['jquery']
    },
   paths :{
       jquery : 'https://code.jquery.com/jquery-1.12.4.min',
       //jquery : '../plugins/jquery-1.12.3.min',
       jqueryUI: '../plugins/jquery-ui.min'
   }
});
var imgid = 0,
    textid = 0,
    moving;
require(['jquery','window','jqueryUI','draw','jquery.lazyload','doodle'], function($,w,$UI,d,$l,dd){

    //素材列表
    $('#img-list').delegate('.img-container', 'click', function(e){
        $('.img-box').removeClass('active-box');
        var target = e.target;
        if(target.nodeName.toLowerCase() == 'img'){
            var img = '<img src="'+ target.src +'" alt="" id="img-'+imgid+'"/>';
            var imgBox = new w.Window();
            imgBox.init('.panel',img);
        }
        imgid++;
    });
    //添加文字
    $('#addfont-btn').click(function(){
        $('.img-box').removeClass('active-box');
        var fontContent = $('#font-content')[0].value ||"没有输入内容";
        var fontSize = $('#font-size')[0].value ||36;
        var fontColor = $('#font-color')[0].value;
        var fontFamily = $('#font-family')[0].value;
        //alert(fontContent+fontSize+fontColor+fontFamily);
        var text = new w.Window();
        text.init('.panel','<span class="text" style = "font:'+fontSize+'px'+' '+fontFamily+'; font-weight: bold; color:'+fontColor+'"; id="text-'+textid+'">'+fontContent+'</span>')
        imgid++;
        textid++;
    });
    //画布
    $('.panel').click(function(e){
        var target = e.target;
        $('.img-box').removeClass('active-box');
        if((target.nodeName.toLowerCase() == 'img' && target.parentNode.className != 'doodleimg') || target.nodeName.toLowerCase() == 'span'){
            target.parentNode.className = 'img-box active-box';
        }
    }).resizable({containment:'.center'});
    //清空画布
    $('#clear-btn').click(function(){
       $('.img-box').remove();
        $('.doodleimg').remove()
    });
    //生成图片
    $('#drawing-btn').click(function(){
        $('#msk').toggleClass('show');
        var canvas = new d.Draw();
        canvas.init('.panel','#picture');
        //$('#msk').toggleClass('show');
    });
    //遮罩层
    $('#msk').click(function(){
        $(this).toggleClass('show');
    });
    //添加本地图片
    $('input[type = file]').change(function(e){
        var reader = new FileReader();
        var imgSrc = '',
            isImg = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
        if(!isImg.test(e.target.files[0].type)){
            alert("只能添加图片呦喂！\n\nThisType:"+ e.target.files[0].type);
            return;
        }
        reader.readAsDataURL(e.target.files[0]);
        reader.onload = function(e) {
            imgSrc = e.target.result;
            var imgDiv = $('<div class="img-container"><img src="" alt=""/></div>');
            $('#img-list').prepend(imgDiv);
            imgDiv.children()[0].src = imgSrc;
        };
    });
    //加载素材列表
    var loadingImg = $('<div class="loading"><img src="assets/img/icon/loading.gif" alt=""/><p>加载中...</p></div>');
    var loadErroImg = $('<div class="loading"><img src="assets/img/icon/loaderro.gif" alt=""/><p>加载失败！！！</p></div>');
    var imglist = $('#img-list');
    $(function(){
        imglist.html('');
        creatImglist('热门','./assets/data/.json');
    });
    $('.tag').click(function(e){
        var tabName = e.target.innerHTML;
        imglist.html('');
        creatImglist(tabName,'./assets/data/imglist.json');
    });
    function creatImglist(tabName,jsonUrl){
        loadingImg.appendTo('#img-list');
        if(tabName === '热门'){
            jsonUrl = './assets/data/hot.json';
        }
        $.get(jsonUrl,function(data, textStatus){
            var list = '';
            for(var i = 0, len = data.length; i < len; i++){
                if(data[i].tags.indexOf(tabName) != -1){
                    list += '<div class="img-container"><img class="lazy" data-original="'+ data[i].url +'" alt="" title="点击"/></div>';
                }
            }
            imglist.html('');
            if(list!= ''){
                $(list).appendTo('#img-list');
                $('img.lazy').lazyload({
                    placeholder : 'assets/img/icon/loading.gif',
                    container : $('#img-list'),
                    threshold : 100,
                    effect : 'fadeIn'
                })
            }else{
                loadErroImg.appendTo('#img-list');
            }
        }, 'json');
    }

    //画笔粗细下拉框
    $('#bursh-weight-selected').click(function(){
        $('#bursh-weight-option').toggleClass('show');
    });
    $('#bursh-weight-option li').click(function(){
        $('#bursh-weight-selected').children()[0].className = this.childNodes[0].className;
        $('#bursh-weight-selected').find('div').attr({'data-w' : $(this).find('div').attr('data-w')});
        $('#bursh-weight-option').toggleClass('show');
    });

    //涂鸦
    $('#begindoodle-btn').click(function(){
        $('#doodle-canvas').addClass('show');
        $('#doodle-btn-wrap').addClass('show');
        $('#btn-wrap').removeClass('show');
        beginDraw();
    });
    $('#bursh-weight-option').click(function(){
       beginDraw();
    });
    $('#brush-color').change(function(){
        beginDraw();
    });
    function beginDraw(){
        $('#doodle-canvas').unbind();
        var attr = {
            w : $('#bursh-weight-selected').find('div').attr('data-w'),
            color : $('#brush-color')[0].value
        };
        var doodle = new  dd.Doodle();
        doodle.init($('#doodle-canvas'),$('.panel'),attr);
    }
    //画完了
    $('#over-btn').click(function(){
        $('#doodle-canvas').removeClass('show');
        $('#doodle-btn-wrap').removeClass('show');
        $('#btn-wrap').addClass('show');
    });
    //撤销
    $('#undone-btn').click(function(){
        $('.doodleimg:last').remove();
    });
});