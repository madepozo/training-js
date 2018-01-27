var post = (function (){
    'use strict';

    var xhr;
    var SUCCESS = 200;

    xhr = new XMLHttpRequest();

    function get(postId, done) {
        xhr.open('GET', '/posts/' + postId);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status === SUCCESS) {
                done(JSON.parse(xhr.responseText));
            }
        };
        xhr.send();
    }

    function getAll(done) {
        xhr.open('GET', '/posts');
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status === SUCCESS) {
                done(JSON.parse(xhr.responseText));
            }
        };
        xhr.send();
    }

    function save(data, done) {
        var params;

        xhr.open('POST', '/posts');
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status === SUCCESS) {
                done(JSON.parse(xhr.responseText));
            }
        };
        params = Object.keys(data).map(function (key) {
            return key + '=' + encodeURIComponent(data[key]);
        }).join('&');
        xhr.send(params);
    }

    function remove(_id, done) {
        xhr.open('DELETE', '/posts/' + _id);
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status === SUCCESS) {
                done(JSON.parse(xhr.responseText));
            }
        };
        xhr.send();
    }

    function update(postId, data, done) {
        var params;

        xhr.open('PUT', '/posts/' + postId);
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function () {
            if (xhr.readyState > 3 && xhr.status === SUCCESS) {
                done(JSON.parse(xhr.responseText));
            }
        };
        params = Object.keys(data).map(function (key) {
            return key + '=' + encodeURIComponent(data[key]);
        }).join('&');
        xhr.send(params);
    }

    return {
        get: get,
        getAll: getAll,
        save: save,
        remove: remove,
        update: update
    };
})();