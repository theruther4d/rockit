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
			Games.update( unfilledGame._id, {
				$set: {
					player2: this.userId,
					unfilled: false
				}
			});

			Meteor.users.update( this.userId, {
				$set: {
					score: 0
				}
			}, function( err, res ) {
				if( err ) {
					console.log( 'error setting intial score: ', err );
				} else {
					console.log( 'result of setting intial score: ', res );
				}
			});

			return {
				gameId: unfilledGame._id,
				route: '/player2',
				whichPlayer: 'player2'
			};
		}

		// Player 1:
		else {

			Meteor.users.update( this.userId, {
				$set: {
					score: 0
				}
			}, function( err, res ) {
				if( err ) {
					console.log( 'error setting intial score: ', err );
				} else {
					console.log( 'result of setting intial score: ', res );
				}
			});

			return {
				gameId: ( Games.insert( {
					player1: this.userId,
					unfilled: true
				})),
				route: '/player1',
				whichPlayer: 'player1'
			};
		}
	},

	makeChoice: function( choice ) {
		var currentUser		= Meteor.users.findOne( this.userId ),
			gameId			= currentUser.currentGame,
			currentGame		= Games.findOne( gameId ),
			otherUserId		= currentGame.user1 == currentUser._id ? currentGame.user2 : currentGame.user1,
			otherUser		= Meteor.users.findOne( otherUserId ),
			roundNo			= typeof currentGame.rounds == "undefined" ? 0 : currentGame.rounds.length - 1,
			whichPlayer		= currentGame.player1 == currentUser._id ? "player1" : "player2";

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

				return "draw";
			}
		}

		function startRound() {
			var rounds	= [],
				round	= {};

			round[currentUser._id] = choice;
			rounds.push( round );

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
					currentRound[currentUser._id] = choice;

					// Get the winner of this round:
					var winner = getWinner( currentRound );
					currentRound['winner'] = winner;

					Meteor.users.update( currentRound['winner'], {
						$inc: {
							score: 1
						}
					});

					Games.update( gameId, {
						$pop: {
							rounds: 1
						}
					});

					Games.update( gameId, {
						$push: {
							rounds: currentRound
						}
					});
				} else {
					startRound();
				}
			} else {
				startRound();
			}
		} else {
			console.log( 'on round 2 or higher' );
		}
	}
});