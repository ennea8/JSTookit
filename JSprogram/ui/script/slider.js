
/**

 2011-5-3 增加 _init函数 增加 enable选项及函数
 */

(function( $ ) {

$.widget( "ui.slider", {
	options: {
		passedClass:"passed",
		barClass:"bar",
		percent:0,
		shape:"v",	//h v 或从 shap属性中取
		enable:'true'
	},
	_create: function() {
		var self = this,
			options = this.options;

		var shape = this.element.attr("shape")||options.shape||"v";
		
		this._bar = $(".bar",this.element);
        this._passed = $(".passed",this.element);
        this.shape = shape;

		if(this.shape == 'v'){
            this._total= Math.abs(this.element.height()-this._bar.height());
        }else{
            this._total= Math.abs(this.element.width()-this._bar.width());
        }

		//trace(this._total)

        this._step = this._total / 100;


 
        this._bar.bind("mousedown",function(event){
            if(options.enable){
				return self._mouseStart(event);	
			}
					
			//e.preventDefault();
            //slider._startDrag(e);
			//self()
        });

		this.started = false;
	},
	_init:function(){
		var self = this,
			options = this.options;

		//初始化
		this.setPercent(options.percent);

		self.element.trigger("slider:init",{percent:options.percent});

	},
	_mouseStart:function(event){
		event.originalEvent = event.originalEvent || {};
		if (event.originalEvent.mouseHandled) { return; }
		
		var self = this,
			options = this.options;

		this.started = true; //开始拖动	

		//记录位置
		self.pos = self._bar.position();
        self.startPos=[
            self.pos.left,
            self.pos.top
        ];
        self.startMos=[
            event.pageX,
            event.pageY
        ];

		// these delegates are required to keep context
		this._mouseMoveDelegate = function(event) {
			return self._mouseDrag(event);
		};
		this._mouseUpDelegate = function(event) {
			return self._mouseStop(event);
		};
		$(document)
			.bind('mousemove', this._mouseMoveDelegate)
			.bind('mouseup', this._mouseUpDelegate);


		event.preventDefault();
		event.originalEvent.mouseHandled = true;
		return true;
     },
    _mouseDrag:function(event){
		var self = this,
		options = this.options;
		  event.preventDefault();

         var currentMos = [
             event.pageX,
             event.pageY
         ],t=0;
         
         if(this.shape == "v"){
            t = self.startPos[1]+currentMos[1] - self.startMos[1];
         }else{
             t = self.startPos[0]+currentMos[0] - self.startMos[0];
         }
         if(t>self._total){
             t = self._total;
         }else if(t<0){
             t = 0;
         }
         
         var per = 100-Math.round(100*t/self._total);
         if(per>100 || per == Infinity){
             per = 100;
         }else if(per <0 || isNaN(per)){
             per = 0;
         }
         
         self.setPercent(per);
         self.element.trigger("slider:drag",{percent:per});


     },
	_mouseStop:function(event){
		 var self = this;
		//options = this.options;
		//alert('stop')

		$(document)
			.unbind('mousemove', this._mouseMoveDelegate)
			.unbind('mouseup', this._mouseUpDelegate);		
        self.started = false;
		event.preventDefault();
		self.element.trigger("slider:drop");
     },
	setPercent:function(v){
		var self = this,
		options = this.options;

		if(typeof v !=="number"){
            return;
        }
        this.percent = v;
        if(this.shape == "v"){
            this._bar.css({"top":this._total - v*this._step});
            this._passed.css({"height":v*this._step+2});
        }else{
            this._bar.css({"left":this._total - v*this._step});
            this._passed.css({"width":v*this._step+2});
        }

        return self;	 
	},
	//直接设置值时调用 然后根据 slider:setValue 更新UI
	setValue:function(v){
		var self = this;
		this.setPercent(v);
		self.trigger("slider:setValue",{percent:v});
	
	},
	getValue:function(){
	
		return this.percent;
	},
	enable:function(){
		this.options.enable=true;
	}
	

});


}(jQuery));
