$(document).ready(function() {
	$.get(RELATIVE_PATH + '/api/plugins/clicky').success(function(config) {
		// Clicky Snippet
		var clicky_site_ids = clicky_site_ids || [];
		clicky_site_ids.push(parseInt(config.id, 10));
		(function() {
			var s = document.createElement('script');
			s.type = 'text/javascript';
			s.async = true;
			s.src = '//static.getclicky.com/js';
			( document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0] ).appendChild( s );
		})();

		$('body').append('<noscript><p><img alt="Clicky" width="1" height="1" src="//in.getclicky.com/' + config.id + 'ns.gif" /></p></noscript>');
		initClicky(parseInt(config.id, 10));

		// Page pushing
		$(window).on('action:ajaxify.end', function(ev, data) {
			if (window.hasOwnProperty('clicky')) {
				if (app && app.user && (app.user.username !== 'Guest') && config.serverLogEnabled) {
					$.post(RELATIVE_PATH + '/api/plugins/clicky', {
						username: app.user.username,
						href: window.location.href,
						title: document.title
					}).fail(function() {
						if (window.console) {
							console.warn('[plugins/clicky] clicky server logging failed.');
						}
					});
				} else {
					clicky.log(data.url, document.title, 'pageview');
				}
			}
		});
	}).fail(function() {
		if (window.console) {
			console.warn('[plugins/clicky] Your Clicky Web Analytics Site ID could not be retrieved. Please double-check that it is set in the plugin\'s settings.');
		}
	});

	var initClicky = function(id) {
		if (!window.hasOwnProperty('clicky')) {
			setTimeout(function() {
				initClicky(id);
			}, 500);
		} else {
			clicky.init(id);
		}
	}
});
