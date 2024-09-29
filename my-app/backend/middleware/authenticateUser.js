import express from 'express';

export const authenticate = (req, res, next) => {
    if (!req.session.user || !req.session.authenticated) {
        //redirect to login page.
        return res.redirect('/login');
    }
    next();
}