///////////////////////////////
// ���� ������ trace����

//1: ����ģʽ 
//2: alertģʽ
//3: firebugģʽ	
//4: ����ģʽ	
debugMode=4;

debug=true;
//debug=false;


if(debugMode==1){	//alertģʽ

	trace=function (text)
	{
		alert(text)
	}

}else if(debugMode==2){//���firebug

	trace=function (text)
	{
		 if(typeof console !== "undefined" && typeof console.log !== "undefined"){
			console.log(text);
		 }
	}

}else if(debugMode==3){//����ģʽ
	if(debug)
	{
		tracerwindow = window.open('','tracerwindow','toolbar=0,status=0,scrollbars=1,resizable=0,width=300,height=500,top=1,left=1,topmargin=0,leftmargin=0');
		tracerwindow.document.write("<BODY STYLE=margin:0px>");
		tracerwindow.document.write("<OL style='color: red'>");
		tracerwindow.document.write("<b>JavaScript Debugging </b><br>");
	}

	trace=function (text)
	{
		if(!debug) return;
		text = "<li><font color='black'><small>"+text+"</small></font><br>";
		tracerwindow.document.write(text); 
	}
	trace("begin debug");

}else if(debugMode==4){//����ģʽ

	trace=function(){}
}


function pObj(Obj,returnStr){
	
	var str='{'; 
	
	for(var x in Obj){
		str+=x+': '+Obj[x]+'\n';	
	}

	str +='}'

	if(returnStr)
		return str;
	else
		alert(str);
} 


if(typeof console=='undefined' || typeof console.log=='undefined'){
	console={}
	console.log=function(){}	
}
