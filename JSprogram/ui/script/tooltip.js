
/**
 */

(function( $ ) {

//用于保存 一起初始化的dom 它们公用一个tips 
//确保只有一个的self._showStatus 为true 
//特殊情况click事件触发 自定义事件隐藏 下
//操作:tips开启-禁用-开启 -激活其它tips时 会有多个同时处于_showStatus 为true的情况
var $triggers=[]; 

$.widget( "ui.tooltip", {
	options: {
		tipid:"tip001",
		direction:"left",
		offset: [0, 0],
		event:"tip:show,tip:hide",
		html:"提示",		//字符串如 :$("<div>$$$</div>").html()
		zIndex:1000,
		disabled:false
		
	},
	_create: function() {
		var self = this,
			options = this.options,
			evt=options.event;

		$triggers.push(self);

		if(!$('#'+options.tipid).get(0)){
			//alert("未创建")
			self.tip=$("<div></div>")
				.attr("id",options.tipid)
				.css({position:"absolute"})
				.appendTo(document.body)
				.hide()
		}else{//已存在
			
			self.tip=$('#'+options.tipid);
		}

		evt = evt.split(/,\s*/); 
		if (evt.length != 2) {
			throw "Tooltip: bad events configuration for " + self.element.attr("type"); 
		} 
		
		//alert(evt)
		// trigger --> show  
		self.bind(evt[0], function(){
			//alert("show")
			self.show();	
			//return false;
		// trigger --> hide
		}).bind(evt[1], function(){	
			self.hide();
			//return false;
		}); 

		//self.bind("tip:show",function(){ //重复
		//	self.show();		
		//})
		
	},
	show:function(){
		var self = this,
			options = this.options;
		//alert('show')
		if(options.disabled) return;//禁用 关闭

		//alert(typeof options.html)			
		self.tip.html(options.html)
			.css(self.getPosition())
			.css('z-index',options.zIndex)
			.show()		
	
	

		//确保只有一个处于激活状态
		self.closeAllShowStatus();
		
		self._showStatus=true; //记录状态
	},
	hide:function(){
		var self = this;
		self.tip.hide();
		self._showStatus=false;
	},
	closeAllShowStatus:function(){
		for(i=0;i< $triggers.length;i++) 
			$triggers[i]._showStatus=false;
	},
	getPosition:function(){
		var self = this,
			options = this.options;
		var tip=self.tip,
			trigger=self.element;
		 
		
		
		//alert(tip)
		var top=trigger.offset().top;
			left=trigger.offset().left;
		
		switch(options.direction){
			case "left":
				left+=trigger.width()+options.offset[0]
				top=top+options.offset[1]
				break;
			
			case "right":
				left-=(trigger.width()+options.offset[0])
				top=top+options.offset[1]
				break;
			case "top":
				left+=options.offset[0]
				top+=(trigger.height()+options.offset[1])
				break;
			case "bottom":
				left+=options.offset[0]
				top-=(options.offset[1]) //tip高为0 通过offset对位置进行调整 
				//alert(top) 
				// alert(tip.find(":first-child").height())
				break;
			
		
		}
		//alert(left+" "+top)
		return {top:top,left:left}
	
	},

	disable:function(){
		var self = this,
			options = this.options;

		options.disabled=true;

		if(self._showStatus){
			self.hide();
			self._beforeDisable=true; //保存禁用前的状态
		}else{
			self._beforeDisable=false;
		}
     },
    enable:function(){
		 var self = this,
		options = this.options;
	
		options.disabled=false;

		//alert("self._beforeDisable "+self._beforeDisable)
		if(self._beforeDisable){
			self.show()
			self._beforeDisable=false; //回到默认值！
		}

		
     }

});


}( jQuery ) );
