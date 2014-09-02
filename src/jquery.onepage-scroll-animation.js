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

        $(window).bind('mousewheel DOMMouseScroll', function(event){
                // event.stopImmediatePropagation();
                // event.stopPropagation();
                // event.preventDefault();

                var delta = parseInt(event.originalEvent.wheelDelta || -event.originalEvent.detail);
                // console.log("i  > "+event.originalEvent.wheelDelta +" => "+ event.originalEvent.detail)

                if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
                    mousewheelTouch(-1)
                    event.preventDefault();
                }
                else {
                    mousewheelTouch(1)
                    event.preventDefault();
                }
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


//Fix FF bug?
$(window).bind('mousewheel DOMMouseScroll', function(event){
                // event.stopImmediatePropagation();
                // event.stopPropagation();
                // event.preventDefault();
                
                // var delta = parseInt(event.originalEvent.wheelDelta || -event.originalEvent.detail);

                // console.log("d  > "+event.originalEvent.wheelDelta +" => "+ event.originalEvent.detail)
               
        });

