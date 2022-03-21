const express = require('express')
const mongoose = require('mongoose')


const Userschema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    rationNo: {
        type: Number,
        required: true,
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    state: {
        tyep: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
        trim: true
    },
    distributerName: {
        type: String,
        required: true,
        trim: true
    },
    distributerNo: {
        type: String,
        required: true,
        trim: true
    }
})


const User = mongoose.model('user', Userschema)
module.exports = User