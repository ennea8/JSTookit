/*
// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
	这里把它包装为一个widget	 2011-5-5

	1.将所选择的dom元素与 id为 模板绑定
	2.传入数据 更新dom的innerHTML
	限定： 模板必有唯一id	: !/\W/.test(str)
	
	特别注意:	
			1. 模板id命名不可含中划线 
			2. 模板中 标签属性命名 只可用单引号 不可用单引号

	步骤一：
	//将所选择的#containerId' dom元素与 id为 tmpl_1 的模板绑定
	$('#containerId').tmpl({id:'containerId_tmpl'})	
	步骤二：
	//设置id 为 containerId 的innerHTML 内容为模板解析后的html片段
	$('#containerId').tmpl('update',{data})
*/

(function( $ ) {
	var cache = {};
	//cache = {}; //debug

	$.widget( "ui.tmpl", {
		options: {
			id:""//模板id
		},
		 
		 _create: function() {
			//alert(this.options.id)
		},	/* */
		update:function(data){
			var self = this,
				options = this.options;
			var html=$.tmpl(options.id,data) //调试
			//alert(html)
			self.element.html(html)

		
		}
	})

	$.tmpl = function tmpl(str, data)
	{
		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.

		//alert(str+' '+!/\W/.test(str))
		var fn = !/\W/.test(str) //仅字母和数字
			?				
				cache[str] = cache[str] ||
			  $.tmpl(document.getElementById(str).innerHTML)	//递归调用
			:
		 
		  // Generate a reusable function that will serve as a template
		  // generator (and which will be cached).
		  //模板->js函数
		new Function("obj",
			"var p=[],print=function(){p.push.apply(p,arguments);};" +
		   
			// Introduce the data as local variables using with(){}
			"with(obj){p.push('" +
		   
			// Convert the template into pure JavaScript
			str
			  .replace(/[\r\t\n]/g, " ")
			  .split("<%").join("\t")
			  .replace(/((^|%>)[^\t]*)'/g, "$1\r")
			  .replace(/\t=(.*?)%>/g, "',$1,'")
			  .split("\t").join("');")
			  .split("%>").join("p.push('")
			  .split("\r").join("\\'")
		  + "');}return p.join('');");
		 
		 //alert(fn)
		// Provide some basic currying to the user
		return data ? fn( data ) : fn;//前者执行js函数 后者返回js函数
	};



}( jQuery ) );

