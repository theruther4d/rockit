Meteor.methods({
	createGame: function() {
		// TODO:
		// ~~~~~
		// * Fix issue where one user
		//   can become his own opponent
		//
		// * Add /player1 and /player2 routes
		//

		var unfilledGame = Games.findOne( { unfilled: true } );

		// Player 1:
		if( unfilledGame ) {
			console.log( 'adding to unfilled game' );

			Games.update( unfilledGame._id, {
				$set: {
					player2: this.userId,
					unfilled: false
				}
			});

			FlowRouter.go( '/player1' );
		}

		// Player 2:
		else {
			console.log( 'no unfilled games, create a new one' );

			Games.insert( {
				player1: this.userId,
				unfilled: true
			});

			FlowRouter.go( '/player2' );
		}
	}
});