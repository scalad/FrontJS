/**
 * Created by d on 2016/9/17.
 */
define(['jquery'],function($){
    function Draw(){
        this.cfg = {

        };
        this.maxX = 0;
        this.minX = 9999;
        this.maxY = 0;
        this.minY = 9999;
    }

    Draw.prototype ={
        getSomeAttribute : function(ele){
            var attrs = {};
            attrs.x = parseInt($(ele.parentNode).css('left'));
            attrs.y = parseInt($(ele.parentNode).css('top'));
            attrs.width = parseInt($(ele.parentNode).width());
            attrs.height = parseInt($(ele.parentNode).height());
            attrs.angle = Number(ele.parentElement.style.transform.slice(7,-4))*Math.PI/180;
            this.minX = Math.min(attrs.x,this.minX);
            this.minY = Math.min(attrs.y,this.minY);
            this.maxX = Math.max(attrs.x + attrs.width, this.maxX);
            this.maxY = Math.max(attrs.y + attrs.height, this.maxY);

            return attrs
        },

        drawText : function(attrs){
            attrs.context.save();
            attrs.context.fillStyle = attrs.color;
            attrs.context.font = attrs.font;
            attrs.context.textAlign = 'left';
            attrs.context.textBaseline = 'top';
            attrs.context.translate(attrs.x+attrs.width/2,attrs.y+attrs.height/2);
            attrs.context.rotate(attrs.angle);
            attrs.context.fillText(attrs.ele, -attrs.width/2,-attrs.height/2);
            attrs.context.restore();
        },

        drawImg : function(attrs){
            attrs.context.save();
            if(attrs.ele.className.indexOf('flip') != -1){          //图片翻转
                // 水平“翻转”画布
                attrs.context.translate(this.canvasWidth, 0);
                attrs.context.scale(-1, 1);
                //旋转图片
                attrs.context.translate(this.canvasWidth-attrs.x-attrs.width/2,attrs.y+attrs.height/2);
                attrs.context.rotate(-attrs.angle);
                // 下面画的图片是水平翻转的
                attrs.context.drawImage(attrs.ele, -attrs.width/2,-attrs.height/2,attrs.width,attrs.height);

            }else{
                attrs.context.translate(attrs.x+attrs.width/2,attrs.y+attrs.height/2);
                attrs.context.rotate(attrs.angle);
                attrs.context.drawImage(attrs.ele,-attrs.width/2,-attrs.height/2,attrs.width,attrs.height);
            }
            attrs.context.restore();
        },



        init : function(div, canvas){
            this.div = $(div);
            this.canvas = $(canvas);
            this.canvasWidth = this.div.width();
            this.canvasHeight = this.div.height();
            this.divWidth = this.div.width();
            this.divHeight = this.div.height();
            this.canvas.attr({width:this.canvasWidth,height:this.canvasHeight});

            this.img = this.div.find('img');
            this.text = this.div.find('span');

            if(this.canvas[0].getContext) {
                this.context = this.canvas[0].getContext('2d');
                this.context.fillStyle = '#ffffff';
                this.context.fillRect(0,0,this.canvasWidth,this.canvasHeight);

                var that  =this;
                this.img.each(function(){
                    var attrs = that.getSomeAttribute(this);
                    attrs.ele = this;
                    attrs.context = that.context;
                    if((attrs.x+attrs.width>=0) || (attrs.y+attrs.height>=0)){
                        that.drawImg(attrs);
                    }
                });
                this.text.each(function(){
                    var attrs = that.getSomeAttribute(this);
                    attrs.ele = this.innerHTML;
                    attrs.color = this.style.color;
                    attrs.font = this.style.font;
                    attrs.context = that.context;
                    that.drawText(attrs);

                });

                var canvansUrl = this.canvas[0].toDataURL('image/png');
                var canvansImg = $('<img class="unuseful" src="'+canvansUrl+'" alt="" style=" position: fixed; top: -9999px"/>');
                canvansImg.appendTo('body');
                var cwidth = parseInt(canvansImg.width());
                var cheight = parseInt(canvansImg.height());
                this.canvasWidth = Math.min(this.maxX - this.minX,this.divWidth);
                this.canvasHeight = Math.min(this.maxY - this.minY, this.divHeight);
                console.log(this.minX);
                this.canvas.attr({width:this.canvasWidth,height:this.canvasHeight});
                var att = {
                    context : this.context,
                    x :　this.minX<0 ? 0:-this.minX,
                    y : this.minY<0 ? 0:-this.minY,
                    width : cwidth,
                    height : cheight,
                    angle : 0,
                    ele : canvansImg[0]
                };
                this.drawImg(att);
                $('.unuseful').remove();
            }

        }
    };

    

    return{
        Draw : Draw
    }
});