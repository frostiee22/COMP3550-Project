


function checkAuth(req, res, next) {
    if (!req.session.user_id) {
        res.send(401, "You are not authorized to view this page");
        res.redirect("/");
    } else {
        next();
    }
}

module.exports = {
    'checkAuth' : checkAuth
}
