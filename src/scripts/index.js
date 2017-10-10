'use strict';
import '../styles/main.scss';
import Router from './router';

document.addEventListener('DOMContentLoaded', () => {

    const router = new Router();
    Backbone.history.start();
});

