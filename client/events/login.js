Template.login.events( {
	'click .button.button--facebook': function( e ) {
		e.preventDefault();

		Meteor.loginWithFacebook( {}, function( err ) {

		});
	}
})