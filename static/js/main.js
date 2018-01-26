(function() {
    'use strict';

    var st, dom, Events;

    _.templateSettings = {
        evaluate: /\{\%(.+?)\%\}/g,
        interpolate: /\{\{(.+?)\}\}/g,
        escape: /<%-([\s\S]+?)%>/g
    };

    st = {
        container: '.posts',
        templatePosts: '.tplPosts',
        templatePost: '.tplPost',
        form: '.form-create',
    };

    Events = {
        handleSubmit: function (event) {
            event.preventDefault();
            var post, $form, $post;

            $form = event.target;
            post = {
                title: $form.title.value,
                description: $form.description.value
            };

            savePost(post, function (data) {
                $form.reset();
                $post = document.createElement('div');
                $post.className = 'post';
                $post.setAttribute('data-id', data._id);
                $post.innerHTML = _.template(dom.templatePost.innerHTML)(data);
                dom.container.appendChild($post);
            });
        },
        handleDelete: function (event) {
            var $el, _id;

            $el = event.target;
            _id = $el.getAttribute('data-id');
            removePost(_id, function (data) {
                var $postToDelete;

                $postToDelete = document.querySelector('[data-id="' + _id + '"]');
                $postToDelete.remove();
            });
        }
    };

    function removePost(_id, cb) {
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', '/posts/' + _id);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status === 200) {
                cb(JSON.parse(xhr.responseText));
            }
        };

        xhr.send();
    }

    function savePost(post, cb) {
        var xhr, params;
        
        xhr = new XMLHttpRequest();
        xhr.open('POST', '/posts');
        params = Object.keys(post).map(function (key) {
            return key + '=' + encodeURIComponent(post[key]);
        }).join('&');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status === 200) {
                cb(JSON.parse(xhr.responseText));
            }
        };
        xhr.send(params);
    }

    function ready() {
        dom = {};
        catchDOM();
        getPosts(function (data) {
            renderPosts(data);
            dom.btnDelete = document.querySelectorAll('.btn-delete');
            attachEvents();
        });
    }

    function attachEvents() {
        dom.form.addEventListener('submit', Events.handleSubmit);
        [].forEach.call(dom.btnDelete, function (btn) {
            //btn.addEventListener('click', Events.handleDelete);
        });
    }

    function catchDOM() {
        Object.keys(st).forEach(function (key) {
            dom[key] = document.querySelector(st[key]);
        });
    }

    function renderPosts(posts) {
        var templatePosts;

        templatePosts = _.template(dom.templatePosts.innerHTML);
        dom.container.innerHTML = templatePosts({
          posts: posts,
          template: dom.templatePost.innerHTML
        });
    }

    function getPosts(cb) {
        var xhr;

        xhr = new XMLHttpRequest();

        xhr.open('GET', '/posts');
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status === 200) {
                cb(JSON.parse(xhr.responseText));
            }
        };

        xhr.send();
    }

    document.addEventListener('DOMContentLoaded', ready);
})();