Games = new Mongo.Collection( 'games' );

Meteor.users.allow({
	update: function( userId, doc, fields, modifier ) {
		return userId == doc.userId && fields.isEqualTo( ['currentGame'] );
	}
});