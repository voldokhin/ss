 	/* 	Инициализация переменных	 */
	var aniSpd = 600,
			flexboxSupport = Modernizr.flexbox,
			transitionSupport = Modernizr.csstransitions,
			transformSupport = Modernizr.csstransforms,
			transform3dSupport = Modernizr.csstransforms3d,
			transitionName = Modernizr.prefixed('transition'),
			transformName = Modernizr.prefixed('transform'),
			animationName = Modernizr.prefixed('animation'),
			isMobile = jQuery.browser.mobile,
			isIE10plus = false,
			winH = $(window).height(),
			winW = $(window).outerWidth(),
			hasOpera = !!window.opera && window.opera.version && window.opera.version(),
			is_ltIE9 = $('html').hasClass('lt-ie9'),
			is_ltIE10 = $('html').hasClass('lt-ie10');

	if(transitionSupport){
		var transEndEventNames = {
			'WebkitTransition': 'webkitTransitionEnd',// Saf 6, Android Browser
			'MozTransition'		: 'transitionend',      // only for FF < 15
			'OTransition'			: 'oTransitionEnd',     // only for Opera < 12
			'transition'			: 'transitionend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
		},
		transEndEvent = transEndEventNames[ transitionName ];

		var animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',// Saf 6, Android Browser
			'MozAnimation'		: 'animationend',      // only for FF < 15
			'OAnimation'			: 'oAnimationEnd',     // only for Opera < 12
			'animation'			  : 'animationend'       // IE10, Opera, Chrome, FF 15+, Saf 7+
		},
		animEndEvent = animEndEventNames[ animationName ];
	};

	/* Проверка на целое число */
	function isNumeric(n) {
		return !isNaN(parseInt(n)) && isFinite(n);
	}
	// Delegate .transition() calls to .animate()
	// if the browser can't do CSS transitions.
	if (!transitionSupport)
		$.fn.transition = $.fn.animate;

/* Определение версии IE, взято с http://www.majas-lapu-izstrade.lv/useful/cross-browser-grayscale-image-example-using-css3-js */
	function getInternetExplorerVersion(){
		var rv = -1;
		if (navigator.appName == 'Microsoft Internet Explorer'){
			var ua = navigator.userAgent;
			var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
			rv = parseFloat( RegExp.$1 );
		}
		else if (navigator.appName == 'Netscape'){
			var ua = navigator.userAgent;
			var re  = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
			if (re.exec(ua) != null)
			 rv = parseFloat( RegExp.$1 );
		};
		return rv;
	};
	if (getInternetExplorerVersion() >= 10){
		$('html').addClass('ie10-plus');
		isIE10plus = true
	};
	// Идентификация 12й оперы
	if(hasOpera){
		$('html').addClass('opera12');
	}

