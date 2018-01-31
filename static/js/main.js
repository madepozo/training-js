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
            var $form, $post, classOperation, _post;

            $form = event.target;
            _post = {
                title: $form.title.value,
                description: $form.description.value
            };

            if ($form.classList.contains('form-create')) {
                post.save(_post, function (data) {
                    $form.reset();
                    $post = document.createElement('div');
                    $post.className = 'post';
                    $post.setAttribute('data-id', data._id);
                    $post.innerHTML = _.template(dom.templatePost.innerHTML)(data);
                    dom.container.appendChild($post);
                });
                dom.container.classList.remove('hide');
            } else {
                post.update($form._id.value, _post, function (data) {
                    var $post;

                    $post = qs('.post[data-id="' + data._id + '"]');
                    $post.innerHTML = _.template(dom.templatePost.innerHTML)(data);
                    $form.classList.remove('form-update');
                    $form.classList.add('form-create');
                    $form.reset();
                });
            }
        },
        handleDelete: function (event) {
            var $el, _id;

            $el = event.target;
            _id = $el.getAttribute('data-id');
            post.remove(_id, function (data) {
                var $postToDelete;

                $postToDelete = qs('.post[data-id="' + _id + '"]');
                $postToDelete.remove();

                if (!dom.container.children.length) {
                    dom.container.classList.add('hide');
                }
            });
        },
        handleUpdate: function (event) {
            var $el, postId;

            $el = event.target;
            postId = $el.getAttribute('data-id');
            $el.classList.add('disabled');
            post.get(postId, function (data) {
                dom.form.classList.remove('form-create');
                dom.form.classList.add('form-update');
                setFormToUpdate(data);
            });
        }
    };

    function setFormToUpdate(data) {
        Object.keys(data).forEach(function (key) {
            if (dom.form[key]) {
                dom.form[key].value = data[key];
            }
        });
    }

    function ready() {
        dom = {};
        catchDOM();
        post.getAll(function (data) {
            if (data.length) {
                renderPosts(data);
            }

            attachEvents();
        });
    }

    function attachEvents() {
        $on(dom.form, 'submit', Events.handleSubmit);
        delegate(dom.container, '.btn-delete', 'click', Events.handleDelete);
        delegate(dom.container, '.btn-update', 'click', Events.handleUpdate);
    }

    function catchDOM() {
        Object.keys(st).forEach(function (key) {
            dom[key] = qs(st[key]);
        });
    }

    function renderPosts(posts) {
        var templatePosts;

        templatePosts = _.template(dom.templatePosts.innerHTML);
        dom.container.innerHTML = templatePosts({
          posts: posts,
          template: dom.templatePost.innerHTML
        });
        dom.container.classList.remove('hide');
    }

    window.$on(document, 'DOMContentLoaded', ready);
})();