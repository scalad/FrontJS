(function($){ 
$.fn.ioskeyboard = function(options){ 
var defaults = { 
    keyboardRadix:100,//键盘大小基数，实际大小比为9.4，即设置为100时实际大小为940X330
    keyboardRadixMin:60,//键盘大小的最小值，默认为60，实际大小为564X198
    keyboardRadixChange:true,//是否允许用户改变键盘大小,该功能仅能完美支持Chrome26；仅当keyboardRadixMin不小于60时，完美支持Safari内核浏览器
    clickeve:true,//是否绑定元素click事件
    colorchange:true,//是否开启按键记忆功能，如果开启，将随着按键次数的增加加深相应按键的背景颜色
    colorchangeStep:1,//按键背景颜色改变步伐，采用RBG值，默认为RGB(255,255,255),没按一次三个数字都减去步伐值
    colorchangeMin:154//按键背影颜色的最小值，默认为RGB(154,154,154)
} 
var options = $.extend(defaults, options); 
var numkeyboardcount = 0;
var activeinputele;
var keyboardRadix = options.keyboardRadix;
var keyboardRadixMin = options.keyboardRadixMin;
var colorchange = options.colorchange;
var colorchangeStep = options.colorchangeStep;
var colorchangeMin = options.colorchangeMin;
var bMouse = false;
var bToch = false;
var MAction = false;
var MTouch = false;
var keyfixed = false;
if(keyboardRadix<keyboardRadixMin){
    keyboardRadix = keyboardRadixMin;
}
this.each(function(){ 
    numkeyboardcount++;
    //添加键盘
    if(numkeyboardcount<2){
    $("body").append("<ul id='keyboard_5xbogf8c'>"+
    "<li>1</li>"+
    "<li>2</li>"+
    "<li>3</li>"+
    "<li>4</li>"+
    "<li>5</li>"+
    "<li>6</li>"+
    "<li>7</li>"+
    "<li>8</li>"+
    "<li>9</li>"+
    "<li>0</li>"+
    "<li>←</li>"+
    "<li>Q</li>"+
    "<li>W</li>"+
    "<li>E</li>"+
    "<li>R</li>"+
    "<li>T</li>"+
    "<li>Y</li>"+
    "<li>U</li>"+
    "<li>I</li>"+
    "<li>O</li>"+
    "<li>P</li>"+
    "<li></li>"+
    "<li>A</li>"+
    "<li>S</li>"+
    "<li>D</li>"+
    "<li>F</li>"+
    "<li>G</li>"+
    "<li>H</li>"+
    "<li>J</li>"+
    "<li>K</li>"+
    "<li>L</li>"+
    "<li>Exit</li>"+
    "<li>CapsLock</li>"+
    "<li>Z</li>"+
    "<li>X</li>"+
    "<li>C</li>"+
    "<li>V</li>"+
    "<li>B</li>"+
    "<li>N</li>"+
    "<li>M</li>"+
    "<li><span>-</span><span>_</span></li>"+
    "<li><span>/</span><span>.</span></li>"+
    "<li>Clear</li>"+
    "<div id='keyboard_5xbogf8c_left'></div>"+
    "<div id='keyboard_5xbogf8c_right'></div>"+
  "</ul>");    
    }    
    
    var inputele = $(this);
    var keyboard =$("#keyboard_5xbogf8c");
    var keys = keyboard.children("li");
    var hiddenbutton = keyboard.children("div");
    keyboard.css({"font-size":keyboardRadix+"px"});
    
    //keyboard.css({"position":"fixed","right":"0.05em","bottom":"0.05em"});
    exit();
    var shiftbool = false;
    if(numkeyboardcount<2){
    if(options.keyboardRadixChange){
        BmouseDrag();
        BtouchDrag();
    }
    keyboard.dblclick(function(){
        if(keyfixed){
            keyfixed = false;
        }else{
            keyboard.css({"position":"fixed","right":"0.05em","bottom":"0.05em"});
            keyfixed = true;
        }
    });
    keys.click(function(event){
    var keyele = $(this);
    var keytext = keyele.text();
    var evebool = true;    
    if(keytext==="CapsLock"){
        activeinputele[0].focus();
        if(shiftbool){
            keyele.css({background:"rgba(255,255,255,.9)"});
            shiftbool = false;
        }else{
            keyele.css({background:"rgba(188,188,188,.5)"});
            shiftbool = true;
        }
        
        evebool = false;
    }
    if(keytext==="Exit"||keytext.length<1){
        simulateKeyEvent(activeinputele[0],13);
        exit();
        evebool = false;
    }
    if(keytext==="←"){
        activeinputele[0].focus();
        backspace();
        evebool = false;
    }
    if(keytext==="Clear"){
        activeinputele[0].focus();
        keyclear();
        evebool = false;
    }
    if(evebool){
        if(shiftbool){
            if(keytext.length===2){
                keytext = keytext.substring(0,1);
            }
        }else{
            if(keytext.length===2){    
                keytext = keytext.substring(1,2);
            }else{
                keytext = keytext.toLowerCase();    
            }
                    
        }
        clickkey(keytext);
        if(colorchange){
            var oldbabkground = $(this).css("background").split(',')[0].split('(')[1];
            var newbabkground = oldbabkground-colorchangeStep;
            if(newbabkground<colorchangeMin){
                newbabkground = colorchangeMin;
                alert("min")
            }
             $(this).css("background","rgba("+newbabkground+","+newbabkground+","+newbabkground+",.9)");
        }
    }    
    })
    keyboard.children("li:eq("+21+")").mousedown(function(event){
        $(this).css({top:"4.6em", "box-shadow": "inset 0 0.04em 0 rgba(0,0,0,.5)"});
        keyboard.children("li:eq("+31+")").css({top:"0.1em","box-shadow": "inset 0 0em 0 rgba(0,0,0,.5)"});
    })
    .mouseup(function(event){
        $(this).css({top:"4.5em","box-shadow":" inset 0 0em 0 rgba(0,0,0,.5)"});
        keyboard.children("li:eq("+31+")").css({top:"0px","box-shadow":" inset 0 0em 0 rgba(0,0,0,.5)"});
    });
    keyboard.children("li:eq("+31+")").mousedown(function(event){
        $(this).css({top:"0.1em","box-shadow": "inset 0 0em 0 rgba(0,0,0,.5)"});
        keyboard.children("li:eq("+21+")").css({top:"4.6em", "box-shadow": "inset 0 0.04em 0 rgba(0,0,0,.5)"});
    })
    .mouseup(function(event){
        $(this).css({top:"0px","box-shadow":" inset 0 0em 0 rgba(0,0,0,.5)"});
        keyboard.children("li:eq("+21+")").css({top:"4.5em","box-shadow":" inset 0 0em 0 rgba(0,0,0,.5)"});
    });
    }

    inputele.focus(function(event){    
        activeinputele = inputele;
        var p = GetScreenPosition(this);
        if(keyboard.css("display")=="none"){
            keyboard.css({"display":"block"});
            mouseDrag();
            touchDrag();        
        }});
        
    if(options.clickeve){        
        inputele.click(function(){    
        activeinputele = inputele;
        var p = GetScreenPosition(this);
        if(keyboard.css("display")=="none"){        
            keyboard.css({"display":"block"});
            mouseDrag();
            touchDrag();
        }});
    }
    
    function GetScreenPosition(object) {
        var position = {};            
        position.x = object.offsetLeft;
        position.y = object.offsetTop;
        while (object.offsetParent) {
            position.x = position.x + object.offsetParent.offsetLeft;
            position.y = position.y + object.offsetParent.offsetTop;
            if (object == document.getElementsByTagName("body")[0]) {
                break;
            }
            else{
                object = object.offsetParent;
            }
        }
        return position;
    }    
        
    function keyclear(){
         activeinputele.val("");
    }
    function backspace(){
        var inputtext = activeinputele.val();
        if(inputtext.length>0){
            inputtext = inputtext.substring(0,inputtext.length-1);
            activeinputele.val(inputtext);
        }    
    }    
    function clickkey(key){
        var inputtext = activeinputele.val();
        inputtext = inputtext+key;        
        activeinputele.val(inputtext);
        activeinputele[0].focus();
    }    
    
    function exit(){    
        keyboard.css({"display":"none"});
    }
    
    
    function BmouseDrag(){
        var eventEle = hiddenbutton;
        var eventEleId; 
        var moveEle = keyboard;
        var stx = etx = curX  = 0;
        var keyboardfontsize = +moveEle.css("font-size").split('px')[0];
        var tempsize;
        eventEle.mousedown(function(event){
            bMouse = true;
            stx = event.pageX;    
            keyboardfontsize = +moveEle.css("font-size").split('px')[0];
            eventEleId = $(this).attr('id');
            event.preventDefault();
        });
        $("body").mousemove(function(event){            
        if(bMouse){
            var curX = event.pageX-stx;
            if(eventEleId==="keyboard_5xbogf8c_left"){
                tempsize = keyboardfontsize-Math.ceil(curX/10);
            }
            if(eventEleId==="keyboard_5xbogf8c_right"){
                tempsize = keyboardfontsize+Math.ceil(curX/10);
            }
            if(tempsize<keyboardRadixMin){
                tempsize=keyboardRadixMin;
            }
            moveEle.css({"font-size":tempsize});
            event.preventDefault();
        }});
        $("body").mouseup(function(event){
            stx = etx = curX = 0;
            bMouse = false;            
        });
    }
    
    function BtouchDrag() {
        var eventEle = hiddenbutton;
        var moveEle = keyboard;
        var eventEleId; 
        var stx = etx = curX  = 0;
        var keyboardfontsize = +moveEle.css("font-size").split('px')[0];
        var tempsize;
        eventEle.on("touchstart", function(event) { //touchstart
            var event = event.originalEvent;
            bToch = true;
            curX = 0;
            eventEleId = $(this).attr('id');
            keyboardfontsize = +moveEle.css("font-size").split('px')[0];
            stx = event.touches[0].pageX;
            sty = event.touches[0].pageY;
        });
        eventEle.on("touchmove", function(event) {
            if(bToch){
            var event = event.originalEvent;
            
            curX = event.touches[0].pageX - stx;
            if(eventEleId==="keyboard_5xbogf8c_left"){
                tempsize = keyboardfontsize-Math.ceil(curX/10);
            }
            if(eventEleId==="keyboard_5xbogf8c_right"){
                tempsize = keyboardfontsize+Math.ceil(curX/10);
            }
            if(tempsize<keyboardRadixMin){
                tempsize=keyboardRadixMin;
            }
            moveEle.css({"font-size":tempsize});
            event.preventDefault();
            }
            
        });
        eventEle.on("touchend", function(event) {
            stx = etx = curX = 0;
            bToch = false;
            
        })

    }

    function mouseDrag() {
        var eventEle = keyboard;
        var stx = etx = curX = sty = ety = curY = 0;
        var eleRight =+eventEle.css("right").split('px')[0];
        var eleBottom = +eventEle.css("bottom").split('px')[0];
        eventEle.mousedown(function(event){
        //console.log("down",+eventEle.css("right").split('px')[0]);
            if(!keyfixed){
                MAction = true;
            }
            //alert(MAction);
            stx = event.pageX;    
            sty = event.pageY;
            //eleRight = +eventEle.css("left").split('px')[0];
            //eleBottom = +eventEle.css("top").split('px')[0];
            eleRight = +eventEle.css("right").split('px')[0];
            eleBottom = +eventEle.css("bottom").split('px')[0];
            
            event.preventDefault();
        });
        $("body").mousemove(function(event){            
        if(MAction&&!bMouse){
            var curX = event.pageX-stx;
            var curY = event.pageY-sty;                
            eventEle.css({"right":eleRight-curX,"bottom":eleBottom-curY});
            //console.log("move",+eventEle.css("right").split('px')[0]);
            event.preventDefault();
        }});
        $("body").mouseup(function(event){
            stx = etx = curX = sty = ety = curY = 0;
            MAction = false;
            //console.log("up",+eventEle.css("right").split('px')[0]);
                
        });
    }
    
    function touchDrag() {
        var eventEle = keyboard;
        var stx = sty = etx = ety = curX = curY = 0;
        var MTouch = false;
        var eleRight = +eventEle.css("right").split('px')[0];
        var eleBottom = +eventEle.css("bottom").split('px')[0];        
        eventEle.on("touchstart", function(event) { //touchstart
           // alert(bToch);
            var event = event.originalEvent;
            MTouch = true;
            curX = curY = 0;
            // 元素当前位置
            eleRight = +eventEle.css("right").split('px')[0];
            eleBottom = +eventEle.css("bottom").split('px')[0];
            // 手指位置
            stx = event.touches[0].pageX;
            sty = event.touches[0].pageY;
            //console.log("up",+eventEle.css("right").split('px')[0]);
        });
        eventEle.on("touchmove", function(event) {
        
            if(MTouch&&!bToch){
            
            var event = event.originalEvent;
            event.preventDefault();
            curX = event.touches[0].pageX - stx;
            curY = event.touches[0].pageY - sty;
            //console.log("move",eleRight-curX);
            //alert(eleRight+"-"+gundongX);
            eventEle.css({"right":eleRight-curX,"bottom":eleBottom-curY});
            }
            
        });
        eventEle.on("touchend", function(event) {
            stx = etx = curX = sty = ety = curY = 0;
            MTouch = false;
            
        })
        
    }
    
    //模拟键盘事件,仅支持firefox，ie8-
    
    function simulateKeyEvent(target,keyCode) {         
        var customEvent = null;
        var a = typeof document.createEvent;

        if(typeof document.createEvent == "function"){//firefox
            try {
                customEvent = document.createEvent("KeyEvents");
                customEvent.initKeyEvent("keypress", true, true,window, false, false, false, false, keyCode, keyCode);     
                target.dispatchEvent(customEvent);
            } catch (ex){
                //console.log("This example is only demonstrating event simulation in firefox and IE.");        
            }
           

        } else if (document.createEventObject){ //IE
            customEvent = document.createEventObject();
            customEvent.bubbles = true;
            customEvent.cancelable = true;
            customEvent.view = window;
            customEvent.ctrlKey = false;
            customEvent.altKey = false;
            customEvent.shiftKey = false;
            customEvent.metaKey = false;
            customEvent.keyCode = keyCode;
            target.fireEvent("onkeypress", customEvent); 
                   
        } 
        else {
            //console.log("This example is only demonstrating event simulation in firefox and IE.");
        }
    }
    
}); 
}; 
})(jQuery);