/*
 * 时间管理对象
 * 可以管理多个任务使其立即执行(当前舞台)或进入任务队列
 * 仅需简单调用 play方法即可实现                        
 *                                                        
 * @example 1                                                                        
 *                                                        
 * //传入一函数     直接执行                                       
 * Timer.play(function(){	                                   
 * 	var i=0                                            
 * 	return function(){                                 
 * 		i++                                            
 * 		if(i<10){                                      
 * 			console.log('hello')                       
 * 			return true  //继续                              
 * 		}				                               
 * 		return false //停止                            
 * 	}                                                  
 * 	                                                   
 * }())                                                   
 *  
 * @example 2
 * //传入一对象   此对象必须定义step方法                                           
 * Timer.play({                                               
 * 	queue:true, //决定是立即执行 还是入队列     默认为false立即执行                              
 * 	step:function(){                                   
 * 		if(...) return false;   //返回false 停止执行                      
 *                                                        
 * 		...                                            
 *                                                        
 * 		return true;   //继执行                                
 * 	}	                                               
 * })                                                     
 */


Timer=(function(){
	//todo 私有变量命名为TIMER_开头 增加可读性
	
	var timers=[],	   //当前正在执行的函数列表  舞台
		queue=[],	   //队列中的函数列表             任务队列
		interval=1000,
		timerId=null;
		
		//private
		//borrow from jQuery
		function _tick(){
			var timer,
				i ;
			console.log("timers "+ timers.length)
			console.log('queue.length '+queue.length)

			
			for (i=0; i <timers.length ; i++ ) {//此length不可缓存 数组长度是变化的！！！
				timer = timers[ i ];
				//console.log("in _tick loop "+ timers.length+' '+i)
				// Checks the timer has not already been removed
				if ( !timer() && timers[ i ] === timer ) {
					timers.splice( i--, 1 );
				}
			}	

			if ( !timers.length ) {
				_stop();
			}
		
		}

		//private
		function _stop(){
			if(queue.length){ //从队列取出一个继续执行
				timers.push(queue.shift())
			}else{
				clearInterval(timerId );
				timerId = null;		
			}
			
		}
		//private
		function _start(){
			timerId = setInterval( _tick, interval );	
		}

	return {

		/*
		 * 把一个任务添加到舞台 或任务队列 
		 * 如果定时器为开则开启 
		 * ------------------------------------------------------------
		 * @param o {Function}
		 * 	return {true} to continue
		 *  return {false} to stop itself
		 * 
		 * or----------------------------------------------------------
		 * 
		 * @param o {Function |Object} (the Object must have a step method)
		 * 
		 *  thestep method must
		 *  return {true} to continue
		 *  return {false} to stop itself
		 *  -------------------------------------------------------------
		 */
		play:function(o){	

			if(!o) return; //null '' undefined 0

			if(typeof o=='function'){
				if(o()&& timers.push(o)&& !timerId){
					_start()
				}		
			}else if(typeof o=='object' && typeof o.step=='function'){
			//如果传入对象 该对象必须定义step发方法
				if(o.queue===true){//入队	//默认为false不入队直接执行
					queue.push(o.step)
					if(!timerId){ //一开始直接入队列 定时器尚未运行情况
						_start()
					}
					//console.log("入队 "+queue)
				}else{
					Timer.play(o.step)//直接执行
				}		
			}

		},
		/*
		 * 停止 可以通过 start继续进行 
		 * 缺点：未通知动画对象保存其状态 再运行时可能已超时
		 */
		pause:function(){
			clearInterval(timerId );
			timerId = null;
		},
		start:function(){
			_start()
		},
		/*
		 * 停止并清空 舞台及队列
		 */
		clear:function(){
			this.pause()
			timers=[]	   //正在执行的函数列表
			queue=[]
		},
		setIntervalTime:function(num){
			if(num && num.costructor==Number){
				interval=num;
			}		
		}
	
	
	}

})()
