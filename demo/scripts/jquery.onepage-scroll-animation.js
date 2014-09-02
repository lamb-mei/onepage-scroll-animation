/*!
 * jquery.onepage-scroll-animation v1.0
 * Url: https://github.com/lamb-mei/onepage-scroll-animation
 * Copyright (c) lamb-mei — http://lamb-mei.com
 * License: MIT
 */

;(function ($, window, document) {
    'use strict';

    var debug       = false
    

    function trace(msg){
        if(console && debug) {console.log(msg)}
    }

    // Main function
    $.fn.onePageScrollAnimation = function (options) {

        trace("onePageScrollAnimation"); 
        if (!$.data(document.body, 'onePage-Scroll-Animation')) {
            $.data(document.body, 'onePage-Scroll-Animation', true);
            $.fn.onePageScrollAnimation.init(options);
        }
       return $.fn.onePageScrollAnimation.instance;
    };

    // Defaults
    $.fn.onePageScrollAnimation.defaults = {
        targetID                : 'html,body',      // Element ID
        section                 : [
                                    {id:"section1"   , px:0 },
                                    {id:"section2"   , px:100 },
                                    {id:"section3"   , px:200 },
                                    {id:"section4"   , px:300 }
                                    ],
        useNear                 : false,
        near                    : 50,
        duration                : 500,
        easing                  : "swing",                
        onLastAutoToBottom      :false 
    };

    $.fn.onePageScrollAnimation.instance = null




    $.fn.onePageScrollAnimation.init = function (options) {
        
        // var instance = null;
        var o = $.fn.onePageScrollAnimation.settings = $.extend({}, $.fn.onePageScrollAnimation.defaults, options),
            $target = o.targetID,
            rang = [],
            sectionIDs = [],
            _hasZero =false;

        var onAnim      = false
        var enable      = true

        if( ! Object.prototype.toString.call( o.section ) === '[object Array]' ) {
           throw new Error("section must be Array")
        }


        $(document).on('mousewheel', function(event) {

            // console.log(event.deltaX, event.deltaY, event.deltaFactor);

                var delta = event.deltaY
            
                if (delta > 0 ) {
                    mousewheelTouch(-1)
                }
                else {
                    mousewheelTouch(1)
                }
                // event.stopImmediatePropagation();
                event.stopPropagation();
                event.preventDefault();

            
        });

        

        o.section.map(function(item){
            
            var _px = item.px;
            var _id = item.id;

            if(_px == undefined) throw new Error("section must has 'px' ")
            if(_id == undefined) throw new Error("section must has 'id' ")
            if(_px == 0){
                _hasZero = true
            }
            if(_px < 0){
               return
            }
            rang.push(_px)
            sectionIDs.push(_id)
        })

        if(!_hasZero){
            o.section.push({id:"__Start__" , px:0 })
            rang.push(0)
             
        }

        
        

       
        rang =  rang.sort(function(a, b) {return a - b})

        o.section =  o.section.sort(function(a, b) {return a.px - b.px})

        


       function getPoint(arr , target_value){


            var arrCopy = arr.slice(0);
            // var target_value = 301
            arrCopy.push(target_value)

            var ns =  arrCopy.sort(function(a, b) {return a - b})

            var idx = arrCopy.indexOf(target_value); 
            var lastIdx = arrCopy.lastIndexOf(target_value); 

            var useIdx = idx != lastIdx && lastIdx != arr.length ? lastIdx: idx;
            
            // trace("---getPoint-----")
            // trace(arr)
            // trace(target_value)
            return useIdx
        }


        function mousewheelTouch(d){
            trace("d :"+ d +" _ onAnim: "+ onAnim)
            if(onAnim){
                return
            }
            
            var goAmin = false
            var _scrollTop = 0
            var winTop = $(window).scrollTop();


            trace("winTop:"+winTop)
            

            
            var mode = 1

            if(mode == 1)
            {
                // trace("Mode")
                _scrollTop = getToScrollTop(d , winTop)
                goAmin = true

            }


            if(goAmin){
                // trace("_scrollTop" +_scrollTop)
                    onAnim = true
                    $(o.targetID).stop().animate({ scrollTop: _scrollTop },o.duration, o.easing  , function() {
                    // Animation complete.
                    onAnim = false
                  });
            } 

            trace("--------" )


        }


        function getToScrollTop(d , winTop){

            
            var useIdx = getPoint(rang,winTop)
            var _scrollTop


            trace("now:"+winTop)
            trace("useIdx:"+useIdx)
                       
                if(d > 0){

                    if((useIdx == rang.length - 1) && o.onLastAutoToBottom  ){

                        _scrollTop = $(o.targetID).height() - $(window).height();
                    }else{
                        _scrollTop = rang[useIdx]
                    }

                     
                }else{

                   var _dd = 2
                   if( rang[useIdx - 1] != winTop){
                        _dd = 1
                   }

                    var _n = Math.max(useIdx - _dd  , 0)
                    _scrollTop = rang[_n]
                }

            trace(" winTop " +winTop +" : _scrollTop " +_scrollTop)
           


            if(o.useNear == true){
                var diff = Math.abs(_scrollTop - winTop )
                var conf = diff < o.near 
            
                // trace( " diff : " + diff +"  conf :" + conf)

                if(conf && !(_scrollTop == 0 && winTop == 0 ) && diff !=0 ){
                    _scrollTop = getToScrollTop(d , _scrollTop)
                } 
            }

                


            return  _scrollTop
        }

        function _gotoSection(sectionID , duration , easing){
            // alert('xxx')
            // trace("_gotoSection :"+ sectionID)


            var result = $.grep(o.section, function(e){ return e.id == sectionID; });
            if (result.length == 0) {
              // not found
              alert("sectionID '"+sectionID+"' not found")
            } else {
                var _item = result[0]
                if($(window).scrollTop() == _item.px) return

                    onAnim = true
                $(o.targetID).stop().animate({ scrollTop: _item.px },duration || o.duration, easing || o.easing  , function() {
                    // Animation complete.
                    onAnim = false
                })
            }
        }
        $.fn.onePageScrollAnimation.instance =  {gotoSection:_gotoSection}
    }


    $.onePageScrollAnimation = $.fn.onePageScrollAnimation;

})(jQuery, window, document);




    //IE console fix
    if (!window.console) {var console = {};}
    if (!console.log) {console.log = function() {};} 





    // Add ECMA262-5 Array methods if not supported natively
    //
    if (!('indexOf' in Array.prototype)) {
        Array.prototype.indexOf= function(find, i /*opt*/) {
            if (i===undefined) i= 0;
            if (i<0) i+= this.length;
            if (i<0) i= 0;
            for (var n= this.length; i<n; i++)
                if (i in this && this[i]===find)
                    return i;
            return -1;
        };
    }
    if (!('lastIndexOf' in Array.prototype)) {
        Array.prototype.lastIndexOf= function(find, i /*opt*/) {
            if (i===undefined) i= this.length-1;
            if (i<0) i+= this.length;
            if (i>this.length-1) i= this.length-1;
            for (i++; i-->0;) /* i++ because from-argument is sadly inclusive */
                if (i in this && this[i]===find)
                    return i;
            return -1;
        };
    }
    if (!('forEach' in Array.prototype)) {
        Array.prototype.forEach= function(action, that /*opt*/) {
            for (var i= 0, n= this.length; i<n; i++)
                if (i in this)
                    action.call(that, this[i], i, this);
        };
    }
    if (!('map' in Array.prototype)) {
        Array.prototype.map= function(mapper, that /*opt*/) {
            var other= new Array(this.length);
            for (var i= 0, n= this.length; i<n; i++)
                if (i in this)
                    other[i]= mapper.call(that, this[i], i, this);
            return other;
        };
    }
    if (!('filter' in Array.prototype)) {
        Array.prototype.filter= function(filter, that /*opt*/) {
            var other= [], v;
            for (var i=0, n= this.length; i<n; i++)
                if (i in this && filter.call(that, v= this[i], i, this))
                    other.push(v);
            return other;
        };
    }
    if (!('every' in Array.prototype)) {
        Array.prototype.every= function(tester, that /*opt*/) {
            for (var i= 0, n= this.length; i<n; i++)
                if (i in this && !tester.call(that, this[i], i, this))
                    return false;
            return true;
        };
    }
    if (!('some' in Array.prototype)) {
        Array.prototype.some= function(tester, that /*opt*/) {
            for (var i= 0, n= this.length; i<n; i++)
                if (i in this && tester.call(that, this[i], i, this))
                    return true;
            return false;
        };
    }



