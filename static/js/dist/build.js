/* DIS/PLAY Script 
    Author's name: Nicolaj Lund Nielsen
    Modified by:
    Client name: DIS/PLAY
    Date of creation: 18 / 8 2014
*/

/*
 * TODO: Is history API needed?
 * TODO: Use cookiea again?
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
            // Default site state
        	options.url = "/sider/forside.html";
            //options.pageNumber = "";
            // Cache some dom
            options.root = $(".site-wrapper");
            options.content = options.root.find(".site-content");
            options.paginator = options.root.find(".paginator");
            options.paginator.next = options.paginator.find(".next");
            options.paginator.prev = options.paginator.find(".prev");
            options.menu = options.root.find(".menu");
            options.menuItems = options.menu.find("li > a");
            // Custom events
            $(document).bind("load.page", function(event, options) {
				console.log(history.state);
				Engine.ui.open2(options);
            });
			// Click events
			options.paginator.next.on("click", function() {
				history.forward();
				//Engine.ui.open(options, options.url, options.pageNumber, "next");
				/*options.paginator = "next";
				$(document).trigger("load.page", options);*/
			});
			options.paginator.prev.on("click", function() {
				history.back();
				//Engine.ui.open(options, options.url, options.pageNumber, "prev");
				/*options.paginator = "prev";
				$(document).trigger("load.page", options);*/
			});
            options.menuItems.each(function(i, link) {
            	$(link).on("click", function(event) {
            		event.preventDefault();
            		options.url = event.target.href;
					history.pushState(options.url, event.target.textContent, options.url);
					$(document).trigger("load.page", options);
					//Engine.ui.open2(options);
            	});
            });
			window.addEventListener('popstate', function(event) {
				console.log('popstate fired!', event.state);
				options.url = event.state;
				$(document).trigger("load.page", options);
			});
			console.log(history.state, document.location.pathname);
			/*if (!document.location.pathname === "/") {
				console.log("path er ikke /");
				document.location.href = "/hest";
			}*/
			history.replaceState(document.location.href, document.title, document.location.href);
			$(document).trigger("load.page", options);
            // Check page status cookie.
            // If cookie stores page and pagenumber then open that page.
            /*var pageStatus = Engine.cookie.read('playbook');
            if (pageStatus) {
            	options.url = pageStatus.split(",")[0];
            	options.pageNumber = pageStatus.split(",")[1];
				Engine.ui.open(options, options.url, options.pageNumber);
            }*/
        },
        fixes: {
            init: function () {                
				// Fix functions goes here
            }
        },        
        ui: {
        	open2: function(options) {
        		//console.log(options, data);
        		if (options.url === "" || options.url == null) {
        			console.log("history state is null");
        			options.url = "/sider/forside.html";
        		}
        		// Previous page button pressed
        		if (options.paginator === "prev") {
        			console.log("prev was clicked");
        			return false;
        		}
        		// Next page button pressed
        		if (options.paginator === "next") {
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
        	open: function(options, url, pageNumber, paginator) {
        		// If we don't have a pageNumber then get it from url
        		// else set pageNumber on options object
        		if (!pageNumber) {
        			options.pageNumber = url.match(/\d/g)[0];
        		} else {
        			options.pageNumber = pageNumber;
        		}
        		// Previous page button pressed
        		if (paginator === "prev") {
        			if (options.pageNumber > 1) {
        				options.pageNumber--;
        			}
        		}
        		// Next page button pressed
        		if (paginator === "next") {
        			options.pageNumber++;
        		}
        		// Append pageNumber to url
        		options.url = url.replace(/\d/g, options.pageNumber);
        		// Get url content and add it to the page
        		options.content.load(options.url, function(response, textStatus, xhr) {
            		// If external page don't exists then roll back the pagenumber
            		// and append that to the url
            		if (textStatus === "error") {
        				options.pageNumber--;
        				options.url = url.replace(/\d/g, options.pageNumber);
            		}
            		if (textStatus === "success") {
            			console.log(window.history);
            			var stateObj = Engine.cookie.read('playbook');
            			//window.history.pushState(stateObj, "Side " + options.pageNumber, options.url);
            			//Engine.cookie.create('playbook', [ options.url, options.pageNumber ], 2);
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