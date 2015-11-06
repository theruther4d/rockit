Meteor.methods({
	createGame: function() {
		// TODO:
		// ~~~~~
		// * Fix issue where one user
		//   can become his own opponent
		//
		// * Fix access issue for updating
		// * User currentGame
		//

		var unfilledGame = Games.findOne( { unfilled: true } );

		// Player 2:
		if( unfilledGame ) {
			console.log( 'adding to unfilled game' );

			return {
				gameId: ( Games.update( unfilledGame._id, {
					$set: {
						player2: this.userId,
						unfilled: false
					}
				})),
				route: '/player2'
			};
		}

		// Player 1:
		else {
			console.log( 'no unfilled games, create a new one' );

			return {
				gameId: ( Games.insert( {
					player1: this.userId,
					unfilled: true
				})),
				route: '/player1'
			};
		}
	}
});