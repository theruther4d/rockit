FlowRouter.route( '/', {
	name: 'home',
	action: function() {
		BlazeLayout.render( 'main', { content: 'home' } );
	}
});

FlowRouter.route( '/login', {
	name: 'login',
	action: function() {
		BlazeLayout.render( 'main', { content: 'login' } );
	}
})

FlowRouter.route( '/player1', {
	name: 'player1',
	action: function() {
		BlazeLayout.render( 'main', { content: 'play' } );
	}
});

FlowRouter.route( '/player2', {
	name: 'player1',
	action: function() {
		BlazeLayout.render( 'main', { content: 'play' } );
	}
});