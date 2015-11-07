Games = new Mongo.Collection( 'games' );

// TODO:
// ~~~~~
// * Secure the users collection:
//

Meteor.users.allow({
	update: function( userId, doc, fields, modifier ) {
		return true;
	}
});