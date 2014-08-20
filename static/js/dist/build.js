/* DIS/PLAY Script 
    Author's name: Nicolaj Lund Nielsen
    Modified by:
    Client name: DIS/PLAY
    Date of creation: 18 / 8 2014
*/

/*
 * TODO: Add CSS and Images now
 * TODO: Get all text from book. Jesper?
 *
 */

jQuery.noConflict();
jQuery(function ($) {
    Engine = {
        init: function () {
            $(document).ready(function ($) {

            });
            $(window).load(function ($) {
                // Her kører vi onload funktioner
                Engine.fixes.init();
            });
            var options = {};
            // Load frontpage on first init
            // unless cookie has page information
        	options.url = "/sider/side0.html";
            options.pageNumber = undefined;
            // Cache some dom
            options.root = $(".site-wrapper");
            options.content = options.root.find(".site-content");
            options.paginator = options.root.find(".paginator");
            options.paginator.next = options.paginator.find(".next");
            options.paginator.prev = options.paginator.find(".prev");
            options.menu = options.root.find(".menu");
            options.menuItems = options.menu.find("li > a");
            // Custom event
            $(document).bind("load.page", function(event, options) {
				Engine.ui.open(options);
            });
			// Click events
			options.paginator.next.on("click", function() {
				options.pageturner = "next";
				$(document).trigger("load.page", options);
			});
			options.paginator.prev.on("click", function() {
				options.pageturner = "prev";
				$(document).trigger("load.page", options);
			});
            options.menuItems.each(function(i, link) {
            	$(link).on("click", function(event) {
            		event.preventDefault();
            		options.pageturner = "";
            		options.url = $(this)[0].pathname;
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
			$(document).trigger("load.page", options);
        },
        ui: {
        	open: function(options) {
        		if (!options.pageNumber) {
        			// Try to get pageNumber from url
        			options.pageNumber = options.url.match(/\d/g);
        			if (options.pageNumber) {
        				Engine.ui.urlHandler(options);
        			}
        		} else {
        			// Get pageNumber from url
        			options.pageNumber = options.url.match(/\d/g);
        		}
        		if (options.pageturner) {
        			// Previous page button pressed
        			if (options.pageturner === "prev") {
        				if (options.pageNumber >= 1) {
        					options.pageNumber--;
        					Engine.ui.urlHandler(options);
        				}
        			}
        			// Next page button pressed
        			if (options.pageturner === "next") {
        				options.pageNumber++;
        				Engine.ui.urlHandler(options);
        			}
        		} else {
        			Engine.ui.urlHandler(options);
        		}
        		// Get url content and add it to the page
        		options.content.load(options.url, function(response, textStatus, xhr) {
            		// If external page don't exists then roll back the pagenumber
            		// and append that to the url
            		if (textStatus === "error") {
        				console.log("error");
        				options.pageNumber--;
        				Engine.ui.urlHandler(options);
            		}
            		if (textStatus === "success") {
            			Engine.cookie.create('playbook', [ options.url, options.pageNumber ], 2);
            		}
        		});
        	},
        	urlHandler: function(options) {
        		// Append pageNumber to url
        		options.pageNumber = parseInt(options.pageNumber);
        		return options.url = options.url.replace(/\d/g, options.pageNumber);
        	},
        	open2: function(options) {
        		if (options.url === "" || options.url == null) {
        			console.log("history state is null");
        			options.url = "/sider/forside.html";
        		}
        		// Previous page button pressed
        		if (options.pageturner === "prev") {
        			console.log("prev was clicked");
        			return false;
        		}
        		// Next page button pressed
        		if (options.pageturner === "next") {
        			console.log("next was clicked");
        			return false;
        		}

        		//var url = data.split(",")[0];
        		options.content.load(options.url, function(response, textStatus, xhr) {
            		if (textStatus === "error") {
            		}
            		if (textStatus === "success") {
            		}
        		});
        	},
        	preload: function(options, url) {
        		// ...
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
		},
        fixes: {
            init: function () {                
				// Fix functions goes here
            }
        }        
    }
    // Initialize main script-Engine;
    Engine.init();
});

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