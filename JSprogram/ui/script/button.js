
/**
 * button:click
 * button:disable;
 * button:enable;
 */

(function( $ ) {

$.widget( "ui.button", {
	options: {
		tClass:"disable",
		state:"enable"
	},
	_create: function() {
		var self = this,
			options = this.options;
	
		if(options.state=="disable"){
			//alert("disable")
			this.disable();
		}
		//alert(options.tClass)
        this.element.click(function(){
           if(options.state == "enable"){
                self.element.trigger("button:click");
				return false;	//否则复杂情况会与自定义事件产生混乱				 
           }
        });


	},
	disable:function(){
		var self = this,
			options = this.options;

         if(!this.element.hasClass(options.tClass)){
             this.element.addClass(options.tClass);
         }
         options.state = "disable";
         this.element.trigger("button:disable");
         return this;
     },
     enable:function(){
		 	var self = this,
			options = this.options;

         this.element.removeClass(options.tClass);
         this.element.trigger("button:enable");
         options.state = "enable";
         return this;
     }

});


}( jQuery ) );
