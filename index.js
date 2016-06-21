var	fs = require('fs'),
	path = require('path'),

	winston = module.parent.require('winston'),
  request = module.parent.require('request'),
	Meta = module.parent.require('./meta'),

	db = module.parent.require('./database'),

	Plugin = {
		settings: {}
	};

Plugin.init = function(data, callback) {
	function render(req, res, next) {
		res.render('admin/plugins/clicky', {});
	}

	data.router.get('/admin/plugins/clicky', data.middleware.admin.buildHeader, render);
	data.router.get('/api/admin/plugins/clicky', render);
	data.router.get('/api/plugins/clicky', function(req, res) {
		if (Plugin.settings) {
			res.status(200).json({
				id: Plugin.settings.id,
				serverLogEnabled: !!Plugin.settings.adminkey
			});
		} else {
			res.send(501);
		}
	});

	data.router.post('/api/plugins/clicky', Plugin.logCustomData);

	// Load asset ID from config
	Plugin.loadSettings();

	callback();
};

Plugin.loadSettings = function() {
	Meta.settings.get('clicky', function(err, settings) {
		if (!err && settings.id && settings.id.length) {
			Plugin.settings = settings;
		} else {
			winston.error('A Clicky Site ID (e.g. 100XXXXXX) was not specified. Please complete setup in the administration panel.');
		}
	});
};

Plugin.onConfigChange = function(hash) {
	if (hash === 'settings:clicky') {
		Plugin.loadSettings();
	}
};

Plugin.routeMenu = function(custom_header, callback) {
	custom_header.plugins.push({
		"route": '/plugins/clicky',
		"icon": 'fa-bar-chart-o',
		"name": 'Clicky Web Analytics'
	});

	callback(null, custom_header);
};

Plugin.getNotices = function(notices, callback) {
	notices.push({
		done: Plugin.settings.id !== undefined && Plugin.settings.id.length > 0,
		doneText: 'Clicky Web Analytics OK',
		notDoneText: 'Clicky Web Analytics needs setup'
	});

	callback(null, notices);
}

Plugin.logCustomData = function(req, res) {
	if (!Plugin.settings.adminkey) {
		return res(400);
	}
	var ip = req.ip;
	var username = req.body.username || 'Guest';
	var ua = req.headers['user-agent'] || '';
	var refferer = req.headers['Referer'] || '';
	var siteid = Plugin.settings.id;
	var sitekeyAdmin = Plugin.settings.adminkey;
	var href = req.body.href;
	var title = req.body.title;
	var qs = {
		site_id: siteid,
		sitekey_admin: sitekeyAdmin,
		type: 'custom',
		ref: refferer,
		ua: ua,
		ip_address: ip,
		href: href,
		title: title,
		custom: {
			username: username
		}
	};

	request.get({
		url: 'http://in.getclicky.com/in.php',
		qs: qs
	}, function(err, response, body) {
		if (err) {
			res.sendStatus(501);
		} else {
			res.sendStatus(200);
		}
	});
}

module.exports = Plugin;
