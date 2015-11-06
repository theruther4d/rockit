Template.play.helpers({
	gameReady: function() {
		if( Meteor.user() && typeof Meteor.user().currentGame !== 'undefined' ) {
			return !Games.findOne( Meteor.user().currentGame ).unfilled;
		}

		return false;
	}
});