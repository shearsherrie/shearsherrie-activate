/*
	Activate Custom Javascript
	Author: Spacehead Concepts (http://www.spaceheadconcepts.com)
*/

jQuery.noConflict();
(function ($) {	
	var document = window.document;
	
	$.fn.imagefit = function() {
		var contH = 0;
		var contW = 0;
		var imgs;
		
		var fit = {
			all : function(imgs){
				imgs.each(function(){
					fit.one(this);
					})
				},
			one : function(img){
				$(img).each(function()
					{
						var imgW = 0, imgH = 0;
						var leftSpace = 0;
						
						var initW = $(this).width(), initH = $(this).height();
						var ratio = initH / initW;
						
						imgW = contW;
						imgH = Math.round(contW * ratio);
						
						if(imgH < contH || ratio > 1.1){
							imgH = contH;
							imgW = Math.round(imgH / ratio);
						} 
						
						var mar_left = Math.round((contW - imgW)/2);
						var mar_top = Math.round((contH - imgH)/2);
						
						$(this).css({'left' : mar_left, 'top': mar_top, 'width' : imgW, 'height' : imgH});
					})
				}
		};
		
		this.each(function(){
				var container = this;

				contW = $(container).width();
				contH = $(container).height();

				// store list of contained images (excluding those in tables)
				imgs = $('img', container);
				
				// store initial dimensions on each image 
				fit.all(imgs);
				
				// Re-adjust when window width is changed
				$(window).bind('resize', function(){
					contW = $(container).width();
					contH = $(container).height();
					fit.all(imgs);
				});
			});
		return this;
	};


	$(document).ready(function () {
		
		
		var currentURL = window.location.toString(),
			$navWrapper = $('#navWrapper'),
			navWidth = $navWrapper.outerWidth(true),
			$tileBlock = $('#tileBlock'),
			$innerTiles = $('#innerTiles'),
			$mainWrapper = $('#mainWrapper'),
			mainWidth = $mainWrapper.outerWidth(true),
			$footerWrapper = $('#footerWrapper'),
			footerWidth = $footerWrapper.outerWidth(true),
			$sideWrapper = $('#sideWrapper'),
			$tiles = $('.tile'),
			$largeCaption = $('#largeCaption'),
			$header = $('#header'),
			$background = $('#supersized'),
			$pageContentButton = $('#pageContentButton'),
			$menuContentButton = $('#menuContentButton'),
			bookmarked = false;
			
		var isHomePage;
		
		var previousUrl = new Array();
		
		//AJAX PREPARATION
	   	
	    var /* Application Specific Variables */
	    	contentSelector = '#ajaxSelector',
	        $contentAjax = $(contentSelector).filter(':first'),
	        contentNode = $contentAjax.get(0),
			$menu = $('#tileBlock').filter(':first'),
			activeClass = 'highlight',
			activeSelector = '.highlight',
			menuChildrenSelector = '.tile',
	        
	        /* Application Generic Variables */
	        $body = $(document.body),
	        rootUrl = homePageURL;
	    
	    $.ajaxSetup ({  
		    cache: false,
		    async:false  
		}); 
		
		var isMobile = 0;
		
		$.ajax({
			type: "POST",
			url: "php/mobile-detect.php",
			data: {mobile: 'test'},
			success: function(msg) {
    			if(msg == 'mobile') {
    				isMobile = 1;
    				$('head').append('<link rel="stylesheet" href="css/mobile.css" type="text/css" />');
    				 
    			}
			}		
		}); 
		
		$.ajaxSetup ({  
					    async:true  
					}); 
	    // Ensure Content
	    if ($contentAjax.length === 0) {
	        $contentAjax = $body;
	    }
		
		// Internal Helper
		$.expr[':'].internal = function(obj, index, meta, stack){
			// Prepare
			var
				$this = $(obj),
				url = $this.attr('href')||'',
				isInternalLink;
			
			// Check link
			isInternalLink = url.substring(0,rootUrl.length) === rootUrl || url.indexOf(':') === -1;
			
			// Ignore or Keep
			return isInternalLink;
		};
	
	
	    // HTML Helper
	    var documentHtml = function (html) {
	            // Prepare
	            var result = String(html).replace(/<\!DOCTYPE[^>]*>/i, '').replace(/<(html|head|body|title|meta|script)([\s\>])/gi, '<div class="document-$1"$2').replace(/<\/(html|head|body|title|meta|script)\>/gi, '</div>');
	
	            // Return
	            return result;
	        };
	
	    // External Link Helper
	    $.fn.externalLinks = function () {
	        // Prepare
	        var $this = $(this);
	
	        // Find external links and add external class
	        $this.find('a').each(function (index, obj) {
	
	            var url = $(obj).attr('href') || '';
	            
	            if (url.substring(0, rootUrl.length) !== rootUrl && url.indexOf(':') !== -1) {
	                if (!$(obj).hasClass("external") && !$(obj).hasClass("_video")) $(obj).addClass("external");
	            }
	        });
	        // Chain
	        return $this;
	    };
	    
	    // Ajaxify Helper
		$.fn.ajaxify = function(){
			// Prepare
			var $this = $(this);
			
			// Ajaxify
			$this.find('#mainWrapper #content a:internal:not(.external, ._image, ._video, .readMore, .postClose)').click(function(event){
				// Prepare
				var
					$this = $(this),
					url = $this.attr('href'),
					title = $this.attr('title')||null;
				
				// Continue as normal for cmd clicks etc
				if ( event.which == 2 || event.metaKey ) { return true; }
				
				// Ajaxify this link
			
				changePage(title,url);
				event.preventDefault();
				return false;
			});
			
			// Chain
			return $this;
		};
		
		 // Ajaxify Helper
		$.fn.portfolioajaxify = function(){
			// Prepare
			var $this = $(this);
			
			// Ajaxify
			$this.find('#sideWrapper a:internal:not(.external, ._image, ._video, .readMore, .postClose)').click(function(event){
				// Prepare
				var
					$this = $(this),
					url = $this.attr('href'),
					title = $this.attr('title')||null;
				
				// Continue as normal for cmd clicks etc
				if ( event.which == 2 || event.metaKey ) { return true; }
				
				// Ajaxify this link
		
				changePage(title,url);
				event.preventDefault();
				return false;
			});
			
			// Chain
			return $this;
		};
				
	    //END AJAX
		function isCurrentUrlHomePage(cur) {
			if(cur.length != homePageURL.length) {
				cur = cur.substring(homePageURL.length);
				if (cur == "/" || cur == "") {				
					return true;
				} else {
					return false;
				}
			}
			
		}	    
	    	
		function setCyclePlugin() {
			
			$sideWrapper.append('<div id="galleryLoader"></div>');
			
			$sideWrapper.find('#galleryStage').hide().waitForImages({
                finished: function() {
                	$sideWrapper.find('#galleryLoader').remove();
	                $(this).show();

					$('#galleryStage').cycle({
		        		fx: 'fade',
		        		fit: 0,
		        		slideResize: 0,
		        		containerResize: 0,
		        		center: 0,
		        		height: null,
		        		width : null,
		        		pager:  '#innerThumbnails',
		        		timeout: 0,
		        		pagerAnchorBuilder: function(idx, slide) { 
		        			var new_src;
		        			if($(slide).is("iframe")) {
		        				new_src = $(slide).attr('data-thumb');
		        			} else {
		        				new_src = slide.src;
		        			}
		        			var src_cat = $(slide).attr('data-category');
							return '<a href="javascript:;"><img data-category="' + src_cat + '" src="' + new_src + '" /></a>'; 
						},
						before:     function() {
							var title = this.title;
							var desc = $(this).attr('data-description');
							var permalink = $(this).attr('data-permalink');
							
							if(title != "") {
								$('#galleryTitle').show().html(title);
							} else {
								$('#galleryTitle').hide().html('');
							}
							
							if(desc != "" || permalink != "") {
								if(desc != "") $('#galleryDescription').show().html(desc);
								if(permalink != "") $('#galleryDescription').show().html('<a href="' + permalink + '">View Portfolio</a>');
							} else { 
								$('#galleryDescription').hide().html('');
							} 
							
							
							$body.portfolioajaxify();
		        		}
		        		
		        		
		        	}).imagefit();
		        	
		        	setThumbnailContainer();
		        	
                } ,
                waitForAll : true
                 
			});
			
			
		}
		
		function setThumbnailContainer() {
			$sideWrapper.find('#innerThumbnails').waitForImages({
	    		finished: function() {
		        	var thumbnailBlockWidth = 0;
		
					$("#innerThumbnails a img").each(function() {
			    		if(!$(this).is(':hidden')) {
			    			thumbnailBlockWidth += $(this).outerWidth(true);
			    		}
				    });
				    
				    $("#innerThumbnails").width(thumbnailBlockWidth + 10 );
				 	
				 	if (isMobile == 0) {
						$("#galleryThumbnails").on('mousemove.thumbnails', function (e) {
					    	var left = (($(this).offset().left  - e.pageX) * (thumbnailBlockWidth - $(this).width()) / $(this).width());
					
					        $("#innerThumbnails").stop().animate({
					            'left': left
					        },{duration:100, easing: 'easeOutCirc'});
				    	});
				    	
				    	
					} 
	    		}
	    	});
		}
		
		function displayCategoryThumbs(category) {
			if(category == 0) {
				//show all thumbs
				$("#innerThumbnails a img").each(function() {
					if($(this).is(':hidden')) {
		    			$(this).show();
		    		}
				});	
			} else {
				//show category thumbs
				$("#innerThumbnails a img").each(function() {
					var slideCategory = $(this).attr('data-category');
					var isCategory = slideCategory.indexOf(category);
					if(isCategory > -1) {
						$(this).show();
					} else {
						$(this).hide();
					}
				});
			}
			setThumbnailContainer();
		}        
		
		
		
	    function refreshPageDimensions() {
	        var viewW = viewportWidth();
	                             
	        $largeCaption.css({'width': viewW - navWidth});        

	        var captionWidth = $largeCaption.width();
	        var captionHeight = $largeCaption.height();
	        
	        $largeCaption.each(function(){
				var spanWidth = $('p', this).width();
				var fontSize = 230;
				var newFontSize = (captionWidth / viewW) * fontSize;
				if(newFontSize > fontSize) {newFontSize = fontSize;}
				$(this).css({"font-size" : newFontSize, "line-height" : newFontSize/1.3 + "px"});
			});	
			
			if (isMobile == 0) {
				if($body.data('showFullscreen') == true) {
					$sideWrapper.css({'width' : "100%" });
				} else {
					$sideWrapper.css({'width' : viewW - mainWidth});
				}	
				
			} else {
				
				$sideWrapper.css({'width' : "100%" });

			}
		
			updatePositions();
			$background.css({'left' : $background.data('leftPosition')});
		}
		
				
	    function viewportWidth() {
	    	var v = viewportDimensions();
	    	return v[0];
	    }
	    
	    function viewportHeight() {
	    	var v = viewportDimensions();
	    	return v[1];
	    }
	    
	    function viewportDimensions() {
	        var viewportwidth;
	        var viewportheight;
	
	        if (typeof $(window).innerWidth() != 'undefined') {
	            viewportwidth = $(window).outerWidth(true);
	            viewportheight = $(window).outerHeight(true) - 40;
	        }
	
	        var dimensions = new Array(viewportwidth, viewportheight);
	        return dimensions;
	
	    }
	
	
		
			
		var tileBlockHeight = 0;
	
	    $tiles.each(function() {
	    	tileBlockHeight += $(this).outerHeight(true);
	    
	    });
	    
	   // tileBlockHeight += $header.height();
	    $innerTiles.height(tileBlockHeight);
		if(isMobile == 0) { 
			$tileBlock.on('mousemove.thememenu', function (e) {
				
		    	var top = (($(this).offset().top - $navWrapper.scrollTop() - e.pageY) * (tileBlockHeight - $tileBlock.height()) / ($tileBlock.height()));
				
			
		        $innerTiles.stop().animate({
		            'top': top
		        },{duration:100, easing: 'easeOutCirc'});
		        
		        
		    });		
		}
		
		
		$pageContentButton.hide().click(function(){
			
			if(isMobile == 1) {
        		if($body.data('noNav') == true) {
        			$body.data('navHidden' , true);
        			$(this).hide();
        		} else {
        			$body.data('noNav',  true);
        			$body.data('navHidden' , false);
        		}
        		
        	} else {
        		$body.data('navHidden' , true);
        		$(this).hide();
        	}
			updatePositions();
			animateObjects();
			$menuContentButton.show();
			return false;
		});
		
		
		$menuContentButton.hide().click(function(){
			
			if(isMobile == 1 ) {
        		if($body.data('navHidden') == true) {
        			$body.data('navHidden' , false);
        			$body.data('noNav',  true);
        			
        		} else {
        			$body.data('noNav',  false);
        			$(this).hide();
        			$("html, body").scrollTop(0);
        		}
        		
        	} else {
        		
        			$body.data('navHidden' , false);
        			$(this).hide();
        		
        	}
			
			
			updatePositions();
			animateObjects();
			
			$pageContentButton.show();
			return false;
		});
		
		
		$.each([$pageContentButton, $menuContentButton], function() {
			$(this).hover(
				function() {
					$(this).addClass('highlight');
				},
				function() {
					$(this).removeClass('highlight');
				}
			);
		});
	
		
		
		$('#logo a').click(function(e) {
			if($body.data('movedLeft') == true) {
			
				var  url = $(this).attr('href'),
	        	title = $(this).attr('title') || null;
				if(isSlideshow == 1) { closePage(); }
				changePage(title, url);
				
	        	tileReset();
	        	if(isSlideshow == 1) { resumeSlideshow(); }
			}
			
			return false;
			
		});
		
		function tileReset() {
			$tiles.each(function() {
				if($(this).data('isSelected') == true) {
					$(this).data('isSelected' , false);
					$('.tileHighlight', this).removeClass("show");
					$(this).animate({'height':tileHeight},{'duration':pageTransitionSpeed});
					tileBlockHeight -= $('.submenu', this).height();
				}
				$(this).find('.submenu a').removeClass('highlight');
			});
		}
		
		//Tile mouse operations - chained click + hover
		$tiles.click( function(e){
			
			if($(this).hasClass('external')) {
				return true;
			}
			
         	var  url = $('.tileImage',this).attr('href'),
		        title = $('.tileImage', this).attr('title') || null;
		        
         	if($(this).data('isSelected') == false || typeof $(this).data('isSelected') === 'undefined') {
         		
         		//reset tile opacity, innerTile container height, isSelected data var
				tileReset();

				//set current tile to active
				$(this).data('isSelected' , true);
				$('.tileHighlight', this).addClass("show");
				$('img.tileColor', this).css({'opacity' : 1});
				
				//adjust new innerTile height for open submenu
				var openHeight = tileHeight + $('.submenu', this).height();
				tileBlockHeight += $('.submenu', this).height();
				$innerTiles.height(tileBlockHeight);
				$(this).animate({'height': openHeight}, {'duration':pageTransitionSpeed});
				
				if(isMobile == 1 ) {
        			$body.data('noNav',  true);
        			$menuContentButton.show();
        		}
        	
				openPage();			
				
			} else {
				$("html, body").animate({scrollTop: 0},{duration: pageTransitionSpeed});
				$(this).find('.submenu a').removeClass('highlight');
			}
			
			changePage(title, url);

	        return false;
	
		}).find('.submenu a').click(function(e) {
			var  url = $(this).attr('href'),
	        title = $(this).attr('title') || null;
	        $(this).addClass("highlight").parent().siblings().find('a').removeClass('highlight');
	        if(isMobile == 1 ) {
        		$body.data('noNav',  true);
        		$menuContentButton.show();
        		openPage();
        	}
			changePage(title, url);
			return false;
		});
		
		if (isMobile == 0) {
			$tiles.hover(
				function() {
					//animate active tile
					$tiles.not(this).find('img.tileColor').css({'opacity' : 0});
					
					if(!$(this).data('isSelected') && showLargeCaption == 1) {
						//set menu caption from tile image
						var menuCaption = $('<p />').text($('.tileImage', this).attr('title'));
						$largeCaption.html(menuCaption);
	 	
					}
				},
				function() {
					//clear menu caption
					$largeCaption.html('');
					
					//reset tile colored opacity to 1					
					$tiles.find('img.tileColor').css({'opacity' : 1});
	
				}
		
			);
		} else {
			$tiles.bind('touchstart', function(){
			    //animate active tile
				$tiles.not(this).find('img.tileColor').css({'opacity' : 0});
	
			}).bind('touchend', function(){
					
					//reset tile colored opacity to 1					
					$tiles.find('img.tileColor').css({'opacity' : 1});
			});
		}
		
		function expandTile(tile) {
	    	//set current tile to active
			$(tile).data('isSelected' , true);
			$('.tileHighlight', tile).addClass("show");
			$('img.tileColor', tile).css({'opacity' : 1});
	
			//adjust new innerTile height for open submenu
			var openHeight = tileHeight + $('.submenu', tile).height();
			tileBlockHeight += $('.submenu', tile).height();
			$innerTiles.height(tileBlockHeight);
			$(tile).animate({'height': openHeight}, {'duration':pageTransitionSpeed});
	    }
	    
	    function highlightCurrentMenu() {

            var obj = $("#tileBlock .tile");
            $(obj).each(function (index) {
                var tile = this;
                
            	if($(this).find('a').attr('href') === currentURL){
            		expandTile(tile);
            	} else {
            		var isSubmenuItem = false;
            		$(this).find(".submenu a").each(function() {
            			//search for submenu item
            			var submenu = this;
            			if($(this).attr('href') === currentURL) {
            				isSubmenuItem = true;
            				$(submenu).addClass("highlight");
            				expandTile(tile);
            			}
            		});
            		
            		if(isSubmenuItem == false) {
                			bookmarked = true;
                	}
            	}
                 
            });
        }
        
        
		function updatePositions() {
			if(isMobile == 0) { 
				if($body.data('showFullscreen') == true) {
					//fullscreen gallery only
					$background.data('leftPosition', - viewportWidth());
					$navWrapper.data('leftPosition', -navWidth );
					$mainWrapper.data('leftPosition', -mainWidth);
					$footerWrapper.data('leftPosition', -mainWidth);
					$sideWrapper.data('leftPosition', 0);
				} else if ($body.data('navHidden') == true) {
					//fullscreen content
					$background.data('leftPosition', - viewportWidth());
					$navWrapper.data('leftPosition', -navWidth );
					$mainWrapper.data('leftPosition', 0);
					$footerWrapper.data('leftPosition', 0);
					$sideWrapper.data('leftPosition', mainWidth);
					
				} else if($body.data('movedLeft') == true){
					//content showing with nav menu
					$background.data('leftPosition', navWidth - viewportWidth());
					$navWrapper.data('leftPosition', 0);
					$mainWrapper.data('leftPosition', navWidth );
					$footerWrapper.data('leftPosition', navWidth);
					$sideWrapper.data('leftPosition', navWidth  + mainWidth);
					
				} else {
					//hide content, show menu
					$background.data('leftPosition', 0);
					$navWrapper.data('leftPosition', 0);
					$mainWrapper.data('leftPosition', viewportWidth());
					$footerWrapper.data('leftPosition', viewportWidth());
					$sideWrapper.data('leftPosition', viewportWidth());
		
				}	
			} else {
				if ($body.data('navHidden') == true) {
					//fullscreen gallery
					$background.data('leftPosition', - viewportWidth());
					$navWrapper.data('leftPosition', -navWidth );
					$mainWrapper.data('leftPosition', -mainWidth);
					$footerWrapper.data('leftPosition', -mainWidth);
					$sideWrapper.data('leftPosition', 0);
					
				} else if($body.data('movedLeft') == true && $body.data('noNav') == true){
					//content showing without nav menu
					$background.data('leftPosition', - viewportWidth());
					$navWrapper.data('leftPosition', -navWidth);
					$mainWrapper.data('leftPosition', 0 );
					$footerWrapper.data('leftPosition', 0);
					$sideWrapper.data('leftPosition', viewportWidth());
					
				} else if($body.data('movedLeft') == true){
					//nav menu showing with content on right
					$background.data('leftPosition', - viewportWidth());
					$navWrapper.data('leftPosition', 0);
					$mainWrapper.data('leftPosition', navWidth );
					$footerWrapper.data('leftPosition', navWidth);
					$sideWrapper.data('leftPosition', navWidth + mainWidth);
					
				} else {
					//hide content, show menu
					$background.data('leftPosition', 0);
					$navWrapper.data('leftPosition', 0);
					$mainWrapper.data('leftPosition', viewportWidth());
					$footerWrapper.data('leftPosition', viewportWidth());
					$sideWrapper.data('leftPosition', viewportWidth());
		
				}
			
			}

		}


		function animateObjects(isAnimated){
			if(isAnimated == null) {
	        	isAnimated = true;
	        }
	        
			$.each([$mainWrapper, $footerWrapper, $sideWrapper, $background, $navWrapper], function() {
				if($(this).data('isHidden') == true) {
	        			$(this).hide();
	        		} else {
	        			updatePositions(); //update positions to compensate for vertical scrollbar
	        			$(this).show();
	        		}
				
				if(isAnimated) {
					$(this).animate({'left' : $(this).data('leftPosition')},{duration : pageTransitionSpeed, complete: function(){
		        		refreshPageDimensions();
		        	}});
		        } else {
		        	$(this).css({'left' : $(this).data('leftPosition')});
		        	refreshPageDimensions();
		        }
	        });
		}
		
		function openPage(isAnimated) {
	        if(isAnimated == null) {
	        	isAnimated = true;
	        }
	        
        	$body.data('movedLeft',  true).data('navHidden' , false);
        	
        	$pageContentButton.show();
  
        	$.each([$mainWrapper, $footerWrapper, $sideWrapper], function(){
        		$(this).data('isHidden', false);
        	});
        	updatePositions();
        	animateObjects(isAnimated);
	       	
		}
		
		function closePage() {

        	$body.data('movedLeft',  false).data('navHidden' , false);
        	if(isMobile == 1 ) {
        		$body.data('noNav',  false);
        	}
        	$.each([$pageContentButton, $menuContentButton], function(){
        		$(this).hide();
        	});
        	
   			$.each([$mainWrapper, $footerWrapper, $sideWrapper], function(){
        		$(this).data('isHidden', true);
        	});
        	updatePositions();
        	animateObjects();
        	resumeSlideshow();
	       		
		}
		
		function showNav() {
			if($body.data('movedLeft') == true && $body.data('navHidden') == true) {
				$body.data('navHidden' , false);
				updatePositions();
				animateObjects();
			
			}
		}
		
		function hideNav() {
			if($body.data('movedLeft') == true && $body.data('navHidden') == false) {
				$body.data('navHidden' , true);
				updatePositions();
				animateObjects();
				refreshPageDimensions();
			}
		}
		
		
		function resetPage() {
			$.each([$mainWrapper, $footerWrapper, $sideWrapper], function() {
				$(this).data('isHidden',true).css({'left' : $(this).data('leftPosition')}).hide();
			});
			
		}
		
		function changePage(title, url) {
			

	       	
	       	if(typeof previousUrl[0] !== 'undefined') {
	       			previousUrl[1] = previousUrl[0];	
	       	}
	       	
	       	previousUrl[0] = url;
	       console.log(previousUrl[1]);
	       	var relativeUrl = url.replace(rootUrl, '');
	       	$("#ajaxloader").show();
	
	        
	        
	        pauseSlideshow();
	        
	        $.each([$mainWrapper, $footerWrapper, $sideWrapper], function() {
				$(this).children().animate({'opacity' : 0}, {duration:pageTransitionSpeed});
			});
			
			bookmarked = false;
			
			$.ajax({
                url: url,
                success: function (data, textStatus, jqXHR) {
                    // Prepare
                    
                    var
                    $data = $(documentHtml(data)),
                        $dataContent = $data.find('.document-body:first'),
                        contentHtml, widgetHtml, sideWrapperHtml;
					
					
                    // Fetch the content
                    contentHtml = $dataContent.find('#mainWrapper').html() || $data.html();
                    sideWrapperHtml = $dataContent.find('#sideWrapper').html() || $data.html();
                    
                    if (!contentHtml) {
                        document.location.href = url;
                        return false;
                    }
					
                    // Update the content
                    $("#ajaxloader").hide();
                   	
                   	$contentAjax.find('#mainWrapper').html(contentHtml).externalLinks().children().css({'opacity' : 0});              
                    $contentAjax.find('#sideWrapper').html(sideWrapperHtml);
                    
                    $sideWrapper.find('#gallery').each(function() {
                    		setCyclePlugin();
                    });
                    
                    	         
                    $sideWrapper.children().css({'opacity' : 0});
                    
                    $("html, body").scrollTop(0);
					
        			if($mainWrapper.data('isHidden') == false) {
        	                  
        				$.each([$mainWrapper, $footerWrapper, $sideWrapper], function() {
							$(this).children().animate({'opacity' : 1}, {duration:pageTransitionSpeed});
						});              		
                    
                    }
                    // Bind custom scripts to new content
                    bindScripts();
                    refreshPageDimensions();
                    
                    // Update the title
                    document.title = $data.find('.document-title:first').text();
                    try {
                        document.getElementsByTagName('title')[0].innerHTML = document.title.replace('<', '&lt;').replace('>', '&gt;').replace(' & ', ' &amp; ');
                    } catch (Exception) {}

                    // Inform Google Analytics of the change
                    if (typeof _gaq !== 'undefined') {
                        _gaq.push(['_trackPageview', relativeUrl]); 
                    }

                },
                error: function (jqXHR, textStatus, errorThrown) {
                    document.location.href = url;
                    return false;
                }
            }); // end ajax
		}

		//init
		function init() {
			
	        $('#header').append('<div id="ajaxloader"></div>').css({'opacity' : 1});
	    	$("#ajaxloader").hide();
				
			isHomePage = isCurrentUrlHomePage(currentURL);
				
			           
            updatePositions();
            resetPage();
            $navWrapper.css({'left':-navWidth}).hide();
            $background.css({'opacity':0});
            
            refreshPageDimensions();
            
	
		}
	    
	    
        
		function resumeSlideshow() {
			if ( typeof vars !== "undefined") {
				if(vars.is_paused) {
					api.playToggle();
				}
			}
		}
		
		function pauseSlideshow() {
			if ( typeof vars !== "undefined") {
				if(!vars.is_paused) {
					api.playToggle();
				}
			}
		}
		
		function musicPlayer() {
		    		
			new jPlayerPlaylist({
				jPlayer: "#jquery_jplayer_1",
				cssSelectorAncestor: "#jp_container_1"
				}, 
				musicArray, 
				{
					swfPath:  homePageURL + "/js",
					supplied: "oga, mp3",
					wmode: "window",
					ready: function () {
					
						if(musicAutoplay == 1) {
							$(this).jPlayer("play");
						};
				}
			});
			
		}
			    
	    $(window).load(function () {
		
		    $("#preloader").animate({
		        "opacity": 0
		    }, {
		        duration: 500,
		        complete: function () {
		            $("#preloader").hide();
		            $background.css({'opacity':1});
		             	                    
                    if(!isHomePage || !isSlideshow) {
                    	$body.data('movedLeft',  true).data('navHidden' , false);
                    	openPage(false);
            			highlightCurrentMenu();
                    	$sideWrapper.find('#gallery').each(function() {
            				setCyclePlugin();
            			});
                    	bindScripts();
    					pauseSlideshow();
                    	                   	
                    	
                    } else {
                    	$body.data('movedLeft',  false).data('navHidden' , false);
                    	animateObjects();
                    	$.each([$mainWrapper, $footerWrapper, $sideWrapper], function() {
							$(this).children().css({'opacity' : 0});
						});
                    }
                    
                    if(isMusic == 1) {
                    	musicPlayer();
                    }
                    
		        }
		    });
		
		});

	    $(window).resize(function () {
	
	        refreshPageDimensions();
	
	    });
	
		
		init();
	    
	
		function bindScripts() {
		
						
			$('#featuredImage').hide().waitForImages(function() {
				$(this).show().imagefit();
			});
			
			// Ajaxify our Internal Links
			$body.ajaxify();
			//$body.portfolioajaxify();
       		// Add external class to external links
        	$body.externalLinks();
        	
        	$('.mediaContainer').hover(
				function(e) {
        			$('a img', this).stop().animate({ opacity: 0.7}, 300);
       	
    			}, function(e) {
        			$('a img', this).stop().animate({ opacity: 1}, 300);
        			
    			}
    		);
    		
        	
        	//gallery category selector
        	
        	$('#portfolioCategories li a').click(function() {
				var category = $(this).attr('data-category');
				if (category == "") category = 0;
				$('#portfolioCategories li a').removeClass('highlight');
				$(this).addClass('highlight');
				displayCategoryThumbs(category);
				
				return false;
			});
        	
        	$('#galleryFullscreen').click(function () {
				if($body.data('showFullscreen') == true) {
	    			$body.data('showFullscreen' , false);
	    			$(this).removeClass('closeButton');
	    			if($body.data('navHidden') == false) {
	    				$pageContentButton.show();
	    			} else {
	    				$menuContentButton.show();
	    			}
	    		} else {
	    			$body.data('showFullscreen' , true);
	    			$(this).addClass('closeButton');
	    			$menuContentButton.hide();
	    			$pageContentButton.hide();
	    		}
			
				updatePositions();
				animateObjects();
				$(window).trigger('resize');
				return false;
			}).hover(
				function() {
					$(this).addClass('highlight');
				},
				function() {
					$(this).removeClass('highlight');
				}
			);
        	
			//SOCIAL ------------------------------------------------------------------------------/
            $("._rolloverSocial").css({'opacity': 0}).hover(

            function () {
                $(this).animate({
                    "opacity": "1"
                }, 300);
            }, function () {
                $(this).animate({
                    "opacity": "0"
                }, 300);
            });
			
			//Pagination ------------------------------------------------------------------------------/
			
			
			firstPaginate = true; //prevents double animation on load of paginated container
			
            //init pajinate containers - add containers as necessary
            $('#blogContainer').pajinate({
                start_page: 0,
                items_per_page: 1,
                show_first_last: false,
                item_container_id: ".contentPaginate"
            }); //initialize pagination of blog items
            $('#searchContainer').pajinate({
                start_page: 0,
                items_per_page: 1,
                show_first_last: false,
                item_container_id: ".contentPaginate"
            }); //initialize pagination of search items
            
            
			
			//BLOG -------------------------------------------------------------------------------/
			
			$(".readMore").click(function() {
				var  url = $(this).attr('href'),
		        title = $(this).attr('title') || null;
				changePage(title, url);
				return false;
			});
			
            if(!bookmarked) { $('#singlePost').append('<div class="postClose"></div>'); } //show close/back button when post navigated to through menu.
           		
			$(".postClose").css({'opacity' : 0.5}).click(function() {
				if(typeof previousUrl[1] !== 'undefined') {
					changePage("",previousUrl[1]);
				}
				
				return false;
			});
			
            //postClose:hover
            $('.postClose').hover(function () {

                $(this).css({
                    opacity: 1
                });

            }, function () {

                $(this).css({
                    opacity: 0.5
                });

            });
            
			//FORMS -------------------------------------------------------------------------------/

            // hide form reload button
            $('#reload').hide();
			
            $('#contactForm #name,#contactForm #email,#contactForm #subject,#contactForm #message, #commentForm #blogName, #commentForm #blogEmail, #commentForm #blogWebsite, #commentForm #blogComment, #loginForm #log, #loginForm #pwd').focus(function () {
                var initVal = $(this).val();
                $(this).val(initVal === this.defaultValue ? '' : initVal);
            }).blur(function () {
                var initVal = $(this).val();
                $(this).val(initVal.match(/^\s+$|^$/) ? this.defaultValue : initVal);
            });
			
			$("#themeContactForm").submit(function() {
				$('#contactForm #submit').attr("disabled", "disabled");
			
    			var name = $('#contactForm #name').val();
            	var email = $('#contactForm #email').val();
            	var subject = $('#contactForm #subject').val();
            	var message = $('#contactForm #message').val();
    		
                var isError = 0;

    			if (name == 'Name*' || name == '') {
                    $('#contactForm #name').addClass('formVerify').focus();
                    isError = 1;
                }
                if (email == 'E-mail*' || email == '') {
                    $('#contactForm #email').addClass('formVerify').focus();
                    isError = 1;
                } else {
                    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
                    if (reg.test(email) == false) {
                        $('#contactForm #email').addClass('formVerify').focus();
                        isError = 1;
                    }
                }
                if (message == 'Message*' || message == '') {
                    $('#contactForm #message').addClass('formVerify').focus();
                    isError = 1;
                }

                if (isError == 1) {
                    $('#contactForm #formProgress').html(formWarning);
                    $('#contactForm #submit').removeAttr("disabled");
                    return false;
                }

    			var str = $(this).serialize();
    			
    			$('#contactForm #formProgress').html('Sending&hellip;');
    			  			
    			$.ajax({
        			type: "POST",
        			url: "php/submit-form.php",
        			data: str,
        			success: function(msg) {
        				$("#contactForm").ajaxComplete(function(event, request, settings){
                			if(msg == 'Mail sent') {
                				$('#contactForm #submit').removeAttr("disabled");
                    			$("#contactForm").animate({'opacity' : 0},{'duration' : pageTransitionSpeed, 'complete' : function() { $(this).hide();}});
            					$("#sentConfirmMessage").html(formSuccess);
            					$('#reload').fadeIn();
                			}
                			else {
                    			result = msg;
                    			$("#sentConfirmMessage").html(formError);
                    			$('#contactForm #submit').removeAttr("disabled");
        					}
        				});
        			}
    			});
    			return false;
    		});
            
            	    
            $('#reload').click(function () {
                $("#contactForm").show().animate({
                    "opacity": "1"
                }, pageTransitionSpeed);
                $('#sentConfirmMessage').html(formReload);
                $('#reload').fadeOut();
                $('#contactForm #formProgress').html('*required');
            });

            $(".twitter").tweet({
                join_text: "auto",
                username: twitterAccount,
                avatar_size: 40,
                count: numTweets,
                auto_join_text_default: "we said,",
                auto_join_text_ed: "we",
                auto_join_text_ing: "we were",
                auto_join_text_reply: "we replied",
                auto_join_text_url: "we were checking out",
                loading_text: "loading tweets..."
            });
            
            $('#map_canvas').each(function() {
            	if(typeof google !== 'undefined') {
	            	var myOptions = {
		          		center: new google.maps.LatLng(gmapLong,gmapLat),
		          		zoom: 15,
		          		mapTypeId: google.maps.MapTypeId.ROADMAP
	        		};
	        	
		        	var map = new google.maps.Map(document.getElementById("map_canvas"),
		            	myOptions);
					
					
					var marker = new google.maps.Marker({
	  					position: new google.maps.LatLng(gmapLong,gmapLat),
	 					map: map
					});
				}
            });
            
		}

	});
	
	})(jQuery);