(function(){
	var log;
	if(window.console && console.log){
		log=function(msg,level){
			console.log(msg)		
		}
	}else{	//only after dom ready
		
		log=function (msg,level){
			var div=document.createElement("div");				
			div.innerHTML="<div class=loglevel-"+level+">"+msg+"</div>"
			document.getElementById('log-content').appendChild(div)				
		}

		var addStyle=function (text){
			var styleNode = document.createElement('style');
		   styleNode.type = "text/css";
		   // browser detection (based on prototype.js)
		   if(!!(window.attachEvent && !window.opera)) {
				styleNode.styleSheet.cssText = text;
		   } else {
				var styleText = document.createTextNode(text);
				styleNode.appendChild(styleText);
		   }
		   document.getElementsByTagName('head')[0].appendChild(styleNode);
		
		},
		div=document.createElement("div"),
		s=[];

		a='id="log-wrap" style="position:absolute;right:1em;top:2em;width:200px;height:200px; background:#999;"';			
			
		s[s.length]="<div "+a +">"
			s[s.length]='<div id="log-bottom" style="position:absolute;width:100%;right:0;top:-22px; /*border:solid red 1px;*/">'
			s[s.length]='<button id="log-clear" style="width:50px;float:right;">clear</button>'
			s[s.length]='</div>'
		s[s.length]='<div id="log-content" style="overflow-y:auto;height:100%;width:100%;top:20px;"></div>'				
		s[s.length]='</div>'
		
		div.innerHTML=s.join('')
		
		document.body.appendChild(div)	
		document.getElementById('log-clear').onclick=function(){
			document.getElementById('log-content').innerHTML=''
		}
		var style=[]
		style[style.length]='#log-wrap{	font-size:1.3em;}'
		style[style.length]='.loglevel-1{color:red;	}'
		style[style.length]='.loglevel-2{color:blue;}'
		style[style.length]='.loglevel-3{color:yellow;}'
		style=style.join('\n')

		addStyle(style)

		//alert(style)

	}

	window.log=log
})()
