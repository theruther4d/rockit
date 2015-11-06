Meteor.methods({
	createGame: function() {
		// TODO:
		// ~~~~~
		// * Fix issue where one user
		//   can become his own opponent
		//
		// * Fix allow functions to be
		//   secure
		//

		var unfilledGame = Games.findOne( { unfilled: true } );

		// Player 2:
		if( unfilledGame ) {
			console.log( 'adding to unfilled game' );

			Games.update( unfilledGame._id, {
				$set: {
					player2: this.userId,
					unfilled: false
				}
			});

			return {
				gameId: unfilledGame._id,
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
	},

	makeChoice: function( choice ) {
		var currentUser		= Meteor.users.findOne( this.userId ),
			gameId			= currentUser.currentGame,
			currentGame		= Games.findOne( gameId ),
			roundNo			= typeof currentGame.rounds == "undefined" ? 0 : currentGame.rounds.length - 1,
			whichPlayer		= currentGame.player1 == currentUser._id ? "player1" : "player2",
			roundHasStarted	= typeof currentGame.rounds !== 'undefined' && typeof currentGame.rounds[roundNo] !== 'undefined' && currentGame.rounds[roundNo].length;

		console.log( 'roundNo: ', roundNo );
		console.log( 'whichPlayer: ', whichPlayer );
		console.log( 'roundHasStarted: ', roundHasStarted );

		function getWinner( round ) {
			var roundKeys	= Object.keys( round ),
				choice1		= round[roundKeys[0]],
				choice2		= round[roundKeys[1]];

			if( choice1 == "rock" ) {
				if( choice2 == "paper" ) {				// rock vs paper, user2 wins
					return roundKeys[1];
				} else if( choice2 == "scissors" ) {	// rock vs scissors, user1 wins
					return roundKeys[0];
				}

				return "draw";
			} else if( choice1 == "paper" ) {
				if( choice2 == "scissors" ) {
					return roundKeys[1];				// paper vs scissors, user2 wins
				} else if( choice2 == "rock" ) {
					return roundKeys[0];				// paper vs rock, user1 wins
				}

				return "draw";
			} else {
				if( choice2 == "rock" ) {
					return roundKeys[1];				// scissors vs rock, user2 wins
				} else if( choice2 == "paper" ) {
					return roundKeys[0];				// scissors vs paper, user1 wins
				}
			}
		}

		function startRound() {
			var rounds	= [],
				round	= {};

			round[whichPlayer] = choice;
			rounds[0] = round;

			Games.update( gameId, {
				$set: {
					rounds: rounds
				}
			});
		}

		// if this is the first round:
		if( !roundNo ) {
			if( typeof currentGame.rounds !== 'undefined' ) {

				// The round has already been started by the other player:
				if( typeof currentGame.rounds[roundNo] !== 'undefined' ) {

					// Set data for this round:
					var currentRound = currentGame.rounds[roundNo];
					currentRound[whichPlayer] = choice;

					// Get the winner of this round:
					var winner = getWinner( currentRound );
					currentRound['winner'] = winner;

					Games.update( gameId, {
						$set: {
							rounds: currentRound
						}
					});
				} else {
					console.log( 'currentGame.rounds[roundNo] was undefined' );
					startRound();
				}
			} else {
				console.log( 'currentGame.rounds was undefined' );
				startRound();
			}
		} else {
			console.log( 'on round 2 or higher' );
		}
	}
});