Meteor.methods({
	/*
	** Determines if a new game needs
	** to be created for the user, or
	** if there's a game with only one
	** player waiting for a second.
	*/
	createGame: function() {
		// TODO:
		// ~~~~~
		// * Fix allow functions to be
		//   secure
		//

		var unfilledGame = Games.findOne( { unfilled: true } );


		// Player 2:
		if( unfilledGame ) {

			// Don't allow one user to
			// become their own partner:
			if( unfilledGame.player1 == this.userId ) {
				return {
					gameId: unfilledGame._id,
					route: '/player1',
					whichPlayer: 'player1'
				};
			}

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

	/*
	** Takes the user choice and returns the
	** winner if the other user has already
	** sent their choice.
	*/
	makeChoice: function( choice ) {
		var currentUser		= Meteor.users.findOne( this.userId ),
			gameId			= currentUser.currentGame,
			currentGame		= Games.findOne( gameId ),
			roundNo			= 0;

		// The rounds array already exists:
		if( typeof currentGame.rounds !== 'undefined' ) {

			// There's already at least one round:
			if( currentGame.rounds.length ) {

				var roundEntries = Object.keys( currentGame.rounds[currentGame.rounds.length - 1] );

				// If the current round already has at
				// least 2 entries (meaning both players
				// have made their choice) it's time to
				// create a new round:
				if( roundEntries.length > 1 ) {
					roundNo = currentGame.rounds.length;
				}

				// Otherwise, let's finish up the current round:
				else {
					roundNo = currentGame.rounds.length - 1;
				}
			}
		}

		// Takes a round object as the argument,
		// returns the winner ID or 'draw' for a tie:
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

		// Starts a new round:
		function startRound() {
			var rounds	= currentGame.rounds || [],
				round	= {};

			round[currentUser._id] = choice;
			rounds.push( round );

			Games.update( gameId, {
				$set: {
					rounds: rounds
				}
			});
		}

		// Do the business:
		if( typeof currentGame.rounds !== 'undefined' ) {

			// The round has already exists:
			if( typeof currentGame.rounds[roundNo] !== 'undefined' ) {

				// The round has already been started by the other player:
				if( Object.keys( currentGame.rounds[roundNo] ).length ) {

					// Set data for this round:
					var currentRound = currentGame.rounds[roundNo];
					currentRound[currentUser._id] = choice;

					// Get the winner of this round:
					var winner = getWinner( currentRound );
					currentRound['winner'] = winner;

					// Tell the winner they won:
					Meteor.users.update( currentRound['winner'], {
						$inc: {
							score: 1
						}
					});

					// Remove the outdated round:
					Games.update( gameId, {
						$pop: {
							rounds: 1
						}
					});

					// Push the updated round:
					Games.update( gameId, {
						$push: {
							rounds: currentRound
						}
					});

					return currentRound['winner'];
				}
			}
		}

		// The round hasn't begun yet, start it:
		startRound();
	},

	/*
	** Forces a new round creation:
	*/
	forceNewRound: function() {
		var currentGameId = Meteor.users.findOne( this.userId ).currentGame;

		Games.update( currentGameId, {
			$push : {
				rounds: {}
			}
		});
	}
});