$(document).ready(function(){

/* Добавление поддержки multi-columns */
	if(!Modernizr.csscolumns){
		$('.columns-2').columnize({ columns: 2 });
		$('.columns-3').columnize({ columns: 3 });
	}

/* 	Стилизация checkbox и radio	 */
	// убираем авторасстановку галочек браузером, чтобы не было путаницы
	$(document).find('.checkbox, .radio').find('input').attr('autocomplete','off');
	// Устанавливаем флажки у элементов с атрибутом checked
	$(document).find('.checkbox:has(input:checked), .radio:has(input:checked)').addClass('checked');

	$.fn.checkboxChange = function(){
		var $t=$(this),
			 $ti = $t.find('input');
		if($ti.is(':disabled')) {	return false;	}

		if( $ti.is(':checked') ) {
			$t.removeClass('checked');
			$ti.prop('checked', false).trigger('change');
		} else {
			$t.addClass('checked');
			$ti.prop('checked', true).trigger('change');
		};
		return $(this)
	};

	$.fn.radioChange = function(){
		var $t=$(this),
			 $ti = $t.find('input');

		if($ti.is(':disabled')) {	return false;	}

		if( !$ti.is(':checked') ) {
			$('input[type="radio"][name="' + $ti.attr('name') + '"]').each(function() {
				$(this).prop('checked', false);
				$(this).closest('.radio').removeClass('checked')
			});
			$t.addClass('checked');
			$ti.prop('checked', true).trigger('change');
		};
		return $(this)
	};

	// Отслеживаем событие клика по div с классом checkbox
	$(document).on('click', '.checkbox', function(){
		$(this).checkboxChange()
	});
	// Отслеживаем событие клика по div с классом radio
	$(document).on('click', '.radio', function(){
		$(this).radioChange()
	});
	// Для ссылки внутри checkbox или radio останавливаем распространение события клика
	$(document).on('click', '.checkbox a, .radio a', function(e){
		e.stopPropagation()
	});
	$('form').on('reset', function(){
		$(this).find('.checkbox, .radio').each(function(i,el){

			var $ti = $(el).find('input');
			if($ti.is(':disabled')) {	return false;	}

			$(el).removeClass('checked');
			$(el).find('input').prop('checked', false).trigger('change');
		})
	});

	// Прокрутка страницы  (взято с http://stackoverflow.com/a/20699124 и модифицировано)
	function animateScrollTop(top, duration, easingFunc) {
		duration = (duration != 'undefined') ? duration : 1600;
		easingFunc = (easingFunc != 'undefined') ? easingFunc : 'easeInOutQuad';
		var scrollTopProxy = { value: $(window).scrollTop() };
		if (scrollTopProxy.value != top) {
			$(scrollTopProxy).animate(
			{ value: top }, 
			{
				duration: duration,
				easing: easingFunc,
				step: function (stepValue) {
					var rounded = Math.round(stepValue);
					$(window).scrollTop(rounded);
				}
			})
		}
	};

	/* 	Раскрытие блоков с текстом	 */
	var transTimingF = transitionSupport ? 'ease' : 'easeInOutQuad';

	function topOffsetCalc(){
		return $('#flowing-blocks').outerHeight() || 0;
	};

	// Проверка ссылки
	function isActionLink(linkHref){
		return (linkHref.charAt(0) == '#' && !RegExp("(/|http|https)").test(linkHref));
	};

	$.fn.expandableOpen = function(speed){
		var $wrapper = $(this),	// Текущий блок
				$wrapperParents = $wrapper.parents('.expandable-item.open'), // Открытые родительские блоки
				$inner = $wrapper.children('.expandable-inner'),	// само содержание блока
				linkH = $wrapper.find('.expandable-trigger').outerHeight(),	// Высота ссылки
				initH = linkH + parseInt($wrapper.css('borderBottomWidth')) + parseInt($wrapper.css('borderTopWidth')),	// полная высота в свёрнутом виде
				fullH,	// Полная высота в развёрнутом виде
				$label = $wrapper.find(':first-child .label');

		$wrapper.height(initH);
		$inner.css({'height':'auto', 'visibility': 'visible'});
		fullH = $inner.outerHeight() + initH - ($wrapper.is('.opener-on-left') ? linkH : 0);
		speed = (speed != 'undefined') ? speed : fullH*2;	// Скорость свёртывания/развёртывания

		if( $label.length ){
			var transProp = {
				'height': fullH,
				'marginTop': '+='+($label.outerHeight()+20)	}

		}else {
			var transProp = {	'height': fullH	}
		}

		if( $wrapper.parent('.expandable-single').length != 0 ){
			$wrapper.parent('.expandable-single').children('.open').expandableClose(0)
			setTimeout(function(){
				var wrapperTop = $wrapper.offset().top
				if( (wrapperTop - topOffsetCalc()) < $(window).scrollTop() ){
					animateScrollTop( wrapperTop, 0 )
				}
			}, 10)
		}
		$inner
			.css('opacity', 0)
			.transition({ 'opacity': 1 }, speed, transTimingF);

		$wrapper
			.addClass('animated')
			.transition(transProp, speed, transTimingF, function(){
				if( $label.length ){	$label.transition({'opacity': 1}, speed)	};
				$wrapper
					.addClass('open')
					.removeClass('animated')
					.css('height', '');

				var video = $inner.find('video')[0];
				if( video !== undefined ){	video.play()	}
			})

		$wrapperParents
			.addClass('animated')
			.transition({ 'height': '+='+(fullH - initH) }, speed, transTimingF, function(){
				$wrapperParents.removeClass('animated')
			})

		Waypoint.refreshAll()

		return $(this)
	};
	$.fn.expandableClose = function(speed){
		var $wrapper = $(this),	// Текущий блок
				$wrapperParents = $wrapper.parents('.expandable-item.open'), // Открытые родительские блоки
				$inner = $wrapper.children('.expandable-inner'),	// само содержание блока
				linkH = $wrapper.find('.expandable-trigger').outerHeight(),	// Высота ссылки
				initH = linkH + parseInt($wrapper.css('borderBottomWidth')) + parseInt($wrapper.css('borderTopWidth')),	// полная высота в свёрнутом виде
				fullH = $inner.outerHeight() + initH - ($wrapper.is('.opener-on-left') ? linkH : 0),	// Полная высота в развёрнутом виде
				$label = $wrapper.find(':first-child .label');

		speed = (speed != 'undefined') ? speed : fullH*2;	// Скорость свёртывания/развёртывания

		if( $label.length ){
			var transProp = {
				'height': fullH,
				'marginTop': '-='+($label.outerHeight()+20)	}

			$label.transition({'opacity': 0}, (speed/2)); // скрываем метку над заголовком

		}else {
			var transProp = {	'height': fullH	}
		}

		$wrapper
			.height(fullH)
			.addClass('animated')
			.transition(transProp, speed, transTimingF, function(){
				$wrapper.removeClass('open animated');
				setTimeout(function(){
					$wrapper.css('height','')
				}, 10);
			});

		$wrapperParents
			.addClass('animated')
			.transition({ 'height': '-='+(fullH - initH) }, speed, transTimingF, function(){
				$wrapperParents.removeClass('animated')
			});

		$inner.transition({ 'opacity': 0 }, speed, transTimingF, function(){
			$inner.css({'height':'', 'visibility': '', 'opacity': ''});
		});

		var video = $inner.find('video')[0];
		if( video !== undefined ){	video.pause()	}

		Waypoint.refreshAll()

		return $(this)
	};

	$('.expandable-trigger').on('click', function(e){
		var linkHref = this.getAttribute('href');
		if( isActionLink(linkHref) ){
			e.preventDefault();
			var $item = $(this).closest('.expandable-item');
			if($item.children('.expandable-inner:has(.content)').length != 0 && !$item.hasClass('animated')){
				if($item.hasClass('open')){
					$item.expandableClose();
					$(this).trigger('blur')
				}else{
					$item.expandableOpen();
				}
			}
		}
	});
	$('.expandable-close').on('click', function(e){
		e.preventDefault();
		var $item = $(this).closest('.expandable-item'),
				newTop = $item.offset().top - topOffsetCalc();

		$item.expandableClose();
		if( $item.children('a').length != 0 && newTop < $(window).scrollTop() ){
			animateScrollTop(newTop, 300)
		}
	});
	/* 	END - Раскрытие блоков с текстом	 */

	/* Переход к нужному блоку по хешу в url */
	$('[data-toggle="hashlink"]').on('click', function(e){
		e.preventDefault();
		var id = this.getAttribute("data-target");
		var $item = (document.getElementById(id) !== null) ?
									$( id ) :	$('[data-id="'+id+'"]');

		if( $item.hasClass('expandable-item') ){
			if( $item.parent('.expandable-single').length !== 0 ){
				$item.siblings().filter('.open').expandableClose()
				$item.not('.open').expandableOpen()
			}
		}
		var newTop = $item.offset().top - topOffsetCalc() - 70;
		animateScrollTop(newTop, 300)
	});

	$(window).on('hashchange load', function(){
		var hash = location.hash.substring(1);
		if( hash != '' ){
			var $target = (document.getElementById(hash) !== null) ?
										$( hash ) :	$('[data-id="'+hash+'"]');

			if(	$target.length != 0 ){
				if($target.hasClass('expandable-item')){
					$('.expandable-item.open', $('#content-sections') ).expandableClose(0);
					$target.expandableOpen(0);
				};
				if( !$target.hasClass('modal') ) {
					setTimeout(function(){
						animateScrollTop( $target.offset().top - topOffsetCalc(), 0 );
					}, 50);
				}else{
					$target.modal('show');
				}
			}			
		}
	});

/* Галерея с вкладками, расширение/сжатие картинки */
	$('.tabbed-img-gallery .tab-pane').on('click', function(){
		var $wrapper = $(this).closest('.tabbed-img-gallery'),
				initW = '62em';

		if( $wrapper.hasClass('wide') ){
			$wrapper
				.removeClass('wide')
				.css('width', '100%' )
				.transition({'width': initW}, 400, function(){
					$wrapper.css('width','')
				})
				.children('.tab-content').attr('title', 'Развернуть')

		}else{
			$wrapper
				.css('width', initW)
				.transition({'width': '100%'}, 400, function(){
					$wrapper
						.addClass('wide')
						.css('width','')
						.children('.tab-content').attr('title', 'Свернуть')
				})
		}
	});
	$('.tabbed-img-gallery a[data-toggle="tab"]').on('show.bs.tab', function (e) {
		var $wrapper = $(this).closest('.tabbed-img-gallery');
		animateScrollTop( $wrapper.offset().top, 300 );
	});

/* Видео в заголовке страницы */
	$('.videolayer > video.playing').on('canplay', function(e) {

		var $videoContainer = $(this).parent();

		function switchVideo(currVideo, nextVideo){
			currVideo.pause()
			currVideo.classList.remove('playing')
			nextVideo.classList.add('playing')
			nextVideo.currentTime = currVideo.currentTime
			nextVideo.play();
			Waypoint.refreshAll()
		}

		$('[data-video-sw]').on('click', function(e){
			e.preventDefault();

			var nextLink = this,
					nextVideoId = nextLink.getAttribute('data-video-sw'),
					nextVideo = $('[data-video="'+nextVideoId+'"]')[0],
					currVideo = $videoContainer.children("video.playing")[0];

			if( $('[data-video-usual]').hasClass('active') ) switchVideo(currVideo, nextVideo);

			$('[data-video-sw]').removeClass('active')
			$('[data-video-sw="'+nextVideoId+'"]').addClass('active')
		})

		$('[data-video-usual]').on('click', function(e){
			e.preventDefault();

			var nextVideoId = $('[data-video-sw].active').attr('data-video-sw'),
					nextVideo = $('[data-video="'+nextVideoId+'"]')[0],
					currVideo = $videoContainer.children("video.playing")[0];

			switchVideo(currVideo, nextVideo);

			$('[data-video-ss]').removeClass('active')
			this.classList.add('active')
		})

		$('[data-video-ss]').on('click', function(e){
			e.preventDefault();

			var nextVideo = $('[data-video="bitrate-ss"]')[0],
					currVideo = $videoContainer.children("video.playing")[0];
					
			switchVideo(currVideo, nextVideo);

			$('[data-video-usual]').removeClass('active')
			this.classList.add('active')
		})
	})
/* END - Видео в заголовке страницы */

/* Управление видеопримерами */
	$('.video-examples .action-link').on('click', function(e){
		e.preventDefault();
		var $link = $(this);
		$link.parent().siblings('li').children('a').removeClass('active')
		$link.addClass('active')
		$link.closest('.video-examples').find('video').removeClass('active')[0].pause()
		$( $link.attr('href') ).addClass('active')[0].play()
		Waypoint.refreshAll()
	})
/* END - Управление видеопримерами */

/* Управление видео, в зависимости от видимости его на экране */
	$('video').waypoint({
		handler: function(direction) {
			var video = this.element;
			if( $(video).is(':visible') && $(video).css('visibility') == 'visible' ) {
				if( direction == "down" ){
					video.pause();
				}else if( direction == "up" ){
					video.play()
				}
			}
		},
		offset: function() {
			return -this.element.clientHeight+100
		}
	})
	$('video').waypoint({
		handler: function(direction) {
			var video = this.element;
			if( $(video).is(':visible') && $(video).css('visibility') == 'visible' ) {
				if( direction == "down" ){
					video.play()
				}else if( direction == "up" ){
					video.pause();
				}
			}
		},
		offset: '90%'
	})
/* END - Управление видео, в зависимости от видимости его на экране */

	/* Переход к нужному блоку по хешу в url */
	$(window).on('hashchange load', function(e, speed){
		var hash = location.hash.substring(1);
		speed = (speed !== undefined) ? speed : 0;
		if( hash != '' ){
			var $target = $('[data-id="'+hash+'"]');
			if(	$target.length != 0 ){
				if($target.hasClass('expandable-item')){
					$('.expandable-item.open', $('#content-sections') ).expandableClose(0);
					$target.expandableOpen(0);
				};
				if( !$target.hasClass('modal') ) {
					setTimeout(function(){
						animateScrollTop( $target.offset().top - topOffsetCalc(), speed );
					}, 50);
				}else{
					$target.modal('show');
				}
			}			
		}
	});

/*	Модальные окна	*/
	$('.modal').on('hidden.bs.modal show.bs.modal', function(e){
		setTimeout(function(){
			$('[data-toggle="modal"]').blur();
		}, 5)
	});

	/* 	Инициализация fancybox для картинок	 */
	$('.fancybox-img').fancybox({
		padding: 5,
		margin: [10,10,0,10],
		wrapCSS: 'fancybox-img',
		maxWidth: winW,
		maxHeight: winH,
		tpl: {
			error    : '<p class="fancybox-error">Изображение не может быть загружено.<br/>Пожалуйста, повторите позже.</p>',
			closeBtn : '<a title="Закрыть" class="fancybox-item fancybox-close" href="javascript:;"></a>'
		},
		helpers: {
			thumbs : {
				width: 100,
				position: 'bottom'
			}
		}
	});

	/* Включение полифила для css calc в модальных окнах */
	if( !Modernizr.csscalc ){
		$('.modal').on('shown.bs.modal', function(){
			window.dotheCalc()
		})
	};

	$(window).on('resize', function(){
		winH = $(window).height();
		winW = $(window).outerWidth();
	})
});