'use strict';

var mongoose = require('mongoose');
var Post = mongoose.model('Posts');

exports.list_all_posts = function (req, res) {
    Post.find({}, function (err, data) {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });
};

exports.create_a_post = function (req, res) {
    var post = new Post(req.body);

    post.save(function (err, data) {
        if (err) {
            res.send(err);
        }
        res.json(data);
    });
};

exports.read_a_post = function (req, res) {
    Post.findById(req.params.postId, function (err, data) {
        if (err) {
            res.send(err);
        }

        res.json(data);
    });
};

exports.update_a_post = function (req, res) {
    var body = req.body;

    body.updated_date = new Date();
    Post.findOneAndUpdate({ _id: req.params.postId }, req.body, { new: true }, function (err, data) {
        if (err) {
            res.send(err);
        }

        res.json(data);
    });
};

exports.delete_a_post = function (req, res) {
    Post.remove({
        _id: req.params.postId
    }, function (err, data) {
        if (err) {
            res.send(err);
        }

        res.json({ message: 'Post successfully deleted'});
    });
};