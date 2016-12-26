/**
 * Created by d on 2016/9/28.
 */
define(['jquery'],function($){
   function Rotate(){
        this.cfg = {
            rotateBox : null,
            handle : null
        };
    }

    Rotate.prototype = {
        convertAngle : function(a){
            return a/Math.PI*180
        },

        onMove : function(){
            //console.log(this);
            this.angle2 = this.convertAngle(Math.atan2(this.oy - this.my, this.mx - this.ox));      //计算鼠标和元素中心连线 与 水平线夹角
            this.angle = this.angle1 - this.angle2 + this.oldDeg;                                        //计算旋转角度
            this.rotateBox.css({
                transform : "rotate(" + this.angle + "deg)"
            });
        },


        init : function(cfg){
            //console.log(this);
            $.extend(this.cfg,cfg,{});
            this.rotateBox = this.cfg.rotateBox;
            if(this.cfg.handle){
                this.handle = this.cfg.handle;
            }else{

            }
            this.handle.mousedown(function(e){
                var e = window.event || e;
                this.ox = this.rotateBox.width()/2+this.rotateBox.offset().left;    //计算元素中心坐标
                this.oy = this.rotateBox.height()/2+this.rotateBox.offset().top;
                this.x1 = this.handle.offset().left+this.handle.width()/2;          //计算手柄坐标
                this.y1 = this.handle.offset().top+this.handle.height()/2;
                this.angle1 = this.convertAngle(Math.atan2(this.oy-this.y1,this.x1-this.ox));//计算元素中心和手柄连线 与 水平线夹角
                if(this.rotateBox[0].style.transform){
                    this.oldDeg = Number(this.rotateBox[0].style.transform.slice(7,-4)) % 360;      //获取元素初始角度
                }else{
                    this.oldDeg = 0;
                }

                this.moving = setInterval(this.onMove.bind(this),40);
            }.bind(this));

            document.addEventListener('mousemove',function(e){
                var e = window.event || e;
                this.mx = e.pageX;                  //获取移动时鼠标位置坐标
                this.my = e.pageY;
            }.bind(this),false);

            document.addEventListener('mouseup',function() {
                clearInterval(this.moving);
            }.bind(this),false);
        }
    };

    return {
        Rotate : Rotate
    }
});