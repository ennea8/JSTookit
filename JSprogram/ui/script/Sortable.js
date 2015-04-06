/**
	这是jQuery Sortable的一个简化。 
	以类的形式包装
	@Class Sortable
	
	@param selector {String}	选择器  指定Sortable容器
	@param options  {Object}    其中items项指定子元素 默认为 'div'
	
	@example
		Sortable('#s',{
			items:'div'		
		})
				
		或
		
		new Sortable('#s',{
			items:'div'		
		})

*/
function Sortable(selector, options) {
    if (this.constructor !== Sortable) return new Sortable(selector, options)

    this.init(selector, options)
}

Sortable.prototype = {
    constructor: Sortable,
    init: function (selector, options) {
        var self = this;
        this.options = options;
		this.options.items=this.options.items||'div'

        var element = $($(selector)[0]) //暂时仅考虑一个
        this.element = element


        //Get the items
        this.refresh();

        if (!(/(relative|absolute|fixed)/).test($(element).css('position'))) $(element).css('position', 'relative');

        this.floating = this.items.length ? (/left|right/).test(this.items[0].item.css('float')) : false;

        $(this.options.items, element).bind("mousedown", function (event) {
            return self._mouseStart(event);
        })

        this.element.attr('unselectable', 'on');
    },
    _mouseStart: function (event) {
        var self = this;

        if (0) {
            return;
        }
        log('mousestart')

        this.currentItem = $(event.target);


        //helper
        this.helper = this.currentItem.clone()
        if (!this.helper.parents('body').length) this.helper.appendTo(this.currentItem[0].parentNode).css({
            position: 'absolute',
            clear: 'both'
        })
        //.css({left:'10px',background:'blue'})

        //data
        this.helperProportions = {
            width: this.helper.outerWidth(),
            height: this.helper.outerHeight()
        }; //Save and store the helper proportions

        //log(event.target.id)


        $.extend(this, {
            offsetParent: this.helper.offsetParent(),
            offsets: {
                absolute: this.currentItem.offset()
            },
            mouse: {
                start: {
                    top: event.pageY,
                    left: event.pageX
                }
            },
            margins: {
                top: parseInt(this.currentItem.css("marginTop")) || 0,
                left: parseInt(this.currentItem.css("marginLeft")) || 0
            }
        });

        //The relative click offset
        this.offsets.parent = this.offsetParent.offset();
        this.clickOffset = {
            left: event.pageX - this.offsets.absolute.left,
            top: event.pageY - this.offsets.absolute.top
        };

       
		//helper相对于父元素的位置 绝对定位需要减去margin
		this.originalPosition = { 
            left: this.offsets.absolute.left - this.offsets.parent.left - this.margins.left,
            top: this.offsets.absolute.top - this.offsets.parent.top - this.margins.top
        }

        this.offset = {
            left: event.pageX - this.originalPosition.left,
            top: event.pageY - this.originalPosition.top
        };

        //Save the first time position
        $.extend(this, {
            position: {
                current: {
                    top: event.pageY - this.offset.top,	//相对父元素
                    left: event.pageX - this.offset.left
                },
                absolute: {
                    left: event.pageX - this.clickOffset.left,//相对文档
                    top: event.pageY - this.clickOffset.top
                },
                dom: this.currentItem.prev()[0]
            }
        });


        //place holder 设置和currentItem一样的大小和尺寸
        this.placeholderElement = this.currentItem
        this.placeholder = $('<div></div>')
        .addClass(this.options.placeholder)
        .appendTo('body').css({
            position: 'absolute'
        }).css(self.currentItem.offset()).css({
            width: self.currentItem.outerWidth(),
            height: self.currentItem.outerHeight()
        }).css({
            border: 'solid red 1px'
        });

		
        $(this.currentItem).css('visibility', 'hidden');

        this.initialized = false; //鼠标

		//------------鼠标事件------------------------------------
		
		//维护 this 为Sortable对象本身
        this._mouseMoveDelegate = function (event) {
            return self._mouseDrag(event);
        };
        this._mouseUpDelegate = function (event) {
            return self._mouseStop(event);
        };
        $(document).bind('mousemove', this._mouseMoveDelegate)
				   .bind('mouseup', this._mouseUpDelegate);


        self._mouseDrag(event) //触发mouse drag ！！！初始化helper的位置

        this.dragging = true;

    },
    _mouseStop: function (event) {
        $(document).unbind('mousemove', this._mouseMoveDelegate)
				   .unbind('mouseup', this._mouseUpDelegate);
        //this.started = false;
        event.preventDefault();

        $(this.currentItem).css('visibility', '');
        this.placeholder.remove();
        this.helper.remove();

        this.dragging = false;

    },
    _mouseDrag: function (event) {
        var self = this

        //Compute the helpers position
        this.position.current = {
            top: event.pageY - this.offset.top,
            left: event.pageX - this.offset.left
        };
        this.position.absolute = {
            left: event.pageX - this.clickOffset.left,
            top: event.pageY - this.clickOffset.top
        };

		//移动helper
		this.helper.css({
            left: this.position.current.left + 'px',
            top: this.position.current.top + 'px'
        }); // Stick the helper to the cursor

        //Rearrange
        for (var i = this.items.length - 1; i >= 0; i--) {
            var intersection = this.intersectsWithEdge(this.items[i]);
            if (!intersection) continue;

            if (this.items[i].item[0] != this.currentItem[0] //cannot intersect with itself
            && this.currentItem[intersection == 1 ? "next" : "prev"]()[0] != this.items[i].item[0] //no useless actions that have been done before
            && !contains(this.currentItem[0], this.items[i].item[0]) //no action if the item moved is the parent of the item checked
            && (this.options.type == 'semi-dynamic' ? !contains(this.element[0], this.items[i].item[0]) : true)) {

                this.direction = intersection == 1 ? "down" : "up";
                this.rearrange(event, this.items[i]);
                //this.propagate("change", e); //Call plugins and callbacks
                break;
            }
        }



        return false;

    },
    intersectsWithEdge: function (item) {
        var x1 = this.position.absolute.left,
            x2 = x1 + this.helperProportions.width,
            y1 = this.position.absolute.top,
            y2 = y1 + this.helperProportions.height;
        var l = item.left,
            r = l + item.width,
            t = item.top,
            b = t + item.height;

        if (!(y1 + this.clickOffset.top > t && y1 + this.clickOffset.top < b && x1 + this.clickOffset.left > l && x1 + this.clickOffset.left < r)) return false;

        if (this.floating) {
            if (x1 + this.clickOffset.left > l && x1 + this.clickOffset.left < l + item.width / 2) return 2; //左半部分
            if (x1 + this.clickOffset.left > l + item.width / 2 && x1 + this.clickOffset.left < r) return 1; //右侧相交
        } else {
            if (y1 + this.clickOffset.top > t && y1 + this.clickOffset.top < t + item.height / 2) return 2;
            if (y1 + this.clickOffset.top > t + item.height / 2 && y1 + this.clickOffset.top < b) return 1;
        }

    },
    refresh: function () {
        this.refreshItems();
        this.refreshPositions();
    },
    refreshItems: function () {
        this.items = [];
        this.containers = [this];
        var items = this.items;
        var queries = [$(this.options.items, this.element)];
        for (var i = queries.length - 1; i >= 0; i--) {
            queries[i].each(function () {
                $.data(this, 'sortable-item', true); // Data for target checking (mouse manager)
                items.push({
                    item: $(this),
                    width: 0,
                    height: 0,
                    left: 0,
                    top: 0
                });
            });
        };

    },
    refreshPositions: function (fast) {
        for (var i = this.items.length - 1; i >= 0; i--) {
            var t = this.items[i].item;
            if (!fast) {
                this.items[i].width = t.outerWidth();
                this.items[i].height = t.outerHeight();
            }

            var p = t.offset();
            this.items[i].left = p.left;
            this.items[i].top = p.top;
        };
    },
    rearrange: function (e, i, a) {
        //dom操作
        a ? a.append(this.currentItem) : i.item[this.direction == 'down' ? 'before' : 'after'](this.currentItem);

        this.refreshPositions(true); //Precompute after each DOM insertion, NOT on mousemove
        if (this.placeholderElement) this.placeholder.css(this.placeholderElement.offset());
        if (this.placeholderElement && this.placeholderElement.is(":visible")) this.placeholder.css({
            width: this.placeholderElement.outerWidth(),
            height: this.placeholderElement.outerHeight()
        });
    }

}

function contains(a, b) {
    var safari2 = $.browser.safari && $.browser.version < 522;
    if (a.contains && !safari2) {
        return a.contains(b);
    }
    if (a.compareDocumentPosition) return !!(a.compareDocumentPosition(b) & 16);
    while (b = b.parentNode)
    if (b == a) return true;
    return false;
};