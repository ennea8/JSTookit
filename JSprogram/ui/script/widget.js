/*!
 * jQuery UI Widget 1.8.2
 *
 * Copyright (c) 2010 AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * http://docs.jquery.com/UI/Widget
 */
(function( $ ) {

$.widget = function( name, base, prototype ) {
	var namespace = name.split( "." )[ 0 ],
		fullName;
	name = name.split( "." )[ 1 ];
	fullName = namespace + "-" + name;
	
	//alert(fullName)
	if ( !prototype ) {
		prototype = base;
		base = $.Widget;
	}

	$[ namespace ] = $[ namespace ] || {};
	$[ namespace ][ name ] = function( options, element ) {
		// allow instantiation without initializing for simple inheritance
		//alert("$[ namespace ][ name ]")
		if ( arguments.length ) {
			this._createWidget( options, element );
		}
	};

	var basePrototype = new base();
	// we need to make the options hash a property directly on the new instance
	// otherwise we'll modify the options hash on the prototype that we're
	// inheriting from
	$.each( basePrototype, function( key, val ) {
		if ( $.isPlainObject(val) ) {
			basePrototype[ key ] = $.extend( {}, val );
		}
	});
	basePrototype.options = $.extend( {}, basePrototype.options );
	$[ namespace ][ name ].prototype = $.extend( true, basePrototype, {
		namespace: namespace,
		widgetName: name,
		widgetEventPrefix: $[ namespace ][ name ].prototype.widgetEventPrefix || name,
		widgetBaseClass: fullName
	}, prototype );

	$.widget.bridge( name, $[ namespace ][ name ] );
};

$.widget.bridge = function( name, object ) {
	$.fn[ name ] = function( options ) {
		var isMethodCall = typeof options === "string",
			args = Array.prototype.slice.call( arguments, 1 ),
			returnValue = this;	//默认为jquery对象

		// allow multiple hashes to be passed on init
		options = !isMethodCall && args.length ?
			$.extend.apply( null, [ true, options ].concat(args) ) ://?
			options;

		// prevent calls to internal methods
		if ( isMethodCall && options.substring( 0, 1 ) === "_" ) {
			return returnValue;
		}

		if ( isMethodCall ) {
			this.each(function() {
				var instance = $.data( this, name ),
					methodValue = instance && $.isFunction( instance[options] ) ?
						instance[ options ].apply( instance, args ) :
						instance;
				if ( methodValue !== instance && methodValue !== undefined ) {
					returnValue = methodValue;
					return false;//停止each
				}
			});
		} else {
			this.each(function() {
				var instance = $.data( this, name );
				if ( instance ) {
					if ( options ) {
						instance.option( options );
					}
					instance._init();
				} else {
					$.data( this, name, new object( options, this ) );//初始化 
				}
			});
		}

		return returnValue;
	};
};

$.Widget = function( options, element ) {
	// allow instantiation without initializing for simple inheritance
	if ( arguments.length ) {
		this._createWidget( options, element );
	}
};

$.Widget.prototype = {
	widgetName: "widget",
	widgetEventPrefix: "",
	options: {
		disabled: false
	},
	_createWidget: function( options, element ) {
		//alert("before create")

		// $.widget.bridge stores the plugin instance, but we do it anyway
		// so that it's stored even before the _create function runs

		this.element = $( element ).data( this.widgetName, this );//!!
		//$.data( element, this.widgetName, this );//this为$[ui][button]对象
		//this.element = $( element );//dom 的 jquery引用

		this.options = $.extend( true, {},
			this.options,
			$.metadata && $.metadata.get( element )[ this.widgetName ],//
			options );

		var self = this;
		//alert("before create")
		this._create();
		this._init();
	},
	_create: function() {},
	_init: function() {},

	widget: function() {
		return this.element;
	},

	option: function( key, value ) {
		var options = key,
			self = this;

		if ( arguments.length === 0 ) {
			// don't return a reference to the internal hash
			return $.extend( {}, self.options );
		}

		if  (typeof key === "string" ) {
			if ( value === undefined ) {
				return this.options[ key ];
			}
			options = {};
			options[ key ] = value;
		}

		$.each( options, function( key, value ) {
			self._setOption( key, value );
		});

		return self;
	},
	_setOption: function( key, value ) {
		this.options[ key ] = value;
		return this;
	},
	//////////////////////////////////////////////
	get:function(key){
		return this[key];
	},
	set:function(key,value){
		this[key]=value;
	},
	self:function(){
		return this;
	},
	trigger:function(){
		this.element.trigger.apply(this.element,arguments);
		return this.element;
	},
	bind:function(){
		this.element.bind.apply(this.element,arguments);
		return this.element;
	}
	


};

})( jQuery );
