/* DIS/PLAY Script 
    Author's name: Bjanri Olsen
    Modified by:
    Client name: DIS/PLAY
    Date of creation: 20 / 8 2014
*/

/*
 * TODO: Add text to "pages" 
 * TODO: Add media queries
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
            options.paginator = options.content.find(".js-paginator");
            options.paginator.next = options.paginator.find(".js-paginator__next");
            options.paginator.prev = options.paginator.find(".js-paginator__prev");

			// build pages
			var index = 0, cache = [];
			while (index < options.numberOfPages) {
				pageId = "side" + index;
				imageId = index;
				// create new dom element and add new html to it
				cache.push(Engine.ui.addPageToDom(pageId, imageId));
				index++;
			}
			
			// add markup to our wrapper
			options.content.prepend(cache);
			
            // Load frontpage on first init
            // unless cookie has page information
            // check page status cookie.
			var pageStatus = Engine.cookie.read('playbook');
			if (pageStatus) {
				options.url = pageStatus.split(",")[0];
				options.pageNumber = pageStatus.split(",")[1];
			} else {
        		options.url = options.startPage;
        		options.previousPage = options.url;
			}

			// show the page
			var activePage = $("#" + options.url);
			activePage.addClass("is-active");

			options.activePageImage = activePage.find("img:first-child");
			Engine.ui.setPageHeight(options, "init");

            // Custom events
            $(document).bind("load.page", function(event, options) {
				console.log(options.url);
				if (!(options.pageNumber <= options.numberOfPages - 1)) {
					options.pageNumber = 0;
        			options.url = options.url.replace(/\d+/g, options.pageNumber);
				}
				Engine.ui.showPage(options);
            });

            options.menu.on("click", function() {
            	if($(this).hasClass("is-active")) {
					Engine.ui.closeMenu(options);
            	} else {
					Engine.ui.openMenu(options);
            	}
            });
			// Click events
			options.paginator.next.on("click", function() {
				Engine.ui.nextPage(options);
			});
			options.paginator.prev.on("click", function() {
				Engine.ui.prevPage(options);
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

			Engine.ui.bindEvents(options);

			window.onresize = function(event) {
				Engine.ui.setPageHeight(options, "resize");
			};
        },
        ui: {
        	showPage: function(options) {
				// add/remove classes
				$(".site-content__wrapper").removeClass("animateCurrent animatePrev is-active is-previous");
				$('#' + options.previousPage).addClass("animatePrev is-previous");
				$('#' + options.url).addClass("animateCurrent is-active");

				options.previousPage = options.url;
				// set cookie with new page number
				Engine.cookie.create('playbook', [ options.url, options.pageNumber ], 2);

				window.setTimeout(function() {
					$(".site-content__wrapper").removeClass("animateCurrent animatePrev");
        			Engine.ui.button.enable([ options.paginator.next, options.paginator.prev ]);
					Engine.ui.bindEvents(options);
				}, 900);
			},
        	addPageToDom: function(pageId, imageId) {

				imageId = imageId * 2;

            	var html = '<div class="site-content__wrapper" id="' + pageId + '">';
					html += '<div class="page">';
					html += '<div class="col">';
					html += '<div class="image-wrap">';
					html += '<img src="/static/media/images/Playbook_images' + imageId + '.jpg" alt=""/>';
					html += '</div>';
					html += '</div>';
					html += '<div class="col">';
					html += '<div class="image-wrap">';
					html += '<img src="/static/media/images/Playbook_images' + parseInt(imageId + 1) + '.jpg" alt=""/>';
					html += '</div>';
					html += '</div>';
					html += '</div>';

				return html;
        	},
        	nextPage: function(options) {
        		// get pageNumber from url
        		options.pageNumber = options.url.replace(/\D/g, '');
        		options.pageNumber++;
        		// Append pageNumber to url
        		options.url = options.url.replace(/\d+/g, options.pageNumber);
        		// disable button and keyboard while animating images
        		Engine.ui.button.disable($(this));
				$("body").unbind("keyup");

				$(document).trigger("load.page", options);
        	},
        	prevPage: function(options) {
        		// get pageNumber from url
        		//options.pageNumber = options.url.replace(/\D/g, '');
        		if (options.pageNumber >= 1) {
        			options.pageNumber--;
        			// Append pageNumber to url
        			options.url = options.url.replace(/\d+/g, options.pageNumber);
        			console.log(options.url);
        			// disable button
					$(document).trigger("load.page", options);
        		}
        		// disable button and keyboard while animating images
        		Engine.ui.button.disable($(this));
				$("body").unbind("keyup");
        	},
        	setPageHeight: function(options, state) {
				if (state === "init") {
            		$.fn.imageLoad = function(fn){
    					this.load(fn);
    					this.each( function() {
        					if ( this.complete && this.naturalWidth !== 0 ) {
            					$(this).trigger('load');
        					}
    					});
					}
					options.activePageImage.imageLoad(function() {
						// get image height to define site-content height
						options.content.css("height", $(this).height());
					});
				}
				if (state === "resize") {
					// get height of first image of active page 
					options.content.css("height", $("#" + options.url + " img:first-child").height());
				}
        	},
        	openMenu: function(options) {
				options.menu.addClass("is-active")
				options.content.addClass("do-show-controls");
        	},
        	closeMenu: function(options) {
				options.menu.removeClass("is-active")
				options.content.removeClass("do-show-controls");
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
        	},
        	bindEvents: function(options) {
            	$("body").bind("keyup", function(event) {
					event.preventDefault();
					if (event.which == 38) { // UP ARROW
						Engine.ui.prevPage(options);
					} else if (event.which == 40) { // DOWN ARROW
						Engine.ui.nextPage(options);
					} else if (event.which == 37) { // LEFT ARROW
						Engine.ui.openMenu(options);
					} else if (event.which == 27 || event.which == 39) { // ESC or RIGHT ARROW KEYS
						Engine.ui.closeMenu(options);
					}
				});
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
