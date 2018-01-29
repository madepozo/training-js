var post = (function (){
    'use strict';

    return {
        get: function (postId, done) {
            $.get('/posts/' + postId, done);
        },
        getAll: function (done) {
            $.get('/posts', done);
        },
        save: function (data, done) {
            $.post('/posts', data, done);
        },
        remove: function (_id, done) {
            $.ajax({
                url: '/posts/' + _id,
                method: 'delete',
                success: done
            });
        },
        update: function (postId, data, done) {
            $.ajax({
                method: 'put',
                url: '/posts/' + postId,
                data: data,
                success: done
            });
        }
    };
})();