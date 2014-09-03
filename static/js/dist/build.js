/* DIS/PLAY Script 
    Author's name: Bjanri Olsen
    Modified by:
    Client name: DIS/PLAY
    Date of creation: 20 / 8 2014
*/

/*
 * TODO: Fix the fucking timing for animations, stupid!!
 * TODO: Should animation be JS?
 * TODO: Add CSS, Images
 * TODO: Add text to pages and add media queries
 * TODO: Add HTML/HEAD... to all pages
 *
 */

jQuery.noConflict();
jQuery(function ($) {
    Engine = {
        init: function () {
            // we keep all information in this object
            var options = {};
        	options.startPage = "side0";
        	// pages count = number of images / 2
			options.numberOfPages = 60;
            // Cache some dom
            options.content = $(".site-content");
            options.menu = options.content.find(".primary-nav");
            options.menuItems = options.menu.find(".primary-nav__link");
            //options.content = options.root.find(".site-content");
			// we need to set a height on the page wrapper
            options.paginator = options.content.find(".js-paginator");
            options.paginator.next = options.paginator.find(".js-paginator__next");
            options.paginator.prev = options.paginator.find(".js-paginator__prev");

			// build pages
			var index = 0;
			while (index < options.numberOfPages) {
				pageId = "side" + index;
				imageId = index;
				// create new dom element and add new html to it
				var cache = Engine.ui.addPageToDom(pageId, imageId);
				// and add it to our wrapper
				options.content.prepend(cache);
				// clear it for next use
				cache = "";
				index++;

				if (index === options.numberOfPages) {
            		// Load frontpage on first init
            		// unless cookie has page information
        			options.url = options.startPage;
        			options.previousPage = options.url;
					$("#side0").addClass("is-active");

					window.setTimeout(function() {
						options.content.css("height", $("#side0").find("img").height());
					}, 1300);
				}
			}
			
            // Custom event
            $(document).bind("load.page", function(event, options) {
				console.log(options.url);
				if (!(options.pageNumber <= options.numberOfPages - 1)) {
					options.pageNumber = 0;
        			options.url = options.url.replace(/\d+/g, options.pageNumber);
				}
				Engine.ui.showPage(options);
            });
            options.menu.on({
            	click: function() {
            		if($(this).hasClass("is-active")) {
            			$(this).removeClass("is-active");
            		} else {
            			$(this).addClass("is-active");
            		}
            	},
            	mouseout: function() {
					//options.menu.removeClass("is-active");
					//console.log($(this));
            	}
            });
			// Click events
			options.paginator.next.on("click", function() {
        		// get pageNumber from url
        		options.pageNumber = options.url.replace(/\D/g, '');
        		options.pageNumber++;
        		// Append pageNumber to url
        		options.url = options.url.replace(/\d+/g, options.pageNumber);
        		// disable button
        		Engine.ui.button.disable($(this));

				$(document).trigger("load.page", options);
			});
			options.paginator.prev.on("click", function() {
        		// get pageNumber from url
        		//options.pageNumber = options.url.replace(/\D/g, '');
        		if (options.pageNumber >= 1) {
        			options.pageNumber--;
        			// Append pageNumber to url
        			options.url = options.url.replace(/\d+/g, options.pageNumber);
        			console.log(options.url);
        			// disable button
        			Engine.ui.button.disable($(this));
					$(document).trigger("load.page", options);
        		} else {
        			Engine.ui.button.disable($(this));
        		}
			});
            options.menuItems.each(function(i, link) {
            	$(link).on("click", function(event) {
            		event.preventDefault();
            		// only get page name from url - side1, side2, sidex...
            		options.url = $(this)[0].pathname.split("/").pop().replace(".html", "");
        			options.pageNumber = options.url.replace(/\D/g, '');
					$(document).trigger("load.page", options);
            	});
            });
            // Check page status cookie.
            // If cookie stores page and pagenumber then open that page.
			/*var pageStatus = Engine.cookie.read('playbook');
			if (pageStatus) {
				options.url = pageStatus.split(",")[0];
				options.pageNumber = pageStatus.split(",")[1];
			}*/
			/*window.setTimeout(function() {
				if (pageStatus) {
					$(".dummy").addClass("animatePrev");
				}
				$(document).trigger("load.page", options);
			}, 900);*/
			//$(document).trigger("load.page", options);
        },
        ui: {
        	showPage: function(options) {
				
				// add/remove classes
				$(".site-content__wrapper").removeClass("animateCurrent animatePrev is-active is-previous");
				$('#' + options.previousPage).addClass("animatePrev is-previous");
				$('#' + options.url).addClass("animateCurrent is-active");

				options.previousPage = options.url;

				window.setTimeout(function() {
					$(".site-content__wrapper").removeClass("animateCurrent animatePrev");
        			Engine.ui.button.enable([ options.paginator.next, options.paginator.prev ]);
				}, 900);
			},
        	addPageToDom: function(pageId, imageId) {

				imageId = imageId * 2;

            	var html = '<div class="site-content__wrapper" id="' + pageId + '">';
					html += '<div class="page">';
					html += '<div class="col">';
					html += '<h1>Forside</h1>';
					html += '<p>Og noget tekst til forsiden</p>';
					html += '<div class="image-wrap">';
					html += '<img src="/static/media/images/Playbook_images' + imageId + '.jpg" alt=""/>';
					html += '</div>';
					html += '</div>';
					html += '<div class="col">';
					html += '<h1>Side 1</h1>';
					html += '<p>Og noget tekst til side 1</p>';
					html += '<div class="image-wrap">';
					html += '<img src="/static/media/images/Playbook_images' + parseInt(imageId + 1) + '.jpg" alt=""/>';
					html += '</div>';
					html += '</div>';
					html += '</div>';

				return html;
        	},
        	button: {
        		disable: function(button) {
        			if (button instanceof Array) {
        				$(button).each(function() {
        					$(this).attr("disabled", "disabled");
        				});
        			} else {
        				$(button).attr("disabled", "disabled");
        			}
        		},
        		enable: function(button) {
        			if (button instanceof Array) {
        				$(button).each(function() {
        					$(this).removeAttr("disabled");
        				});
        			} else {
        				$(button).removeAttr("disabled");
        			}
        		}
        	}
        },
		cookie: {
			create: function (name, value, days) {
				if (days) {
					var date = new Date();
					date.setTime(date.getTime()+(days*24*60*60*1000));
					var expires = "; expires="+date.toGMTString();
				} else {
					var expires = ""; 
				}
				document.cookie = name+"="+value+expires+"; path=/";
			},
			read: function (name) {
				var nameEQ = name + "=";
				var ca = document.cookie.split(';');
				for(var i=0;i < ca.length;i++) {
					var c = ca[i];
					while (c.charAt(0)==' ') c = c.substring(1,c.length);
					if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
				}
				return null;
			},
			erase: function (name) {
				cookie.create(name, "", -1);
			}
		}       
    }
    // Initialize main script-Engine;
    Engine.init();
});
              /*
			preload: function(options) {
        		// get pageNumber from url
        		options.pageNumber = options.url.match(/\d/g);
        		options.pageNumber++;
        		// Append pageNumber to url
        		options.url = options.url.replace(/\d/g, options.pageNumber);
        		// Get url content and add it to the page
        		var pageToLoad = options._PAGEDIR_ + options.url + ".html";
                $.get(pageToLoad)
                    .done(function(response) {
						console.log("page: ", options.url, " preloaded");
						// create new dom element and add new html to it
						var cache = Engine.ui.addPageToDom(options, response);
						// and add it to our wrapper
						options.content.prepend(cache);
						cache = "";
                    })
					.fail(function() {
						console.log("preload failed");
					});
			} */
