
/**
2011-4-4
step:begin
step:stepx-deactive
step:step(x+1)-active
step:next
step:end
==================

	注意仅对单个元素如body进行选择 否则会多次抛出事件
	$("body")
		.bind("step:begin",function(){
		
		})
		.bind("step:step1-active",function(e,current,next){
		
		})
		.bind("step:step2-active",function(e,current,next){
		
		})
		.bind("step:end",function(e,current,next){
		
		})
 */

(function( $ ) {

$.widget( "ui.step", {
	options: {
		stepAll:4,
		stepBegin:1
	},
	_create: function() {
		var self = this,
			options = this.options;

		self.stepNow=options.stepBegin||1;

		self.element.trigger("step:begin");

		 //目前仅考虑为1的情况
		//self.element.trigger("step:step1-active"); //激活第一步
		//self.stepNow=1;
	
	},
	/*
	*	上一步 下一步 控制及事件触发
		param direction false ||true|| 空 false指明上一步;true|| 空为下一步
		触发事件：
		step:next 
		step:back 
		step:step1-active 
		step:step2-inactive 
		step:end 
		step:back-end
	*/
	stepNext:function(direction){
		var self = this,
			options = this.options,
			stepNext=0;
			//alert(direction)
		direction= (typeof direction=='boolean')?direction:true;
	

		stepNext=direction
			?self.stepNow+1
			:self.stepNow-1
		//var stepNext=self.stepNow+1;
			
		//边界检测
		if(direction&&self.stepNow==options.stepAll
			||!direction&&self.stepNow==1
		){
			direction?self.trigger("step:end")
					 :self.trigger("step:back-end");
		
		}else{
			var args=[self.stepNow,stepNext];
			//alert(args)

			//每个步骤区别处理
			self.trigger("step:step"+self.stepNow+"-inactive",args);
			self.trigger("step:step"+stepNext+"-active",args);

			var e =  $.Event();
			e.type = direction?"step:next"
							  :"step:back";
			self.trigger(e,args);	
			//self.trigger("step:next",args) //此种方法在IE7出错 难道不能那样同时触发多个自定义事件？奇怪
			
			direction?self.stepNow++
					 :self.stepNow--;		
		
		}
		
     },

	//返回当前步骤 如 step1
	getStepNow:function(){
		var self = this;
		return self.stepNow;	
	},
	setStepNow:function(value){
		var self = this;
		self.stepNow=value;	
	}
});

}( jQuery ) );
