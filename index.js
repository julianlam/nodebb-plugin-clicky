var	fs = require('fs'),
	path = require('path'),

	winston = module.parent.require('winston'),
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
			res.status(200).json(Plugin.settings);
		} else {
			res.send(501);
		}
	});

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

module.exports = Plugin;
