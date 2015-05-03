'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
	name: {
		type: String,
		ref: 'Name'
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	photo: {
		type: String,
		ref: 'Photo'
	},
	comment_body: {
		type: String,
		ref: 'comment_body',
		required: true
	},
	created: {
		type: Date,
		default: Date.now
	}
});

mongoose.model('Comment', CommentSchema);