# onepage-scroll-animation

easy scroll up , down animation on jQuery

簡易的 Onepage 動畫 的 jQuery 套件


GitHub Page (http://lamb-mei.github.io/onepage-scroll-animation/)



## Feature

What feature in `onepage-scroll-animation`:

  - 設定區間距離
  - 誤差容許調整
  - 允許最後一個自動置底
  - 直接跳至指定 section



## Depends 相依套件

  - jQuery 
  - jquery-mousewheel (https://github.com/brandonaaron/jquery-mousewheel)


## How to use

Simply include the `jquery.onepage-scroll-animation.js` file and place the following in the head of your document (make sure jQuery is included):

###Basic

```js
var osa = $.onePageScrollAnimation({ 
section              	   : [

                                {id:"section1"   , px:0 },
                                {id:"section2"   , px:900 },
                                {id:"section3"   , px:1980 },
                                {id:"section4"   , px:2800 }
                           ]
  })
```

###Advanced

```js
var osa = $.onePageScrollAnimation({ 
section          	       : [

                                {id:"section1"   , px:0 },
                                {id:"section2"   , px:900 },
                                {id:"section3"   , px:1980 },
                                {id:"section4"   , px:2800 }
                           ],
	useNear                 : true,			//啟用容許距離 	(default: false)
    near                    : 100,			//容許距離 		(default: 50)
    onLastAutoToBottom      : true			//最後一個元素自動置底 		(default: false)
    duration                : 500,			//動畫間隔 		(default: 500)
    easing                  : "swing"		//動畫效果 		(default: swing)

  })
```


##method


```js
var osa = $.onePageScrollAnimation({ 
section   : [

                {id:"section1"   , px:0 },
                {id:"section2"   , px:900 },
                {id:"section3"   , px:1980},
                {id:"section4"   , px:2800 }
           ]
  })





osa.gotoSection("section1")	//Scroll to section1


```


### gotoSection adv 

`gotoSection(sectionID , duration , easing)`

```js
osa.gotoSection("section2" , 1000 , "swing")
```



## Demo

Demo1 (http://lamb-mei.github.io/onepage-scroll-animation/demo/demo1.html)

Demo2 use with Jarallax (http://lamb-mei.github.io/onepage-scroll-animation/demo/demo2.html)






