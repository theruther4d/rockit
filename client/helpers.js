Template.play.helpers({
	gameReady: function() {
		if( Meteor.user() && typeof Meteor.user().currentGame !== 'undefined' ) {
			return !Games.findOne( Meteor.user().currentGame ).unfilled;
		}

		return false;
	},
	otherUser: function() {
		if( Meteor.user() && typeof Meteor.user().currentGame !== 'undefined' ) {
			var currentGame 	= Games.findOne( Meteor.user().currentGame ),
				otherUserId		= currentGame.player1 == Meteor.userId() ? currentGame.player2 : currentGame.player1,
				otherUserObj	=  Meteor.users.findOne( otherUserId );

			return otherUserObj.profile.name;
		}

		return "anonymous";
	},
	playerScore: function() {
		if( Meteor.user() ) {
			if( typeof Meteor.user().score !== 'undefined' ) {
				return Meteor.user().score;
			}
		}

		return "?";
	},
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
	roundHasWinner: function() {
		if( Meteor.user() && typeof Meteor.user().currentGame !== 'undefined' ) {
			var rounds = Games.findOne( Meteor.user().currentGame ).rounds;

			if( typeof rounds !== 'undefined' ) {
				var currentRound = rounds.length ? rounds[0] : rounds[rounds.length - 1];

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