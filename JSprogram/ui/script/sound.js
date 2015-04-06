
/**
 * sound:enable
 * sound:disable
 * 
 */

(function( $ ) {

$.widget( "ui.sound", {

	options: {
		src:'1.swf',
		soundDiv:'sound', //放object对象的div容器
		disabled:false
	},
	_create: function() {
		var self = this,
			options = this.options;
		this.soundStr='<object width="48" height="48" align="middle" id="word-voice-home" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"><param value="sameDomain" name="allowScriptAccess"><param value="false" name="allowFullScreen"><param value="'+options.src+'" name="movie">	<param value="high" name="quality">	<param value="#ffffff" name="bgcolor">	<embed width="48" height="48" align="middle" pluginspage="http://www.adobe.com/go/getflashplayer_cn" type="application/x-shockwave-flash" allowfullscreen="false" allowscriptaccess="sameDomain" name="word-voice-home" bgcolor="#ffffff" quality="high"  src="'+options.src+'"></object>';

		//事件处理
		self.element
			.bind("sound:enable",function(){				
				self.enable();
			})
			.bind("sound:disable",function(){
				self.disable();
			})
	},
	play:function(){
		var self = this,
			options = this.options;
		
		//播放
		if(!options.disabled){		
			document.getElementById(options.soundDiv).innerHTML=this.soundStr;
		}


    },
    enable:function(){
		var self = this,
		options = this.options;

		options.disabled=false;

    },
	disable:function(){
		var self = this,
		options = this.options;

		options.disabled=true;
	}

});


}(jQuery));
