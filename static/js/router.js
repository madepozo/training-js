var Router = (function () {
    'use strict';

    function clearSlashes(path) {
        return path.toString().replace(/\/$/, '').replace(/^\//, '');
    }

    function config(options) {
        this.mode = options && options.mode && options.mode == 'history' 
                    && !!(history.pushState) ? 'history' : 'hash';
        this.root = options && options.root ? '/' + clearSlashes(options.root) + '/' : '/';
        return this;
    }

    function getFragment() {
        var fragment, match;
        
        fragment = '';

        if (this.mode === 'history') {
            fragment = clearSlashes(decodeURI(location.pathname + location.search));
            fragment = fragment.replace(/\?(.*)$/, '');
            fragment = this.root != '/' ? fragment.replace(this.root, '') : fragment;
        } else {
            match = location.href.match(/#(.*)$/);
            fragment = match ? match[1]: '';
        }

        return clearSlashes(fragment);
    }

    function add(re, handler) {
        if (typeof re === 'function') {
            handler = re;
            re = '';
        }

        this.routes.push({ re: re, handler: handler });
        return this;
    }

    function remove(param) {
        this.routes.forEach(function (route, index) {
            if (router.handler === param || router.re.toString() === param.toString()) {
                this.routes.splice(index, 1);
            }
        });

        return this;
    }

    function flush() {
        this.routes.length = 0;
        this.mode = null;
        this.root = '/';

        return this;
    }

    function check(f) {
        var fragment, i, match;
        fragment = this.root + (f || this.getFragment());
        
        for (i = 0; i < this.routes.length; i++ ) {
            match = fragment.match(this.routes[i].re);

            if (match) {
                match.shift();
                this.routes[i].handler.apply({}, match);
                return this;
            }
        }

        return this;
    }

    function listen() {
        var self, current, fn;

        self = this;
        current = self.getFragment();
        self.check(current);

        fn = function () {
            if (current !== self.getFragment()) {
                current = self.getFragment();
                self.check(current);
            }
        };
        clearInterval(this.interval);
        this.interval = setInterval(fn, 50);

        return this;
    }

    function navigate(path) {
        path = path || '';

        if (this.mode === 'history') {
            history.pushState(null, null, this.root + clearSlashes(path));
        } else {
            location.href = location.href.replace(/#(.*)$/, '') + '#' + path;
        }

        return this;
    }

    return {
        routes: [],
        mode: null,
        root: '/',
        add: add,
        remove: remove,
        flush: flush,
        config: config,
        getFragment: getFragment,
        check: check,
        listen: listen,
        navigate: navigate
    };
})();