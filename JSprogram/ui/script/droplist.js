
/**

 */

(function( $ ) {

//用于保存 一起初始化的dom 它们公用一个tips 
//确保只有一个的self._showStatus 为true 
//特殊情况click事件触发 自定义事件隐藏 下
//操作:tips开启-禁用-开启 -激活其它tips时 会有多个同时处于_showStatus 为true的情况
var $triggers=[]; 

$.widget( "ui.droplist", {
	options: {
		tipid:"droplist_001", //默认id
		direction:"top",	//下拉不可更改
		offset: [0, 0],	//位置调整
		data:[],		//数据
		zIndex:1000,
		disabled:false,
		event:"click,blur"
		
	},
	_create: function() {
		var self = this,
			options = this.options,
			evt=options.event;

		$triggers.push(self);

		if(!$('#'+options.tipid).get(0)){
			//alert("未创建")
			self.tip=$("<table></table>")
				.attr("id",options.tipid)
				.css({position:"absolute"})
				.appendTo(document.body)
				.hide()
		}else{//已存在			
			self.tip=$('#'+options.tipid);
		}

		self.appendData();

		evt = evt.split(/,\s*/); 
		if (evt.length != 2) {
			throw "Tooltip: bad events configuration for " + self.element.attr("type"); 
		} 
		
		//事件触发
		self.bind(evt[0], function(){
			self.show();	
		}).bind(evt[1], function(){	
			//赋值
			var v=self.tip.find('.select').html();
			if(v)
			self.element.html(v);

			self.hide();
		}); 

	},

	appendData:function(){
		var self = this,
			options = this.options;

		self.tip.html('');
		for (var i=0;i<options.data.length;i++ )
		{
			//alert(options.data[i])
			self.tip.append('<tr><td>'+options.data[i]+'</td></tr>')
		}		

		//选择事件
		self.bindForItem()
	},
	bindForItem:function(){
		var self = this;
		self.tip.find('td')
			.click(function(){
				//alert(this.innerHTML)
				self.element.html(this.innerHTML);
				self.hide()
			})
			.hover(
				function(){
					$(this).addClass('select')
					this.style.background='#aae';
				},
				function(){
					$(this).removeClass('select')
					this.style.background='#fff';
				}
			).end()
		
			.hover(function(){},function(){
			
				self.hide();
			})
	},
	show:function(){
		var self = this,
			options = this.options;

		if(options.disabled) return;//禁用 关闭

		self.appendData();//重新构造数据 html
		self.tip
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
