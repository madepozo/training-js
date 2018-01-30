(function() {
    'use strict';

    let st, dom, Events, post;

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
        handleSubmit: (event) => {
            event.preventDefault();
            let $form, $post, classOperation, _post;

            $form = event.target;
            _post = {
                title: $form.title.value,
                description: $form.description.value
            };

            if ($form.classList.contains('form-create')) {
                post.save(_post, data => {
                    $form.reset();
                    $post = document.createElement('div');
                    $post.className = 'post';
                    $post.setAttribute('data-id', data._id);
                    $post.innerHTML = _.template(dom.templatePost.innerHTML)(data);
                    dom.container.appendChild($post);
                });
            } else {
                post.update($form._id.value, _post, function (data) {
                    let $post;

                    $post = qs('.post[data-id="' + data._id + '"]');
                    $post.innerHTML = _.template(dom.templatePost.innerHTML)(data);
                    $form.classList.remove('form-update');
                    $form.classList.add('form-create');
                    $form.reset();
                });
            }
        },
        handleDelete: ({ target: $el }) => {
            let _id;

            _id = $el.getAttribute('data-id');
            post.remove(_id, function (data) {
                let $postToDelete;

                $postToDelete = qs(`.post[data-id="${_id}"`);
                $postToDelete.remove();
            });
        },
        handleUpdate: ({ target: $el }) => {
            let postId;

            postId = $el.getAttribute('data-id');
            $el.classList.add('disabled');
            post.get(postId, data => {
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
        post = new Post();
        catchDOM();
        post.getAll(data => {
            renderPosts(data);
            attachEvents();
        });
    }

    function attachEvents() {
        $on(dom.form, 'submit', Events.handleSubmit);
        delegate(dom.container, '.btn-delete', 'click', Events.handleDelete);
        delegate(dom.container, '.btn-update', 'click', Events.handleUpdate);
    }

    function catchDOM() {
        Object.keys(st).forEach(k => dom[k] = qs(st[k]));
    }

    function renderPosts(posts) {
        let templatePosts, template;

        templatePosts = _.template(dom.templatePosts.innerHTML);
        template = dom.templatePost.innerHTML;
        dom.container.innerHTML = templatePosts({ posts, template });
    }

    window.$on(document, 'DOMContentLoaded', ready);
})();