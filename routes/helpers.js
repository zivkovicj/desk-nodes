const authorizedUser = (req, res, next) => {
  
    if (req.session.authenticated) {
      return next();
    } else {
      res.redirect('/login')
    }
    
  }

  module.exports = authorizedUser;