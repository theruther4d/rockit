Template.play.events({
	'click .button.button--play-again': function( e ) {
		e.preventDefault();

		Meteor.call( 'forceNewRound' );
	}
});