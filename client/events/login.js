Template.login.events( {
	'click .button.button--facebook': function( e ) {
		e.preventDefault();

		Meteor.loginWithFacebook( {}, function( err ) {
			if( err ) {
				console.log( 'login error: ', err );
			} else {
				Meteor.call( 'createGame', function( err, res) {
					if( err ) {
						console.log( 'error calling createGame method' );
					} else {
						console.log( 'res: ', res );
						FlowRouter.go( res.route );
						Session.set( 'playerScore', 0 );
						Session.set( 'whichPlayer', res.whichPlayer );
						Meteor.users.update( Meteor.userId(), {
							$set: {
								"currentGame": res.gameId
							}
						});
					}
				});
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