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