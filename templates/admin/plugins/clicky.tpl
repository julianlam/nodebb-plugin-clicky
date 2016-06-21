<h1><i class="fa fa-bar-chart-o"></i> Clicky Web Analytics</h1>

<div class="alert alert-info">
	<p>
		This plugin allows you to track visitors to your NodeBB, including getting detailed view rates per topic/category.
	</p>
	<p>
		Once you have an account, paste your site ID into the field below, and restart your NodeBB.
	</p>
</div>

<form role="form" class="clicky-settings">
	<fieldset>
		<div class="form-group">
			<label for="id">Tracking ID</label>
			<input type="text" class="form-control" id="id" name="id" placeholder="100XXXXXX" />
			<label for="id">Admin Site key(use only if you want to enable custom user logging)</label>
			<input type="text" class="form-control" id="adminkey" name="adminkey" placeholder="admin site key" />
		</div>

		<button class="btn btn-lg btn-primary" id="save" type="button">Save</button>
	</fieldset>
</form>

<script type="text/javascript">
	require(['settings'], function(Settings) {
		Settings.load('clicky', $('.clicky-settings'));

		$('#save').on('click', function() {
			Settings.save('clicky', $('.clicky-settings'), function() {
				app.alert({
					type: 'success',
					alert_id: 'clicky-saved',
					title: 'Settings Saved'
				});
			});
		});
	});
</script>
