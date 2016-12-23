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

/*
	// Стилизация селектов
	$('select.form-control').each(function(){
		$(this).not(':hidden')
			.removeClass('form-control input-sm input-lg')
			.selectize({sortField: 'value'});

		if($('html').hasClass('lt-ie10')){
			$('.selectize-input > input').placeholderEnhanced();
			//$('.selectize-input > input').placeholderEnhanced();
		}
	});
*/

	// Стилизация селектов
	$('select.form-control-sltric').each(function(){
		/*$(this).not(':hidden')
			.removeClass('form-control-sltric input-sm input-lg')
			.selectric();*/
			$(this).selectric();

		if($('html').hasClass('lt-ie10')){
			$('.selectric-input > input').placeholderEnhanced();
			//$('.selectize-input > input').placeholderEnhanced();
		}
	});

		//alert($("div .selectric-countryself .selectric p").html());
		$("div .selectric-countryself .selectric p").text("Страна");
		$("div .selectric-countrysely .selectric p").text("Страна");


	$('.modal').on('show.bs.modal', function (event) {
		$(this).find('select.form-control').each(function(){
			$(this)
				.removeClass('form-control input-sm input-lg')
				.selectize({sortField: 'value'});
			
			if($('html').hasClass('lt-ie10')){
				$('.selectize-input > input').placeholderEnhanced();
			}
		})
	})

	/* 	Счётчики	 */
	$('form').on('click', '.form-counter a', function(e){
		e.preventDefault();
		var $input = $(this).siblings('input');
		if($(this).hasClass('form-counter_up')){
			$input.val( function(index, value){	value = parseInt(value); return (value < ($input.attr('max') || 999)) ? value+1 : ($input.attr('max') || 1)	} )

		}else	if($(this).hasClass('form-counter_down')){
			$input.val( function(index, value){	value = parseInt(value); return (value > ($input.attr('min') || 1)) ? value-1 : ($input.attr('min') || value)	} )
		}
	});

	// Обработка полей input url и email
	/* $('[type="url"].form-control, [type="email"].form-control')
		.each(function(){
			var $input = $(this),
					value,
					inputMgn = $input.css('marginTop')+' '+$input.css('marginRight')+' '+$input.css('marginBottom')+' '+$input.css('marginLeft'),
					inputH = $input.outerHeight(),
					inputW = $input.outerWidth(),
					left = parseInt( $input.css('paddingLeft') ) + parseInt( $input.css('borderLeftWidth') );

			if($input.css('display') == 'block'){
				$input
					.addClass('input-with-link')
					.wrap('<div style="position: relative; margin: '+inputMgn+';" />')
			}else{
				$input
					.addClass('input-with-link')
					.wrap('<span style="position: relative; display: inline-block; vertical-align: middle; margin: '+inputMgn+'; width: '+(inputW-1)+'px" />')
			};

			if($input.val() != ''){
				value = ( $input.attr('type')=='url') ? $input.val() : 'mailto:'+$input.val();
				$input
					.css({'color':'transparent'})
					.parent().append('<a href="'+value+'" class="input-link" style="left: '+left+'px; line-height: '+inputH+'px">'+$input.val()+'</a>')
			}else{
				$input
					.parent().append('<a href="#" style="left: '+left+'px; line-height: '+inputH+'px"></a>')
			}
		})
		.on('focus', function(){
			var $input = $(this);

			if($input.hasClass('input-with-link')){
				$(this)
					.css('color', '')
					.next('a').css('display','none')
			}
		})
		.on('blur', function(){
			var $input = $(this),
					value;

			if($input.hasClass('input-with-link')){
				value = $input.val();
				if(value != ''){
					value = ( $input.attr('type')=='url') ? value : 'mailto:'+value;
					$input
						.css({'color':'transparent'})
						.next('a')
							.text($input.val())
							.attr('href', value)
							.css('display','block');

				}else{
					$input.next('a')
						.text('')
						.attr('href','#');
				}
			}
		}); */

	// Подключение слайдеров
	$('[data-slick]').slick();

	/* 	Инициализация календаря для input-date	 */
	$.datepick.setDefaults($.datepick.regionalOptions[ $('html').attr('lang') || '']);

	$('.input-date input').datepick({
		showTrigger:
			'<i class="icon icon-calendar text-info"></i>'
	});
	
	// анимация верхнего меню
	if(transitionSupport){
		$.fn.topNavOver = function(){
			$(this)
				.stop(true, false)
				.addClass('hover')
				.css('visibility', 'visible')
				.transition({	'opacity': 1	}, 300, 'ease')
		};
		$.fn.topNavLeave = function(){
			$(this)
				.stop(true, false)
				.removeClass('hover')
				.transition({	'opacity': 0	}, 300, 'ease', function(){
					if(!$(this).hasClass('hover')) $(this).css('visibility', '')
				})
		};
		$('.header-nav > div').hover(
			function(){
				$(this).children('.subnav').topNavOver()
			},
			function(){
				$(this).children('.subnav').topNavLeave()
			}
		)
	};

	// Плавающее меню без position: fixed (Дёргается в IE, поэтому там остаётся position: fixed)
	$(function(){
		var $top = $('#flowing-blocks');
		if($top.length != 0){
			var	d = $(document),
					offsetTop = $top.offset().top;

			$(window).on('load scroll', function(){
				var scroll = d.scrollTop();
				
				if(scroll > offsetTop){
					$top
						.addClass('flowing')
						.css( 'position', 'fixed' )
						.parent().css('paddingTop', $top.height())

				}else{
					$top
						.removeClass('flowing')
						.attr( 'style', '' )
						.parent().css('paddingTop', '');
				}
			})
		}
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
	function topOffsetCalc(){
		return $('#flowing-blocks').outerHeight() || 0
	};

	// Проверка ссылки
	function isActionLink(linkHref){
		return (linkHref.charAt(0) == '#' && !RegExp("(/|http|https)").test(linkHref));
	};

	// Инициализация плеера youtube
	$.fn.ytPlayerInit = function(){
		var $player = $(this);
		if($player.length != 0 && playerAPIReady == true && $player.is('div')){

			var player = new YT.Player($player.attr('id'), {
				height: $player.attr('data-height'),
				width: $player.attr('data-width'),
				videoId: $player.attr('data-yt-url'),
				playerVars: {
					"wmode": "opaque",
					"allowfullscreen": 1
				}
			})
		};
		delete $player
	};

	$(window).on('load', function(){
		// если есть плеер, то инициализируем его
		$('.expandable-item.open').find('[data-yt-url]').ytPlayerInit();
	})
/* Работа оглавления, используется плагин waypoint */
	$(function(){
		var $chapsWrapper = $('#content-sections'),
				$cart = $('#cart'),
				$partnersFilter = $('#partnerTableFilter'),
				$navWrapper = $('#sections-nav'),
				$arrowUp = $('#scroll-on-top');

		if($navWrapper.length != 0){
			var $chapters = $('[data-menu-title]'),
					chapsCount = $chapters.length,
					$nav = $('#sections-nav > nav'),
					i=1, tmpElement, $chapter,
					title = '', prevTitle = '',
					wpTriggers = [],
					wpTriggersUp = [];

			for(i; i<=chapsCount; i++){
				$chapter = $chapters.eq(i-1);
				title = $chapter.attr('data-menu-title'),
				exist = (title != 'undefined') ? $nav.is(':has([href="'+title+'"])') : false;

				var overWindow = $chapter.height() > $(window).height()-100;
				// Добавляем элементы-триггеры для отслеживания блоков с содержанием больше высоты окна, при движении вверх
				if(overWindow){
					tmpElement = document.createElement('div');
					$(tmpElement).addClass('wpTriggerUp').appendTo($chapter);
				};
				if(exist){

				// 	При загрузке выставляем первый раздел активным, если нет активных
					$nav.not(':has(.current)').children('a:first').addClass('current')

					wpTriggers[i] = $chapter.waypoint({
						handler: function(direction) {
							$nav.find('a').removeClass('current');
							$nav.find('[href="'+$(this.element).attr("data-menu-title")+'"]').addClass('current')
						},
						offset: '20%'
					});
					if(overWindow){
						wpTriggersUp[i] = $chapter.children('.wpTriggerUp')
						.css('bottom', $(window).height()/2)
						.waypoint(function(direction) {
							if(direction == 'up'){
								$nav.find('a').removeClass('current');
								$nav.find('[href="'+$(this.element).parent().attr("data-menu-title")+'"]').addClass('current')
							}
						})
					}
				};
				prevTitle = title;
			};

			// Появление плавающего оглавления при загрузке страницы
			$navWrapper
				.width(	$nav.width()	)
				.addClass('open');

			function navTopRecalc(){
				var navTop = ($cart.length != 0) ? ($cart.height()+40) : 190;
				if($navWrapper.outerHeight()+navTop > winH){
					navTop -= $navWrapper.outerHeight() + navTop - winH;
				}
				$navWrapper.css({'top': navTop+'px' })
			};
			navTopRecalc();
			$(window).on('resize', function(){	navTopRecalc()	})

			setTimeout(function(){
				if(!$navWrapper.hasClass('hover')){
					$navWrapper
						.width('')
						.removeClass('open')
				}
			}, 5000);

		// Наведение на плавающее оглавление
			$navWrapper.hover(
				function(){
					$navWrapper.addClass('hover');
					if(!$navWrapper.hasClass('open')){
						$navWrapper
							.width(	$nav.width()	)
							.addClass('open')
					}
				},
				function(){
					$navWrapper.removeClass('hover');
					if($navWrapper.hasClass('open')){
						$navWrapper
							.width('')
							.removeClass('open')
					}
				}
			);

		// Переход к нужной странице при клике на пункт меню
			$nav.on('click', 'a', function(e){
				var chapN = $(this).attr('href'),
						scroll = ( $('html').scrollTop() || $('body').scrollTop() );

				if(	isActionLink( chapN )	){
					e.preventDefault();
					var chapTop = $('[data-menu-title="'+chapN+'"]').position().top + $chapsWrapper.offset().top - topOffsetCalc(),
							delta = Math.abs(	scroll - chapTop	);

					if(delta>20){
						animateScrollTop(chapTop, ((delta > 1000) ? 1600 : 800))
					}
				};
			})
		};

		// Наведение на меню слева
		$('#left-side-menu a:not(.current)').hover(
			function(){
				var $link = $(this),
						$li = $link.parent();
				$link.addClass('hover');
				if(!$li.hasClass('open')){
					$li
						.width(	$link.outerWidth()	)
						.addClass('open')
				}
			},
			function(){
				var $link = $(this),
						$li = $link.parent();
				$link.removeClass('hover');
				if($li.hasClass('open')){
					$li
						.width('')
						.removeClass('open')
				}
			}
		);

	// Кнопка вверх
		$chapsWrapper.waypoint({
			handler: function(direction) {
				if(direction=='down'){
					$arrowUp.addClass('visible')
				}else{
					$arrowUp.removeClass('visible')
				}
			}
		});
		$arrowUp.on('click', function(e){
			e.preventDefault();
			animateScrollTop(0, Math.round( $(window).scrollTop()/3) + 500, 'easeInOutSine' )
		});

	// Фильтр партнёров в списке
		$partnersFilter.waypoint({
			handler: function(direction) {
				if(direction=='down'){
					$partnersFilter.height( $partnersFilter.outerHeight() );
					$partnersFilter.children('div').addClass('floating')
				}else{
					$partnersFilter.children('div').removeClass('floating');
					$partnersFilter.height('');	
				}
			}
		});
	});

	/* 	Раскрытие блоков с текстом	 */
	var transTimingF = transitionSupport ? 'ease' : 'easeInOutQuad';

	$.fn.expandableOpen = function(speed){
		var $wrapper = $(this),	// Текущий блок
				$wrapperParents = $wrapper.parents('.expandable-item.open'), // Открытые родительские блоки
				$inner = $wrapper.children('.expandable-inner'),	// само содержание блока
				linkH = $wrapper.children('a').outerHeight(),	// Высота ссылки
				initH = linkH + parseInt($wrapper.css('borderBottomWidth')) + parseInt($wrapper.css('borderTopWidth')),	// полная высота в свёрнутом виде
				fullH;	// Полная высота в развёрнутом виде

		$wrapper.height(initH);
		$inner.css({'height':'auto', 'visibility': 'visible'});
		fullH = $inner.outerHeight() + initH - ($wrapper.is('.opener-on-left') ? linkH : 0);
		speed = (speed != 'undefined') ? speed : fullH*2;

		$inner
			.css('opacity', 0)
			.transition({ 'opacity': 1 }, speed, transTimingF);

		$wrapper
			.addClass('animated')
			.transition({ 'height': fullH }, speed, transTimingF, function(){
				$wrapper.addClass('open').removeClass('animated');
				Waypoint.refreshAll();

				// если есть плеер, то инициализируем его
				$wrapper.find('[data-yt-url]').ytPlayerInit();
				var video = $inner.find('video')[0];
				if( video !== undefined ){	video.play()	}
			});

		$wrapperParents
			.addClass('animated')
			.transition({ 'height': '+='+(fullH - initH) }, speed, transTimingF, function(){
				$wrapperParents.removeClass('animated')
			});

		return $(this)
	};
	$.fn.expandableClose = function(speed){
		var $wrapper = $(this),	// Текущий блок
				$wrapperParents = $wrapper.parents('.expandable-item.open'), // Открытые родительские блоки
				$inner = $wrapper.children('.expandable-inner'),	// само содержание блока
				linkH = $wrapper.children('a').outerHeight(),	// Высота ссылки
				initH = linkH + parseInt($wrapper.css('borderBottomWidth')) + parseInt($wrapper.css('borderTopWidth')),	// полная высота в свёрнутом виде
				fullH = $inner.outerHeight() + initH - ($wrapper.is('.opener-on-left') ? linkH : 0);	// Полная высота в развёрнутом виде

		speed = (speed != 'undefined') ? speed : fullH*2;

		$wrapper
			.height(fullH)
			.addClass('animated')
			.transition({ 'height': initH }, speed, transTimingF, function(){
				$wrapper.removeClass('open animated');
				setTimeout(function(){
					$wrapper.css('height','')
				}, 10);
				Waypoint.refreshAll();
			});

		$wrapperParents
			.addClass('animated')
			.transition({ 'height': '-='+(fullH - initH) }, speed, transTimingF, function(){
				$wrapperParents.removeClass('animated')
			});

		$inner.transition({ 'opacity': 0 }, speed, transTimingF, function(){
			$inner.css({'height':'', 'visibility': '', 'opacity': ''});
		});

		// Выключаем видео при его наличии
		var video = $inner.find('video')[0];
		if( video !== undefined ){	video.pause()	}

		return $(this)
	};

	$('.expandable-item > a').on('click', function(e){
		var linkHref = this.getAttribute('href');
		if( isActionLink(linkHref) ){
			e.preventDefault();
			var $item = $(this).parent();
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
	$.fn.colsNumber = function(){
		var cols = $(this).closest('.expandables-interleave').attr('class');
		if(cols != ''){
			cols = cols.charAt( cols.indexOf('cols')+5 );
		};
		return cols
	};
	$('.expandables-interleave[class ^= cols-]').children('.expandable-item').each(function(i){
		var $item = $(this),
				fract = $item.colsNumber(),
				j = $('#'+this.id).index(),
				$prev = $item.prev(),
				$prev2 = $item.prev().prev();

		if(!$prev.hasClass('expandable-item') && $prev.hasClass('colspan-3')){
			$item.addClass('ex-item-2')
		}else if(!$prev.hasClass('expandable-item') && !$prev.hasClass('colspan-3')){
			$item.addClass('ex-item-1')
		}else if(!$prev2.hasClass('expandable-item') && !$prev2.hasClass('colspan-3')){
			$item.addClass('ex-item-2')
		}else{
			$item.addClass('ex-item-'+(j - Math.floor(j/fract)*fract + 1))
		}
	});

	$('[data-toggle="expandable"]').on('click', function(e){
		e.preventDefault();
		var $item = $(this.getAttribute("data-target"));
		if( $item.parent('.expandable-single').length != 0 ){
			var $openItem = $item.siblings().filter('.open');
			var cols = $(this).colsNumber(),
					openIdx = $openItem.index(),
					thisIdx = $item.index();
			if(
				openIdx - thisIdx <= cols-1
				&& openIdx - thisIdx > 0
				&& Math.floor(openIdx/cols)*cols == Math.floor(thisIdx/cols)*cols
			){
				$item.insertAfter($openItem);
			};
			$item.siblings().filter('.open').expandableClose()
		};
		$item.not('.open').expandableOpen()
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

	num_price=1;
	// Добавление и удаление строк в таблице сделок
	$('.prc-lst-table-addRow').on('click', function(e){
		e.preventDefault();
		var $rows = $(this).closest('.price-list-table').find('.prc-lst-table-items > tr'),
				$lastRow = $rows.last();

		$rows.filter('.table-row-tpl')
			.clone()
			.removeClass('hidden table-row-tpl')
			.insertAfter( $rows.last() )

			.find('select')
				.removeClass('form-control input-sm input-lg')
				.each(function() {$(this).selectize({sortField: 'value'});
					});
		var last_tr = $("#product_table .prc-lst-table-items > tr:last-child");
/*
		last_tr.find('.quantity').attr("name","quantity"+num_price);	
		last_tr.find('.price').attr("name","price"+num_price);					
		last_tr.find('.continue').attr("name","continue"+num_price);
		last_tr.find('.sel_name').attr("name","name_product"+num_price);
		last_tr.find('.sel_uch_zap').attr("name","uch_zap"+num_price);
*/

		last_tr.find('.price').prop("required", true);
		last_tr.find('.continue').prop("required", true);
		

		num_price++;
	});
// Добавление и удаление строк в таблице сделок (маркетинговые материалы)
	$('.prc-lst-table-addRow-marketing').on('click', function(e){
		e.preventDefault();
		var $rows = $(this).closest('.price-list-table').find('.prc-lst-table-items > tr'),
				$lastRow = $rows.last();
		var sum_value;
		$rows.filter('.table-row-tpl')
			.clone()
			.removeClass('hidden table-row-tpl')
			.insertAfter( $rows.last() )

			.find('select')
				.removeClass('form-control input-sm input-lg')
				.each(function() { 
					$(this).selectize({sortField: 'value'});
					$(this).change(function () {//при изменении select
	var r= $(this).closest("tr").find('td.rbl strong');
	var d= $(this).closest("tr").find('td.dol strong');
	$.ajax({
		url: "/portal/support/order-handouts/select_change.php",
		type: "POST",
		dataType: "json",
		data: {
								id:$(this).val(),
		},
		success: function(data){
			r.html(data['rub']);
			d.html(data['usd']);
								//new_val_rub=data['rub'];
								//new_val_dol=data['usd'];
								CallRubl();
							}
						});
					});
					$('input.quantity').change(function(){
						CallRubl();
					});

					$('.form-counter_up').click(function(){
						setTimeout( function() {CallRubl();} , 1000);
					});

					$('.form-counter_down').click(function(){
						setTimeout( function() {CallRubl();} , 1000);
					});
			 });
	CallRubl();
	});

	function CallRubl(){
		var sum=0;
		$('tr:not(.hidden) td.rbl strong').each(function(){
			rubl=parseInt($(this).html());
			dol= parseFloat($(this).closest("tr").find('td.dol strong').html());
			var count=parseInt($(this).closest('tr').find('td div input.quantity').val());
			sum+=rubl*count;
			//
			$(this).closest("tr").find('td.rbl input').val(rubl);
			$(this).closest("tr").find('td.dol input').val(dol);
		});
		$('td.sum strong').html(sum);
		$('td.sum input').val(sum);
	}


	$('.price-list-table > tbody').on('click', '.prc-lst-table-remRow', function(e){
		e.preventDefault();
		$(this).closest('tr').remove();
			CallRubl();
	});

	/*  Фильтр по дате в истории  */
	$.fn.filterOpen = function(){
		$(this)
			.addClass('animated')
			.transition({
				'opacity': 1,
				'visibility':'visible',
				'transform':'translateY(0) translateZ(0)'
			}, (is_ltIE10 ? 0 : 500), function(){
				$(this)
					.addClass('open')
					.removeClass('animated')
			})
	};
	$.fn.filterClose = function(){
		$(this)
			.addClass('animated')
			.transition({
				'opacity': 0,
				'visibility':'hidden',
				'transform':'translateY(-10px) translateZ(0)'
			}, (is_ltIE10 ? 0 : 500), function(){
				$(this)
					.removeClass('open animated')
					.attr('style','')
			})
	};
	$('#filter-date-trigger').on('click', function(e){
		e.preventDefault();
		var $filterWrapper = $('#filter-date'),
				fullH = $filterWrapper.children('.filter-datepicker').children().outerHeight() + parseInt( $filterWrapper.css('paddingTop') ) + parseInt( $filterWrapper.css('paddingBottom') );

		if( !$filterWrapper.hasClass('animated') ){
			if( $filterWrapper.hasClass('open') ){
				$(this).removeClass('active');
				$filterWrapper.filterClose();
			}else{
				$(this).addClass('active');
				$filterWrapper.filterOpen();
			}
		}
	});
	// Работа календаря
	function updateFields(dates) {
		$('[data-filter-startdate]').val(dates.length ? $.datepick.formatDate(dates[0]) : '');
		$('[data-filter-enddate]').val(dates.length ? $.datepick.formatDate(dates[1]) : '')
	};
	function updateLastMonth(dates){
		var today = $.datepick.today(),
				day = today.getDate(),
				month = today.getMonth(),
				year = today.getFullYear(),
				str = $.datepick.formatDate( 'd M yyyy', $.datepick.newDate(year,month,day))+' – '+$.datepick.formatDate( 'd M yyyy', $.datepick.newDate(year,month+1,day) );

		$('#filter-date-in-tab').text( str )
	};
	$(function(){
		var $filterDatepicker = $('#filter-date > .filter-datepicker');

		$('[data-filter-close]').on('click', function(e){
			e.preventDefault();
			if( ! $('#filter-date').hasClass('animated') ){
				$('[data-filter-startdate],[data-filter-enddate]').val('').trigger('change');
				$('#filter-date-trigger').removeClass('active');
				$('#filter-date').filterClose();
			}
		});
		$('[data-filter-apply]').on('click', function(e){
			e.preventDefault();
			// Здесь применяется фильтр
		});
		$('[data-filter-startdate], [data-filter-enddate]').on('change', function(){
			$filterDatepicker.datepick('setDate',
				[ $('[data-filter-startdate]').val() , $('[data-filter-enddate]').val() ]
			)
		});
		$filterDatepicker.datepick({
			rangeSelect: true,
			monthsToShow: 3,
			maxDate: '0',
			onSelect: updateFields,
			onShow: updateLastMonth
		})
	});
	/*  END - Фильтр по дате в истории  */

	/* Пошаговые формы (с expandable-item) */
	var $formTabs = $('.form-tabs'),
			$formSteps = $('.form-steps');

	$formTabs.find('.expandable-item > a')
		.off('click')
		.on('click', function(e){	e.preventDefault()	});

	$formTabs.one('mouseenter', function(){
		$(this)
			.closest('.stepbystep-form').addClass('activated')
			.end().children('.expandable-item:first')
				.addClass('current').expandableOpen();

		setTimeout(function(){
			$formTabs.children('.current').find('.form-control:not(:disabled):first').focus()
		}, 300);

		$formSteps.children('li:first').addClass('current')
	});
	$('.form-tabs-prev').on('click', function(e){
		e.preventDefault();
		if($formTabs.children('.animated').length === 0){

			$formTabs.children('.current')
				.removeClass('current').expandableClose()
			.prev()
				.addClass('current').expandableOpen();

			setTimeout(function(){
				$formTabs.children('.current').find('.form-control:not(:disabled):first').focus()
			}, 300);


			$formSteps.children('.current')
				.removeClass('current')
			.prev()
				.addClass('current')
		}
	});
	$('.form-tabs-next').on('click', function(e){
		e.preventDefault();
		if($formTabs.children('.animated').length === 0){

			$formTabs.children('.current')
				.removeClass('current').expandableClose()
			.next()
				.addClass('current').expandableOpen();

			setTimeout(function(){
				$formTabs.children('.current').find('.form-control:not(:disabled):first').focus()
			}, 300);

			$formSteps.children('.current')
				.removeClass('current')
			.next()
				.addClass('current')
		}
	});
	$('.form-tabs-end').on('click', function(e){
		e.preventDefault();
		// Проверяем, отправляем форму
/*
		if($formTabs.children('.animated').length === 0){

			$formTabs.children('.current')
				.removeClass('current').expandableClose();

			$formSteps.children('.current')
				.removeClass('current');

			$formTabs
				.closest('.stepbystep-form').removeClass('activated')
		}*/
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

	/* 	Инициализация fancybox для сообщений	 */
	$('.fancybox-msg').fancybox({
		padding: [0,50,25,50],
		width: 500,
		maxWidth: 500,
		minWidth: 500,
		wrapCSS: 'fancybox-msg',
		tpl: {
			error    : '<p class="fancybox-error">Изображение не может быть загружено.<br/>Пожалуйста, повторите позже.</p>',
			closeBtn : '<a title="Закрыть" class="fancybox-item fancybox-close" href="javascript:;"><i class="icon-cross"></i></a>'
		}
	});

	/* 	Инициализация fancybox для видео	 */
	$('.thumbnail_overlay-video > a').fancybox({
		padding: 2,
		margin: [10,10,0,10],
		type: 'iframe',
		iframe: {
			scrolling : 'no'
		},
		scrolling: 'no',
		tpl: {
			error    : '<p class="fancybox-error">Видео не может быть загружено.<br/>Пожалуйста, повторите позже.</p>',
			closeBtn : '<a title="Закрыть" class="fancybox-item fancybox-close" href="javascript:;"></a>'
		},
		afterShow: function(event){
			this.inner.css('overflow', 'visible')
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

		Waypoint.refreshAll();
	});

	// перевод изображения в оттенки серого на Opera и Safari
	if( hasOpera) {
		var $images = $(".grayscale-img img");
		if($images.length != 0){
			grayscale.prepare( $images );
			grayscale( $images );
			$(".grayscale-img img").hover(
				function() {
					grayscale.reset( $(this) );
				},
				function() {
					grayscale( $(this) );
				}
			)
		}
	};
	
	// Перевод в оттенки серого на IE10+, с сайтаhttp://www.majas-lapu-izstrade.lv/useful/cross-browser-grayscale-image-example-using-css3-js	
	// Grayscale images only on browsers IE10+ since they removed support for CSS grayscale filter
	if (getInternetExplorerVersion() >= 10){
		$('.grayscale-img img').each(function(){
			var el = $(this);
			el.css({"position":"absolute"}).wrap("<div class='img_wrapper' style='display: inline-block'>").clone().addClass('img_grayscale').css({"position":"absolute","z-index":"5","opacity":"0"}).insertBefore(el).queue(function(){
				var el = $(this);
				el.parent().css({"width":this.width,"height":this.height});
				el.dequeue();
			});
			this.src = grayscaleIE10(this.src);
		});
		
		// Quick animation on IE10+
		$('.grayscale-img')
			.on('mouseenter focus', function () {
				$(this).find('img:first').stop().animate({opacity:1}, 200);
			})
			.on('mouseleave blur', function () {
				$(this).find('.img_grayscale').stop().animate({opacity:0}, 200);
			});

		// Сама функция перевода изображения в оттенки серого на IE10+
		function grayscaleIE10(src){
			var canvas = document.createElement('canvas');
			var ctx = canvas.getContext('2d');
			var imgObj = new Image();
			imgObj.src = src;
			canvas.width = imgObj.width;
			canvas.height = imgObj.height;
			ctx.drawImage(imgObj, 0, 0);
			var imgPixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
			for(var y = 0; y < imgPixels.height; y++){
				for(var x = 0; x < imgPixels.width; x++){
					var i = (y * 4) * imgPixels.width + x * 4;
					var avg = (imgPixels.data[i] + imgPixels.data[i + 1] + imgPixels.data[i + 2]) / 3;
					imgPixels.data[i] = avg;
					imgPixels.data[i + 1] = avg;
					imgPixels.data[i + 2] = avg;
				}
			}
			ctx.putImageData(imgPixels, 0, 0, 0, 0, imgPixels.width, imgPixels.height);
			return canvas.toDataURL();
		}
	};


	/* 	PIE в ie8	 */
	if( $('html').hasClass('lt-ie9') ) {

		$(function pie(){
			var _selectors ="";
			if (window.PIE) {
				$(_selectors).each(function() {
					PIE.attach(this);
				});
			};
		})
	};

	$(".idbtn").click(function(e){
		e.preventDefault();
		var ID = $(this).closest("div.input-group").children("input.input-lg").val();
		if(ID.length != 8){
			$("p.text-danger").removeClass("hidden");
		} else {
			if(ID > 0){
				$("form.enter-id-form").submit();
			}
	}
	});

});