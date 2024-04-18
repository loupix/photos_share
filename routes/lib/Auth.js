AuthController = function() {};

AuthController.prototype.isConnected = function(req, res, next){
	if(req.session.isAuthenticated)
		return next();
	else
		return next(new Error("Need to be connected"));
	
}

AuthController.prototype.isAdmin = function(req, res, next){
	if(req.session.isAuthenticated){
		if(req.session.user.admin)
			return next();
		else
			return next(new Error("Need to be administrator"));
		
	}else
		return next(new Error("Need to be connected"));
	
}

module.exports = new AuthController();