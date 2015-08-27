$(document).ready(function() {
	console.log('ready')
	$('tbody button').on('click', function() {
		console.log('click')
		var mac_address = $(this).attr('mac');
		var method = $(this).attr('name');
		var form = $('form[name="' + method + '"]');

		form.find('input').val(mac_address);
		form.submit();
	});
});