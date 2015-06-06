var SimpleMvc;
(function (SimpleMvc) {
    var Exception = (function () {
        function Exception(message, name) {
            this.message = message;
            this.name = name;
            if (!this.name)
                this.name = "ApplicationException";
        }
        return Exception;
    })();
    SimpleMvc.Exception = Exception;
})(SimpleMvc || (SimpleMvc = {}));
var SimpleMvc;
(function (SimpleMvc) {
    /**
     * You can reduce network traffic by storing frequently needed objects in the cache.
     * By specifying time-to-live you can control how stale data is allowed to get.
     */
    var Cache = (function () {
        function Cache() {
            this.objects = {};
        }
        Cache.prototype.setValue = function (key, value, secondsToLive) {
            var expirationTime = new Date().getTime() + secondsToLive * 1000;
            this.objects[key] = { value: value, expirationTime: expirationTime };
        };
        Cache.prototype.getValue = function (key) {
            var val = this.objects[key];
            if (!val)
                return null;
            if (val.expirationTime < new Date().getTime()) {
                delete this.objects[key];
                return null;
            }
            return val.value;
        };
        Cache.prototype.removeValue = function (key) {
            delete this.objects[key];
        };
        Cache.prototype.clear = function () {
            this.objects = {};
        };
        Cache.prototype.clean = function () {
            var expired = [];
            var now = new Date().getTime();
            for (var key in this.objects) {
                var val = this.objects[key];
                if (val.expirationTime < now)
                    expired.push(key);
            }
            for (var i = 0; i < expired.length; i++)
                delete this.objects[expired[i]];
        };
        return Cache;
    })();
    SimpleMvc.Cache = Cache;
    var CachedValue = (function () {
        function CachedValue() {
        }
        return CachedValue;
    })();
})(SimpleMvc || (SimpleMvc = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SimpleMvc;
(function (SimpleMvc) {
    /**
     * Your model objects and your custom controls can implement events to let other parts of the
     * application know that something has happened.
     */
    var Event = (function () {
        function Event() {
            this.listeners = [];
        }
        Event.prototype.trigger = function (sender, eventArgs) {
            for (var i = 0; i < this.listeners.length; i++) {
                this.listeners[i].call(sender, sender, eventArgs);
            }
        };
        Event.prototype.addListener = function (listener) {
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i] == listener) {
                    throw new SimpleMvc.Exception("Listener already added.");
                }
            }
            this.listeners.push(listener);
        };
        Event.prototype.removeListener = function (listener) {
            for (var i = 0; i < this.listeners.length; i++) {
                if (this.listeners[i] == listener) {
                    this.listeners.splice(i, 1);
                    return;
                }
            }
        };
        return Event;
    })();
    SimpleMvc.Event = Event;
    var EventArgs = (function () {
        function EventArgs() {
        }
        EventArgs.Empty = new EventArgs();
        return EventArgs;
    })();
    SimpleMvc.EventArgs = EventArgs;
    var PropertyChangedEventArgs = (function (_super) {
        __extends(PropertyChangedEventArgs, _super);
        function PropertyChangedEventArgs() {
            _super.apply(this, arguments);
        }
        return PropertyChangedEventArgs;
    })(EventArgs);
    SimpleMvc.PropertyChangedEventArgs = PropertyChangedEventArgs;
})(SimpleMvc || (SimpleMvc = {}));
/// <reference path="typings/jquery/jquery.d.ts" />
var SimpleMvc;
(function (SimpleMvc) {
    /**
     * Each URL path in your app will have a corresponding controller, which should be a subclass of this class.
     * The controller is responsible for rendering the entire page and handling user input as well as UI events.
     * A new instance of the controller is created each time the user navigates to the path.
     * Data that must live longer than the page should be stored in your subclass of App, or in the cache.
     *
     * You can have a hierarchy of controllers, with parts that are common to all pages rendered by the base controller.
     */
    var Controller = (function () {
        function Controller() {
            this.loaded = false;
        }
        /**
         * Renders the page, and sets up event handlers.
         * Note that since the user can press the refresh button of the browser, the controller is
         * responsible for rendering the entire page, not just the portions that have changed.
         */
        Controller.prototype.load = function (params) {
            $(document.body).empty().off();
            this.loaded = true;
        };
        /**
         * Check if this controller is still loaded.
         * When an ajax call returns, update the UI only if this method returns true.
         */
        Controller.prototype.isLoaded = function () {
            return this.loaded;
        };
        /**
         * Whether the controller is unloadable is returned through a callback.
         * This gives the controller the opportunity to display a "Do you want to save?" dialog.
         */
        Controller.prototype.isUnloadable = function (callback) {
            // This method is meant to be overridden.
            callback(true);
        };
        /**
         * Performs any cleanup or finalization that must be performed before the page is torn down.
         */
        Controller.prototype.unload = function () {
            this.loaded = false;
        };
        return Controller;
    })();
    SimpleMvc.Controller = Controller;
    var PageNotFoundController = (function (_super) {
        __extends(PageNotFoundController, _super);
        function PageNotFoundController() {
            _super.apply(this, arguments);
        }
        PageNotFoundController.prototype.load = function (params) {
            $(document.body).empty().append('<div class="page-not-found">Page not found</div>');
        };
        return PageNotFoundController;
    })(Controller);
    SimpleMvc.PageNotFoundController = PageNotFoundController;
})(SimpleMvc || (SimpleMvc = {}));
/// <reference path="Controller.ts" />
var SimpleMvc;
(function (SimpleMvc) {
    /**
     * The router is responsible for unloading and loading controllers when a page navigation
     * happens inside your app. You must associate paths with controllers when your application starts.
     * Each time the user navigates to a specific path/page a new instance of the controller will be created.
     */
    var Router = (function () {
        function Router(app) {
            this.routes = {};
            this.app = app;
            this.attachHashChangeHandler();
        }
        /** Associates a path with a controller class. */
        Router.prototype.addRoute = function (path, controllerClass) {
            this.routes[path] = controllerClass;
        };
        /**
         * Sets a custom resolver that examines the path and the query parameters and returns
         * a controller class and extra parameters to pass to the controller.
         */
        Router.prototype.setCustomResolver = function (resolver) {
            this.resolver = resolver;
        };
        /** Loads the controller corresponding to the browser's current location. */
        Router.prototype.loadController = function () {
            var _this = this;
            var result = this.parseHash();
            var controllerClass = this.routes[result.path.trim().toLowerCase()];
            if (!controllerClass && this.resolver) {
                var resolverResult = this.resolver(result.path, result.query);
                if (resolverResult) {
                    controllerClass = resolverResult.controllerClass;
                    $.extend(result.query, resolverResult.extraParams);
                }
            }
            if (!controllerClass)
                controllerClass = SimpleMvc.PageNotFoundController;
            if (this.currentController) {
                this.currentController.isUnloadable(function (unloadable) {
                    if (unloadable)
                        _this.loadNewController(controllerClass, result.query);
                    else
                        _this.restoreHash();
                });
            }
            else {
                this.loadNewController(controllerClass, result.query);
            }
        };
        /** Loads the supplied controller and sets it as the current controller. */
        Router.prototype.loadNewController = function (controllerClass, query) {
            if (this.currentController)
                this.currentController.unload();
            this.currentHash = window.location.hash;
            this.currentController = new controllerClass(this.app);
            this.currentController.load(query);
        };
        /** Restores hash to its previous value. */
        Router.prototype.restoreHash = function () {
            if (window.location.hash != this.currentHash)
                this.updateHash(this.currentHash);
        };
        /** Removes the hash change handler. */
        Router.prototype.detachHashChangeHandler = function () {
            window.onhashchange = null;
        };
        /** Attaches the hash change handler. */
        Router.prototype.attachHashChangeHandler = function () {
            var _this = this;
            window.onhashchange = function () {
                _this.loadController();
            };
        };
        /** Updates the hash without reloading the page. */
        Router.prototype.updateHash = function (hash) {
            var _this = this;
            this.detachHashChangeHandler();
            window.location.hash = hash;
            window.setTimeout(function () {
                _this.attachHashChangeHandler();
            }, 0);
        };
        /** Replaces a query parameter in the browser's location without reloading the page. */
        Router.prototype.replaceQueryParameter = function (parameter, newValue) {
            var result = this.parseHash();
            result.query[parameter] = newValue;
            var hash = result.path + '?' + this.constructQueryString(result.query);
            this.updateHash(hash);
        };
        /** Constructs the query part of the hash from the supplied name value pairs. */
        Router.prototype.constructQueryString = function (query) {
            var q = [];
            for (var key in query) {
                var value = query[key];
                q.push(key + '=' + encodeURIComponent(value));
            }
            return q.join('&');
        };
        /** Parses the query part of the hash. */
        Router.prototype.parseQuery = function (q) {
            var query = {};
            var pairs = q.split('&');
            for (var i = 0; i < pairs.length; i++) {
                var v = pairs[i];
                var pair = v.split('=');
                if (pair.length > 0) {
                    var name, value;
                    name = pair[0];
                    if (pair.length > 1)
                        value = pair[1];
                    else
                        value = '';
                    query[name] = decodeURIComponent(value);
                }
            }
            return query;
        };
        /** Parses the hash from the browser's current location. */
        Router.prototype.parseHash = function () {
            var path = "/";
            var query = {};
            if (window.location.hash && window.location.hash.length > 1) {
                var t = window.location.hash.substring(1);
                var i = t.indexOf('?');
                if (i == -1) {
                    path = t;
                }
                else {
                    path = t.substring(0, i);
                    var q = t.substring(i + 1);
                    query = this.parseQuery(q);
                }
            }
            return { path: path, query: query };
        };
        /** Navigates the app to the new path. */
        Router.prototype.navigate = function (path, query) {
            var q = query ? ('?' + this.constructQueryString(query)) : '';
            window.location.hash = '#' + path + q;
        };
        /** This enables your App subclass to talk to the currently active controller. */
        Router.prototype.getCurrentController = function () {
            return this.currentController;
        };
        return Router;
    })();
    SimpleMvc.Router = Router;
})(SimpleMvc || (SimpleMvc = {}));
/// <reference path="Exception.ts" />
/// <reference path="Cache.ts" />
/// <reference path="Event.ts" />
/// <reference path="Router.ts" />
/// <reference path="Controller.ts" />
var SimpleMvc;
(function (SimpleMvc) {
    /**
     * This is the root object of the application.
     * Do not use this class directly, make your own subclass instead.
     */
    var App = (function () {
        function App() {
            this.router = new SimpleMvc.Router(this);
            this.cache = new SimpleMvc.Cache();
            if (App.instance)
                throw new SimpleMvc.Exception("App instance exists; use getInstance() instead.");
            App.instance = this;
            App.setupCacheCleaner();
        }
        /** This method must be called after your App subclass is fully initialized. */
        App.prototype.load = function () {
            this.router.loadController();
        };
        App.prototype.getCache = function () {
            return this.cache;
        };
        App.prototype.getRouter = function () {
            return this.router;
        };
        App.getInstance = function () {
            return this.instance;
        };
        /**
         * Navigates the app to the page corresponding to the supplied URL.
         * @path path to the page for example "/bank/deposits" will set the location to http://localhost/#/bank/deposits
         */
        App.prototype.navigate = function (path, queryParams) {
            if (!path || path[0] != '/' || path.indexOf('#') != -1)
                throw new SimpleMvc.Exception("Invalid path");
            this.router.navigate(path, queryParams);
        };
        App.setupCacheCleaner = function () {
            if (App.cacheCleaningIntervalMinutes > 0) {
                window.setInterval(function () {
                    App.getInstance().getCache().clean();
                }, App.cacheCleaningIntervalMinutes * 60 * 1000);
            }
        };
        App.cacheCleaningIntervalMinutes = 5;
        return App;
    })();
    SimpleMvc.App = App;
})(SimpleMvc || (SimpleMvc = {}));