/*			

                /*if ($('#' + options.url).length) {
					Engine.ui.showPage(options);
				} else {
					Engine.ui.getPage(options);
				}

			getPage: function(options) {

        		if (options.previousPage) {
					$(".site-content__wrapper").hide().removeClass("animateCurrent animatePrev");
					$('#' + options.previousPage).show().css("z-index", 2).addClass("animatePrev");
        		}

        		// Get url content and add it to the page
        		var pageToLoad = options._PAGEDIR_ + options.url + ".html";
                $.get(pageToLoad)
                    .done(function(response) {
						// create new dom element and add new html to it
						var cache = Engine.ui.addPageToDom(options, response);
						// animate it...
						cache.addClass("animateCurrent");
						// ...and add it to our wrapper
						options.content.prepend(cache);
						// clear it for next use
						cache = "";
						// save page state
						options.previousPage = options.url;
						window.setTimeout(function() {
							// remove animate class from pages
							$(".site-content__wrapper").removeClass("animateCurrent animatePrev");
							// enable prev/next buttons again
        					Engine.ui.button.enable([ options.paginator.next, options.paginator.prev ]);
        					// preload the next page
        					Engine.ui.preload(options);
						}, 1000);
						Engine.cookie.create('playbook', [ options.url, options.pageNumber ], 2);
                    })
					.fail(function() {
						console.log("last page");
						// this is the last page, so lets start over
						options.pageNumber = 0;
        				// Append pageNumber to url
        				options.url = options.url.replace(/\d/g, options.pageNumber);
        				// disable the next button
        				Engine.ui.button.disable(options.paginator.next);
						$(document).trigger("load.page", options);
					});
        	}
					options.content.load(pageToLoad, function(response, textStatus, xhr) {
					 	 //If external page don't exists then roll back the pagenumber
					 	 //and append that to the url
						if (textStatus === "error") {
							console.log("error");
							options.pageNumber--;
							Engine.ui.urlHandler(options);
						}
						if (textStatus === "success") {
							var cache = Engine.ui.addPageToDom(options);
							cache.append(response);
							//options.content.prepend(cache);
							cache = "";
							// save page state
							options.previousPage = options.url;
							window.setTimeout(function() {
								$(".site-content__wrapper").hide().removeClass("animate");
								$('#' + options.url).show();
								console.log("pages is now hidden");
							}, 3000);
							Engine.cookie.create('playbook', [ options.url, options.pageNumber ], 2);
						}
					});
 */

// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

// Place original and minified jQuery/helper plugins under this line.

// Place modifeid jQuery/helper plugins under this line.