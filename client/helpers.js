Template.play.helpers({
	/*
	** Determines if the game is
	** ready with both players
	** present.
	*/
	gameReady: function() {
		if( Meteor.user() && typeof Meteor.user().currentGame !== 'undefined' ) {
			return !Games.findOne( Meteor.user().currentGame ).unfilled;
		}

		return false;
	},

	/*
	** Gets the other user's
	** Name.
	*/
	otherUser: function() {
		if( Meteor.user() && typeof Meteor.user().currentGame !== 'undefined' ) {
			var currentGame 	= Games.findOne( Meteor.user().currentGame ),
				otherUserId		= currentGame.player1 == Meteor.userId() ? currentGame.player2 : currentGame.player1,
				otherUserObj	=  Meteor.users.findOne( otherUserId );

			return otherUserObj.profile.name;
		}

		return "anonymous";
	},

	/*
	** Gets the current users's
	** score.
	*/
	playerScore: function() {
		if( Meteor.user() ) {
			if( typeof Meteor.user().score !== 'undefined' ) {
				return Meteor.user().score;
			}
		}

		return "?";
	},

	/*
	** Gets the other users's
	** score.
	*/
	otherPlayerScore: function() {
		if( Meteor.user() && typeof Meteor.user().currentGame !== 'undefined' ) {
			var	currentGame = Games.findOne( Meteor.user().currentGame );

			if( typeof currentGame !== 'undefined' ) {
				var otherPlayerId = currentGame.player1 == Meteor.userId() ? currentGame.player2 : currentGame.player1;

				if( typeof otherPlayerId !== 'undefined' ) {
					return Meteor.users.findOne( otherPlayerId ).score;
				}
			}
		}

		return "?";
	},

	/*
	** Checks if the current user
	** has already made a choice
	** but the other user hasn't.
	*/
	waitingOnUserChoice: function() {
		if( Meteor.user() && typeof Meteor.user().currentGame !== 'undefined' ) {
			var currentGame = Games.findOne( Meteor.user().currentGame );

			if( typeof currentGame.rounds !== 'undefined' ) {
				var rounds = currentGame.rounds;

				if( rounds.length ) {
					var currentRound = rounds[rounds.length - 1];

					if( Object.keys( currentRound ).length == 1 && currentRound.hasOwnProperty( Meteor.userId() ) ) {
						return true;
					}
				}
			}

		}

		return false;
	},

	/*
	** Checks if the round
	** winner has been declared.
	*/
	roundHasWinner: function() {
		if( Meteor.user() && typeof Meteor.user().currentGame !== 'undefined' ) {
			var rounds = Games.findOne( Meteor.user().currentGame ).rounds;

			if( typeof rounds !== 'undefined' ) {
				if( !rounds.length ) {
					return false;
				}

				var currentRound = rounds[rounds.length - 1];

				if( typeof currentRound !== 'undefined' && typeof currentRound.winner !== 'undefined' ) {
					if( currentRound.winner == 'draw' ) {
						return "it's a tie :/";
					}else if( currentRound.winner == Meteor.userId() ) {
						return "You win!";
					} else {
						return "You lose :(";
					}
				}
			}
		}

		return false;
	}
});