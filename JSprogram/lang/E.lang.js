
/**
 * 主要定义了几个以下工具函数
 *
 * 混入式继承: 重用已有对象
 * E.mix()
 *
 * 原型继承:  用于建立对象体系
 * E.extendObj
 * E.difineObj
 *
 * 类式继承:  用于建立类体系
 * E.extendClass
 * E.difineClass
 *
 * */
(function(){
    var E = {};
	    
    E.error = function(msg){
        throw msg;
    }
    
    /**
    * 混入式
    * 说明:参考了 jQuery 及 kissy
    * 
    * @example 
    * E.mix({...})				复制到this	同名覆盖
    * E.mix({...},{...})		复制所有特性	同名覆盖
    * E.mix({...},{...},false)	复制所有特性	同名跳过
    * E.mix({...},{...},['name1','name2'])		    复制部分特性 同名覆盖
    * E.mix({...},{...},['name1','name2'],boolean)  复制部分特性
    * E.mix({...},{...},boolean,['name1','name2'])  复制部分特性
    * 
    * 
    * 
    * @param dest {Object}
    * @param src {Object}
    * @param props {Array}       指定要混入的特性
    * @param overwrite {Boolean} 是否覆盖同名 默认为true
    * @return dest {Object}
    * 
    *      
     */
    E.mix = (function(){
        var __mix = function(dest, src, p, ov){
            if (ov || !(p in dest)) 
                dest[p] = src[p];
        }
        return function(dest, src, props, overwrite){
            var p, ps, ov, 
				i, len, 
				undefined,
				_mix = __mix
            
            // 特例 E.mix({..}) 的便捷判断  
            //仅考虑 {} 及new Object()的对象，
			//未做深入的plainObject检查，增加代码及降低效率，需人为控制
            if (arguments.length == 1 && dest && dest.constructor === Object) {
                return arguments.callee(this, dest, null, true)
            }
            
            if (!src || !dest) 
                return dest;
            
            //参数调整
            if (typeof props === "boolean") {
                ov = props
                ps = overwrite
            }
            else {
                ps = props;
            }
            
            if (ov === undefined) 
                ov = true;            
            
            if (ps && ps.length) {//数组
                for (i = 0, len = ps.length; i < len; i++) {
                    p = ps[i]
                    if ((p in src)) {
                        _mix(dest, src, p, ov)
                    }
                }
            }
            else {
                for (p in src) 
                    _mix(dest, src, p, ov)
            }
            return dest;
        }        
    })()
    
    
    /**
     * 原型继承 对象体系                                      	
     * 传入一个对象,返回一个新对象,新对象的__proto__指向传入的对象   
     *                                                     
     *                                                                
     * 用法1：obj是已存在的对象                                
     * var obj={a:'aaa',b:'bbb'}                           
     * var obj2=E.extendObj(obj)                           
     *                                                     
     * 用法2：使用对象直接量 【传入的对象将不可修改 仅可能间接访问】    
     * var obj-E.extend({...})                             
     * 
     * @param obj {Object} 
     * @return {Object}    
     * 
     */
    E.extendObj = (function(f){
        return function(obj){
            f.prototype = obj;
            return new f;
        }
    })(new Function)
    
    /**
     * 定义一个对象                  
     * 传入该对象的属性方法及要继承的对象
     * 作用等同于：                 
     * var obj1={}                
     * var obj2=E.extend(obj1)    
     * E.mix(obj2,{...})          
     * 
     * @param obj 	 {Object}  
     * @param supObj {Object}     * 
     * @return a new {Object}
     */
    E.defineObj = function(obj, supObj){
        var _obj = E.extendObj(supObj)
        E.mix(_obj, obj)
        return _obj;
    }
    
    /**
     * 类式继承 类体系                                                                       
     * 为两个已存在的类建立继承关系    
     *                                                         
     * 其中uber函数的实现参考：                                                              
     * http://javascript.crockford.com/inheritance.html uber函数的最初实现                  
     * http://www.iteye.com/topic/248933 借鉴其对继承断层的处理思路(仍存有bug)                  
     * 主要改动：                                                                          
     * 通过普通函数实现而非对Function.prototype扩展                                                     
     * 删除冗余代码 优化代码                                                                 
     * 修复最近父类断层的bug及一些特殊情况的bug 增加判断                                          
     * 子类原prototype的维护 extend可以在子类原型定义之后定义                                    
     *                                                                                   
     *                                                                                   
     * @example                                                                          
     * function A(){}                                                                    
     * A.prototype.hello=function(){ 
     * 	return 'helloA';
     * }    
     *                                
     * function B(){}                                                                    
     * B.prototype.hello=function(){
     * 	return this.uber('hello')+'-helloB'
     * }  
     *                 
     * E.extend(B,A)                                                                     
     * b=new B()                                                                         
     * b.hello() // output 'helloA-helloB'                                                
     *                                                                                   
     * @param sub {Function} 已定义子类                                                    
     * @param sup {Function} 已定义父类                                                    
     * @return sub                                                                       
     * 
     */
    E.extendClass = function(sub, sup){
    
        var F = function(){
        }, subProto, supProto = sup.prototype;
        
        F.prototype = supProto;//仅继承父类的prototype 不包括实例的属性方法
        subProto = new F();//prototype
        //复制子类原prototype
        sub.prototype = E.mix(subProto, sub.prototype)
        
        subProto.constructor = sub;//维护constructor
        subProto.superClass = sup;//子类对父类的引用
        //---------------------------------------------
        //调用父类函数
        var d = {}
        subProto.uber = function(name){
            if (!(name in d)) {
                d[name] = 0;
            }
            var f, r, t = d[name], v = subProto;
            // 利用superClass来上溯
            while (t) {
                v.hasOwnProperty('superClass') && typeof v.superClass == 'function' ? 
					v = v.superClass.prototype : 
					E.error('父类不存在函数' + name)//不存在父类 不可再上溯

                // 跳过"断层"的继承点 避免重复调用
                if (v.hasOwnProperty(name)) {
                    t -= 1;
                }
            }
            
            (name in v) && typeof v[name] == 'function' ? 
				f = v[name] : //根据原型链自动上溯			
				E.error('父类不存在函数' + name)
            
            d[name] += 1;
            
            if (f === this[name]) { //使用全等! 递归调用 越过自身继续向上
                r = this.uber.apply(this, Array.prototype.slice.apply(arguments));
            }
            else {
                //找到了函数 直接执行
                r = f.apply(this, Array.prototype.slice.apply(arguments, [1]));
            }
            
            d[name] -= 1;
            
            return r;
        }
        
        //父类原型constructor修正 确保
        if (supProto.constructor === Object.prototype.constructor) {
            supProto.constructor = sup;
        }
        
        return sub;
    }
    
    /**
     * 定义一个类                                              
     * 借鉴了 prototype的调用风格                                              
     * 依赖  E.extendClass  E.mix
     * 
     * @example                            
     * A=function(){}                                        
     * A.prototype.say=function(){ 
     * 		return 'helloA'
     * }          
     * A.prototype.name='A'                                  
     *                                                       
     * B=E.defineClass({                                     
     * 	init:function(){                                      
     * 		this.name='B'                                         
     * 	},                                                    
     * 	say:function(){                                       
     * 		return this.uber('say')+'-helloB'                     
     * 	},                                                    
     * 	sayName:function(){                                   
     * 		return this.name;                                     
     * 	}                                                     
     * },A)  
     *                                                 
     * b=new B()                                             
     * alert(b.say())		//'helloA-helloB'                      
     * alert(b.sayName())	// 'B'                              
     * 
     * @require  E.extendClass  E.mix
     * 
     * @param obj {Object} 类的方法 属性             
     * @param supClass {Function}  所定义类的父类    
     * @return {Function} 新定义的类                
     * 
     * 
     */
    E.defineClass = function(obj, supClass){ //todo 调整参数位置
        function kclass(){
            this.init.apply(this, arguments);
        }
        var subProto;
        
        if (supClass) {
            E.extendClass(kclass, supClass);
            subProto = kclass.prototype;
            
            E.mix(subProto, obj)
        }
        else {
            //subProto=E.extendObj(obj)
            subProto = obj
            kclass.prototype = subProto;
        }
        
        if (subProto.constructor !== kclass) {
            subProto.constructor = kclass
        }
        return kclass
    }

 	this.E=E;   
    
}).call(this)


