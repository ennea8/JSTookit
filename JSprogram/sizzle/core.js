/**
 * Sizzle选择器的一个简单封装。
 * 可通过扩展E.prototype来实现jQuery的插件风格 
 * 通扩展E来进行各功能模块的管理
 * 参考jQuery
 * 
 **/

(function(window,undef){
	var doc=window.document,
		docElement=doc.documentElement;
	/*
	 * 
	 * @param selector {String}  
	 * @param context  {HTMLElement | document} 
	 **/
	function E(selector, context){
		if(this.constructor!=E){
			return new E(selector, context)
		}
		this.init(selector, context)
	}

	E.prototype={
		
		/*
		 * jQuery 使用对象来模拟数组
		 * 这里直接维护一个数组
		 */
		ret:[], //存放Sizzle选择结果

		/*
		 * 初始化
		 * todo id 优化id class选择器
		 */
		init:function(selector, context){
			context=context||doc
			this.ret=E.Sizzle(selector,context) 	
		
		},
		constructor:E,

		size:function(){
			return this.ret.length;
		},
		get:function(i){
			return i.constructor==Number?
				 this.ret[i]:
				 null;			
		},
		//遍历元素
		each:function(fn){
			var i,len,
				ret=this.ret;
			for(i=0,len=ret.length;i<len;i++){
				fn.call(ret[i],i,ret[i])
			}
			
		}		
	}

	/*
	 * 插件机制 扩展E.prototype
	 * 也可以直接使用 E.prototype
	 * 
	 * @example 1
	 * 单个插件
	 * E.plug('red',function(){
	 * 	//private
	 * 
	 *  return function(){
	 * 	 //
	 *  }
	 *  
	 * }())
	 * 
	 * @example 2
	 * 多个插件
	 * E.plug({
	 * 	a:function(){},
	 *  b:function(){}
	 * 
	 * })
	 * 
	 * ----------------
	 * @name {String}
	 * @p {Function}
	 * 
	 * --------------
	 *  
	 * @name {Object} 
	 * ----------------
	 */
	E.plug=function(name,p){

		if(name&& typeof name=='object'){//plainObject 不做检查 人为控制 {...}
			p=name;
			for(var x in p){	
				alert(p[x])
				if(typeof p[x]=='function'){					
					E.debug && (x in E.prototype) ? E.error('in plug 插件重复'):null;
					E.prototype[x]=p[x]
				}
			}
		}else if(name && p && (typeof name=='string') && (typeof p=='function')){
			E.debug && (name in E.prototype) ? E.error('in plug 插件重复'):null;
			E.prototype[name]=p;
		}
		
		return 	E;
	}
	
	/*
	 * 命名空间(功能模块)管理 扩展E本身
	 * 
	 * @example
	 * 
	 * E.module('a.b.c',{
	 * 	// ...
	 * })
	 * 
	 * E.module({
	 * 	//...
	 * })
	 * --------------------------------------
	 * @param namespace {String} 'a.b.c.d'
	 * @param m {Object |Function}
	 * 
	 * or----------------------------------
	 * 
	 * @param namespace {Object}
	 * -----------------------------------------
	 */
	E.module=function(namespace,m){		
		//直接给E添加属性 忽略其它参数
		if(namespace&& typeof namespace=='object'){//plainObject 不做检查人为控制
			for(var x in namespace){ 
				E[x]=namespace[x]  // todo 冲突检测
			}
			return E;			
		}
		
		if(!namespace || !m || !(typeof namespace=='string')) 
			return;
		
		var ns=namespace.split('.'),
			g=E,		//一律加到E空间之下
			name;			

		while(name=ns.shift()){
			if(ns.length){
				g[name]=g[name] || {}
				g=g[name]
			}else{
				g[name]=m	//对象 函数
			}		
		}
		
		return E;
	}
	
	E.module({
		debug:true,
		error:function(msg){
			throw '@E: '+msg;
		}
	})
	
	E.module('io.ajax',{		
		//
		
	})

	window.E=E;
})(window)


