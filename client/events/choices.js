Template.choices.events({
	'click .button.choice': function( e ) {
		e.preventDefault();

		Meteor.call( 'makeChoice', $( e.target ).attr( 'data-choice' ) );
	}
})