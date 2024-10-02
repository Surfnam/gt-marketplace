import express from 'express';

export const authenticate = (req, res, next) => {
    console.log(req.session);
    if (!req.session.user || !req.session.authenticated) {
        console.log(req.session);
        return res.status(401).json({message: "user unauthorized, cannot access user information"});
        //redirect to login page.
        //return res.redirect('/login');
    }

    next();
}