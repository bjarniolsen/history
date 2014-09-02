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
            var options = {};
        	// all pages in this folder
        	options._PAGEDIR_ = "/sider/";
            // Load frontpage on first init
            // unless cookie has page information
        	options.url = "side0";
            options.pageNumber = 0;
            // Cache some dom
            options.root = $(".site-wrapper");
            options.menu = options.root.find(".primary-nav");
            options.menuItems = options.menu.find(".primary-nav__link");
            options.content = options.root.find(".site-content");
			// we need to set a height on the page wrapper
			options.content.css("height", $(".dummy img").height());
            options.paginator = options.root.find(".js-paginator");
            options.paginator.next = options.paginator.find(".js-paginator__next");
            options.paginator.prev = options.paginator.find(".js-paginator__prev");
            // Custom event
            $(document).bind("load.page", function(event, options) {
        		if ($('#' + options.url).length) {
					Engine.ui.showPage(options);
				} else {
					Engine.ui.getPage(options);
				}
            });
            options.menu.on("click", function() {
            	if($(this).hasClass("is-active")) {
            		$(this).removeClass("is-active");
            	} else {
            		$(this).addClass("is-active");
            	}
            });
			// Click events
			options.paginator.next.on("click", function() {
				options.pageturner = "next";
        		// get pageNumber from url
        		options.pageNumber = options.url.match(/\d/g);
        		options.pageNumber++;
        		// Append pageNumber to url
        		options.url = options.url.replace(/\d/g, options.pageNumber);
        		// disable button
        		Engine.ui.button.disable($(this));
				$(document).trigger("load.page", options);
			});
			options.paginator.prev.on("click", function() {
				options.pageturner = "prev";
        		// get pageNumber from url
        		options.pageNumber = options.url.match(/\d/g);
        		if (options.pageNumber >= 1) {
        			options.pageNumber--;
        			// Append pageNumber to url
        			options.url = options.url.replace(/\d/g, options.pageNumber);
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
					$(document).trigger("load.page", options);
            	});
            });
            // Check page status cookie.
            // If cookie stores page and pagenumber then open that page.
			var pageStatus = Engine.cookie.read('playbook');
			if (pageStatus) {
				options.url = pageStatus.split(",")[0];
				options.pageNumber = pageStatus.split(",")[1];
			}
			window.setTimeout(function() {
				if (pageStatus) {
					$(".dummy").addClass("animatePrev");
				}
				$(document).trigger("load.page", options);
			}, 900);
        },
        ui: {
        	showPage: function(options) {
				$(".site-content__wrapper").hide().removeClass("animateCurrent animatePrev");
				$('#' + options.previousPage).show().css("z-index", 2).addClass("animatePrev");
				$('#' + options.url).show().css("z-index", 3).addClass("animateCurrent");
				options.previousPage = options.url;
				window.setTimeout(function() {
					$(".site-content__wrapper").removeClass("animateCurrent animatePrev");
        			Engine.ui.button.enable([ options.paginator.next, options.paginator.prev ]);
				}, 900);
			},
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
						// and add it to our wrapper
						cache.addClass("animateCurrent");
						options.content.prepend(cache);
						cache = "";
						// save page state
						options.previousPage = options.url;
						window.setTimeout(function() {
							// remove animate class from pages
							$(".site-content__wrapper").removeClass("animateCurrent animatePrev");
        					Engine.ui.button.enable([ options.paginator.next, options.paginator.prev ]);
        					//Engine.ui.preload(options);
						}, 1000);
						Engine.cookie.create('playbook', [ options.url, options.pageNumber ], 2);
                    })
					.fail(function() {
						console.log("last page");
						// this is the last page, so lets start over
						options.pageNumber = 0;
        				// Append pageNumber to url
        				options.url = options.url.replace(/\d/g, options.pageNumber);
        				Engine.ui.button.disable(options.paginator.next);
						$(document).trigger("load.page", options);
					});
        	},
        	addPageToDom: function(options, response) {
            	return $('<div class="site-content__wrapper" id="' + options.url + '">' + response + '</div>');
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
						// save page state
                    })
					.fail(function() {
						console.log("preload failed");
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
