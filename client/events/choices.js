Template.choices.events({
	'click .button.choice': function( e ) {
		e.preventDefault();

		Meteor.call( 'makeChoice', $( e.target ).attr( 'data-choice' ), function( err, res ) {
			if( err ) {
				console.log( "err: ", err );
			}

			console.log( "res: ", res );
		});
	}
})