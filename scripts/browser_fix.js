#!/usr/bin/env node

var fs = require("fs");
const replace = require('replace-in-file');

const options = {
    files: __dirname + "/../platforms/browser/www/js/core.js",
    from: /myApp.useLocalConnection = false;/g,
    to: 'myApp.useLocalConnection = true;',
};


replace(options)
    .then(changedFiles => {
        console.log('Modified Local Connection files:', changedFiles.join(', '));
    })
    .catch(error => {
        console.error('Error occurred:', error);
    });

