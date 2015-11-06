Template.login.events( {
	'click .button.button--facebook': function( e ) {
		e.preventDefault();

		Meteor.loginWithFacebook( {}, function( err ) {
			if( err ) {
				// Do something with the error
				console.log( 'login error: ', err );
			} else {
				Meteor.call( 'createGame' );
			}
		});
	},
	'click .button.button--logout': function( e ) {
		e.preventDefault();

		Meteor.logout( function( err ) {
			if( err ) {
				console.log( 'logout error: ', err );
			}
		});
	}
});