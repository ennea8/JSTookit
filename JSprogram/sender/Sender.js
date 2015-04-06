/*
 * 这是一个类
 * 观察者模式的一种实现方式 
 * 一个Sender对象即是一个发布者
 * 任何一个函数及具备receive方法的对象都可以是一个观察着
 * 一个Sender对象同时也可以是一个观察着，只要其实现receive方法
 * 
 * 参考:该实现受百度首页源码的启发
 * 
 * 
 * @example
 * s=new Sender()
 * 
 * observerA=(function(){
 * 	 //logic area
 * 	 function doA(){ alert('起床')}
 *   function doB(){ alert('刷牙')}
 * 	 
 *   return{
 * 			receive:function(msg){
 * 				switch(msg){
 * 				case '起床':
 * 					doA()
 * 					break;
 * 				case '吃饭':
 * 					doB()
 * 					break;
 * 				}
 * 			}
 * 	  }
 * 
 * })()
 * 
 * 
 * observerB=function(msg){
 * 		alert(msg)
 * }
 * 
 * s.addReceiver('起床',observerA,observerB)
 * 
 * s.sendMessage('起床')
 * 
 * 
 * @constructor
 * 
 */
var Sender=(function(){
	//todo 重命名 私有变量_q使其更加易读
	
	var _q='__@ReceiverQueue@__'//+Number(new Date); //定义名称		
	/*
	 * 添加接受者(订阅者) 
	 * @param name {String}
	 */
	function addReceiver(name,fn){
		var i,len,obj,
			q=this[_q][name];

		!q && (q=this[_q][name]=[])
		
		for(i=1,len=arguments.length;i<len;i++){
			obj=arguments[i]
			if(typeof obj=='function'){
				q.push(obj)		//函数入队
			//如果是一个对象 则应定义receive函数
			}else if(obj&&obj.receive&&(typeof obj.receive=='function')){
				q.push(obj)    //对象入队
			}
			
		}
	}
	/*
	 * 移除某一消息的所有接受者(订阅者) 
	 * 
	 * @param {String}
	 */
	function removeReceiver(name){
		var q=this[_q][name];
		q&& (q=[]);
	}

	//发送消息
	function sendMessage(name){
		var i,len,obj,
			q=this[_q][name],
			slice=[].slice;
			
		for(i=0,len=q.length;i<len;i++){
			obj=q[i]
			if(typeof obj=='function'){
				obj.apply(this,slice.call(arguments,0))	//this or null?
			}else if(typeof obj=='object'&& obj.receive){ //入队时已检测				
				obj.receive.apply(obj,slice.call(arguments,0))
			}
			
		}
	}		
	
	/*
	 * class
	 * 
	 * @fn {Function} 方便使一个Sender对象在创建时同时为观察者
	 */
	function Sender(fn){
		this[_q]={}	//
		
		if(fn && typeof fn=='function'){			
			this.receive=fn  //为对象添加receive方法
		}
	}
	Sender.prototype.addReceiver=addReceiver;
	Sender.prototype.removeReceiver=removeReceiver;
	Sender.prototype.sendMessage=sendMessage;
	
	return Sender;		

})()
