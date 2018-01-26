(function () {
    'use strict'
    window.qs = function (selector, scope) {
        return (scope || document).querySelector(selector);
    };

    window.qsa = function (selector, scope) {
        return (scope || document).querySelectorAll(selector);
    };

    window.$on = function (element, type, handle, useCapture) {
        element.addEventListener(type, handle, !!useCapture);
    };

    window.delegate = function (target, selector, type, handler ) {
        function dispatchEvent(event) {
            var targetElement = event.target;
            var elements = window.qsa(selector);
            var hasMatch = [].indexOf.call(elements, targetElement) > -1;

            if (hasMatch) {
                handler.call(targetElement, event);
            }
        }

        window.$on(target, type, dispatchEvent);        
    };

    if (NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }
})();

