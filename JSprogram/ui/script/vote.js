
/**
 * vote:value-set

	图片命名需为 /[^./]+\.(gif|jpeg|jpg)$/形式
	星号图片class命名 star1 star2 star3
 */

(function( $ ) {

$.widget( "ui.vote", {
	options: {
			img_default:"star-default.gif", //默认图片名
			img_hover:"star-hover.gif",	//鼠标选择
			img_selected:"star-selected.gif",//已选中
			value:0				//初始化选择的星级
	},
	_create: function() {
		var self = this,
			options = this.options;

		$('img',self.element)
			.hover(function(){
				var index=this.className.charAt(4); //类名 固定为 star1 star3 形式
				self.hoverActive(index);
				
			},
			function(){
				self.hoverActive(0);
			}			
			)
			.click(function(){
				self.trigger('vote:value-set',this.className.charAt(4))//不可用$(this)
				//alert(this.className)
			}) 
		
		//初始值
		self.setValue(options.value)

	},
	//index 为要设置的星级值
	hoverActive:function(index){
		var self = this,
			options = this.options;
		$('img',self.element).each(function(i){
			
			trace(this.src)
			//var rname=new RegExp('')
			var srcNew=this.src.replace(/[^./]+\.(gif|jpeg|jpg)$/,
				
			(i<index ? options.img_hover:((i < options.value) ? options.img_selected:options.img_default)
				)
			)
			trace(srcNew)
			this.src=srcNew;
			
		})	
		
		//alert(i)
		
	},
	setValue:function(index){
		var self = this,
		options = this.options;

		//alert(index)
		//alert($('img',self.element).length)

		$('img',self.element).each(function(i){
			
			var srcNew=this.src.replace(/[^./]+\.(gif|jpeg|jpg)$/,				
			(i<index ? options.img_selected:options.img_default)
				)
			//alert(srcNew)
			this.src=srcNew;
			
		})	
	
	},
	getValue:function(){
		//var self = this,
		options = this.options;
		return options.value;
	}

});


}(jQuery));
