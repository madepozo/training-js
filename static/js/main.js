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
        redirectToCreate: '.redirect-create'
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
            dom.form.classList.add('hide');
            Router.navigate();
        },
        handleDelete: function (event) {
            var $el, _id;

            $el = event.target;
            _id = $el.getAttribute('data-id');
            post.remove(_id, function (data) {
                var $postToDelete;

                $postToDelete = qs('.post[data-id="' + _id + '"]');
                $postToDelete.remove();
            });
        },
        handleUpdate: function (event) {
            var $el, postId;

            $el = event.target;
            postId = $el.getAttribute('data-id');
            Router.navigate('/posts/' + postId + '/edit');
        },
        handleRedirect: function (event) {
            Router.navigate('/create');
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
        setRouter();
    }

    function attachEvents() {
        $on(dom.form, 'submit', Events.handleSubmit);
        $on(dom.redirectToCreate, 'click', Events.handleRedirect);
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

    function setRouter() {
        Router.config({ mode: 'history' });
        Router
            .add('/create', function () {
                attachEvents();
                dom.redirectToCreate.classList.add('hide');
                dom.container.classList.add('hide');
                dom.form.classList.remove('hide');
            })
            .add('/posts\/(.*)\/edit', function (postId) {
                attachEvents();
                dom.redirectToCreate.classList.add('hide');
                dom.container.classList.add('hide');
                post.get(postId, function (data) {
                    dom.form.classList.remove('hide');
                    dom.form.classList.remove('form-create');
                    dom.form.classList.add('form-update');
                    setFormToUpdate(data);
                });
            })
            .add(function () {
                dom.redirectToCreate.classList.remove('hide');
                dom.form.classList.add('hide');
                post.getAll(function (data) {
                    attachEvents();
                    renderPosts(data);
                });
            })
            .listen();
    }

    window.$on(document, 'DOMContentLoaded', ready);
})();