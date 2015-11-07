ServiceConfiguration.configurations.remove( {
	service: 'facebook'
});

ServiceConfiguration.configurations.insert( {
    service: 'facebook',
    appId: '878966168866896',
    secret: '01ceac4e3bad937c426a468650635ebc'
});

// Get the user's facebook photo:
Accounts.onCreateUser( function( options, user ) {
	if( options.profile ) {
		options.profile.picture = "http://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=small";
		user.profile = options.profile;
	}
	return user;
});