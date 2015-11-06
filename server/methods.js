Meteor.methods({
	createGame: function() {
		if( Games.findOne( { unfilled: true } ) ) {
			console.log( 'adding to unfilled game' );
		} else {
			console.log( 'no unfilled games, create a new one' );
		}
	}
});