'use strict';

module.exports = function (app) {
    var postController = require('../controllers/postController');

    app.route('/posts')
        .get(postController.list_all_posts)
        .post(postController.create_a_post);

    app.route('/posts/:postId')
        .get(postController.read_a_post)
        .put(postController.update_a_post)
        .delete(postController.delete_a_post)
};