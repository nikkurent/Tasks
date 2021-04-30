const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const crypto = require('crypto');
const config = require('../config/database')

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        minlength: 2,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    sessions: [{
        token:{
            type: String,
            required: true,
         },
        expiresAt: {
            type: Number,
            required: true
        }
    }]
});

/* Omits User password and sessions fields */
userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    return _.omit(userObject, ['password', 'sessions']);
};

userSchema.methods.generateAccessToken = function() {
    const user = this;
    return new Promise((resolve, reject) => {
        jwt.sign({_id: user._id}, config.accessTokenSecret , {expiresIn: '15m'}, (err, accessToken) => {
            if (err) {
                reject(err);
            } else {
                resolve(accessToken);
            }
        });
    })
}

userSchema.methods.generateRefreshToken = function() {
    const user = this;
    return new Promise((resolve, reject) => {
        jwt.sign({_id: user._id}, config.refreshTokenSecret, (err, refreshToken) => {
            if (err) {
                reject(err);
            } else {
                resolve(refreshToken);
            }
        });
    })
}

userSchema.methods.createSession = function() {
    const user = this;
    const expireAt = generateRefreshTokenExpiryTime();

    return user.generateRefreshToken().then((refreshToken) => {
        return new Promise((resolve, reject) => {
            user.sessions.push({ 'token': refreshToken, 'expiresAt': expireAt });
            user.save().then(() => {
                return resolve(refreshToken);
            }).catch((err) => {
                reject(err);
            })
        })
    }).catch((err) => {
        return Promise.reject(`Failed to save session to database. \n` + err)
    })
}


userSchema.statics.hasRefreshTokenExpired = (expiresAt) => {
    let secondsToExpire = Date.now() / 1000;
    if (expiresAt > secondsToExpire) return false;
    return true;
}

userSchema.statics.findByCredentials = function(email, password) {
    const user = this;
    return user.findOne({email: email, password: password});
}


userSchema.statics.findByIdAndToken = function(userId, refreshToken) {
    const user = this;
    return user.findOne({_id: userId, 'sessions.token': refreshToken});
}

userSchema.statics.getAccessToken = function() {
    return config.accessTokenSecret;
}


/* HELPER METHODS */
let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpire = "10";
    let secondsUntilExpire = ((daysUntilExpire * 24) * 60) * 60;
    //let secondsUntilExpire = 15
    return ((Date.now() / 1000) + secondsUntilExpire);
}

const User = mongoose.model('User', userSchema)
module.exports = { User }