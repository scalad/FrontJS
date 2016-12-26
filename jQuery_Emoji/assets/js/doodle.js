/**
 * Created by d on 2016/10/13.
 */
define(['jquery','window'],function($,w){
    function Doodle(){

    }
    Doodle.prototype = {
        drawPath : function(attr){
            attr.context.beginPath();
            attr.context.moveTo(this.startX,this.startY);
            attr.context.lineTo(attr.x,attr.y);
            attr.context.strokeStyle = attr.color;
            attr.context.lineWidth = attr.w;
            attr.context.lineCap = 'round';
            attr.context.stroke();
            this.startX = attr.x;
            this.startY = attr.y;
        },
        drawImg : function(attrs){
            attrs.context.save();
          /*  attrs.context.translate(attrs.x+attrs.width/2,attrs.y+attrs.height/2);
            attrs.context.rotate(attrs.angle);*/
            //attrs.context.drawImage(attrs.ele,-attrs.width/2,-attrs.height/2,attrs.width,attrs.height);
            attrs.context.drawImage(attrs.ele,attrs.x,attrs.y,attrs.width,attrs.height);
            attrs.context.restore();
        },
        onMove  : function(){
            this.attr.x = this.mx;
            this.attr.y = this.my;
            this.drawPath(this.attr);
            this.minX = Math.min(this.minX,this.mx);
            this.maxX = Math.max(this.maxX,this.mx);
            this.minY = Math.min(this.minY,this.my);
            this.maxY = Math.max(this.maxY,this.my);
        },

        init: function(canvas,panel,attr){
            this.canvas = canvas;

            var width = panel.width();      //设置canvas宽高
            var height = panel.height();
            this.canvas.attr({
                width : width,
                height : height
            });

            this.context = this.canvas[0].getContext('2d');

            this.canvas.mousedown(function(e){
                this.maxX = 0;
                this.minX = 9999;
                this.maxY = 0;
                this.minY = 9999;
                var beginX = e.offsetX;
                var beginY = e.offsetY;
                this.startX = beginX;
                this.startY = beginY;
                this.attr = attr;
                this.attr.context = this.context;
                this.attr.x = beginX;
                this.attr.y = beginY;
                this.drawPath(this.attr);
                this.moving = setInterval(this.onMove.bind(this),10);
            }.bind(this));

            this.canvas[0].addEventListener('mousemove',function(e){
                this.mx = e.offsetX;                  //获取移动时鼠标位置坐标
                this.my = e.offsetY;
            }.bind(this),false);

            this.canvas.mouseup(function(){
                console.log(this.minX+' '+this.minY+' '+this.maxX+' '+this.maxY)
                clearInterval(this.moving);
                var canvansUrl = this.canvas[0].toDataURL('image/png');
                var canvansImg = $('<img src="'+canvansUrl+'" alt="" style="width:'+ width +'px; height:'+ height +'px;"/>');
                var temporaryCanvas = $('<canvas style="position: absolute; top: -9999px" width="'+(this.maxX-this.minX+50)+'" height="'+(this.maxY-this.minY+50)+'"></canvas>');
                temporaryCanvas.appendTo('body');
                var ctx = temporaryCanvas[0].getContext('2d');
                var att = {
                    context : ctx,
                    x : -this.minX+25,
                    y : -this.minY+25,
                    width : width,
                    height : height,
                    ele : canvansImg[0]
                };
                this.drawImg(att);
                var temporaryCanvansUrl = temporaryCanvas[0].toDataURL('image/png');
                var doodleImg = $('<div class="doodleimg" style="position: absolute; left: '+ (this.minX-25) +'px; top: '+ (this.minY-25) +'px;"><img src="'+ temporaryCanvansUrl +'"/></div>');
                doodleImg.appendTo(panel);
                this.canvas[0].width = width;
                temporaryCanvas.remove();
            }.bind(this));

            $('body').mouseup(function(){
                clearInterval(this.moving);
            }.bind(this));
        }
    };

    return{
        Doodle : Doodle
    }
});
