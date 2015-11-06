Meteor.publish( 'games', function() {
	return Games.find( {} );
});

Meteor.publish( 'users', function() {
	return Meteor.users.find( {}, { fields: {
		"currentGame": true,
		"services.facebook.name": true,
		"profile.name": true,
		"score": true
	}});
});