const mongoose = require('mongoose');
const Promise = require("bluebird");
const shuffle = require('shuffle-array');

const config = require('./environment');
const path = require("path"),
    fs = require("fs");