$(function () {
    var dom, st, Events;
    _.templateSettings = {
        evaluate: /\{\%(.+?)\%\}/g,
        interpolate: /\{\{(.+?)\}\}/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    
    st = {
        container: '.posts',
        templatePosts: '.tplPosts',
        templatePost: '.tplPost',
        form: '.form-create'
    };

    Events = {
        handleSubmit: function (event) {
            event.preventDefault();
            var $form, $post, _id;

            $form = event.target;
            _post = {
                title: $form.title.value,
                description: $form.description.value
            };
            _id = $form._id.value;
            $form = $($form);

            if ($form.hasClass('form-create')) {
                post.save(_post, function (data) {
                    $post = $('<div>', {class: 'post'});
                    $post.data('id', data._id);
                    $post.html(_.template(dom.templatePost.html())(data));
                    dom.container.append($post);
                    $form.get(0).reset();
                });                
            } else {
                post.update(_id, _post, function (data) {
                    var $post;

                    $post = $('.post[data-id="' + data._id + '"]');
                    $post.html(_.template(dom.templatePost.html())(data));
                    $form.removeClass('form-update').addClass('form-create');
                    $form.get(0).reset();
                });
            }
        },
        handleUpdate: function (event) {
            var $el;

            $el = $(event.target).addClass('disabled');
            post.get($el.data('id'), function (data) {
                dom.form
                    .removeClass('form-create')
                    .addClass('form-update');
                setFormToUpdate(data);
            });
        },
        handleDelete: function (event) {
            var $el, _id;

            $el = $(event.target);
            _id = $el.data('id');
            post.remove(_id, function (data) {
                $('.post[data-id="' + _id + '"]').remove();
            });
        }
    };

    function ready() {
        dom = {};
        catchDOM();
        post.getAll(function (data) {
            renderPosts(data);
            attachEvents();
        });
    }

    function catchDOM() {
        Object.keys(st).forEach(function (key) {
            dom[key] = $(st[key]);
        });
    }

    function attachEvents() {
        dom.form.on('submit', Events.handleSubmit);
        dom.container.delegate('.btn-update', 'click', Events.handleUpdate);
        dom.container.delegate('.btn-delete', 'click', Events.handleDelete);
    }

    function renderPosts(posts) {
        var templatePosts, data;

        data = {
            posts: posts,
            template: dom.templatePost.html()
        };
        templatePosts = _.template(dom.templatePosts.html());
        dom.container.html(templatePosts(data));
    }

    function setFormToUpdate(data) {
        var $form;

        $form = dom.form.get(0);        
        Object.keys(data).forEach(function (key) {
            if ($form[key]) {
                $form[key].value = data[key];
            }
        });
    }

    ready();
});
