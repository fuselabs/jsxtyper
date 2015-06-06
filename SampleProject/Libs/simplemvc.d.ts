/// <reference path="../typings/jquery/jquery.d.ts" />
declare module SimpleMvc {
    class Exception {
        message: string;
        name: string;
        constructor(message: string, name?: string);
    }
}
declare module SimpleMvc {
    /**
     * You can reduce network traffic by storing frequently needed objects in the cache.
     * By specifying time-to-live you can control how stale data is allowed to get.
     */
    class Cache {
        private objects;
        constructor();
        setValue(key: string, value: any, secondsToLive: number): void;
        getValue(key: string): any;
        removeValue(key: string): void;
        clear(): void;
        clean(): void;
    }
}
declare module SimpleMvc {
    /**
     * Your model objects and your custom controls can implement events to let other parts of the
     * application know that something has happened.
     */
    class Event<T1, T2 extends EventArgs> {
        private listeners;
        trigger(sender: T1, eventArgs: T2): any;
        addListener(listener: (sender: T1, eventArgs: T2) => void): void;
        removeListener(listener: (sender: T1, eventArgs: T2) => void): void;
    }
    class EventArgs {
        static Empty: EventArgs;
    }
    class PropertyChangedEventArgs extends EventArgs {
        propertyName: string;
    }
}
declare module SimpleMvc {
    /**
     * Each URL path in your app will have a corresponding controller, which should be a subclass of this class.
     * The controller is responsible for rendering the entire page and handling user input as well as UI events.
     * A new instance of the controller is created each time the user navigates to the path.
     * Data that must live longer than the page should be stored in your subclass of App, or in the cache.
     *
     * You can have a hierarchy of controllers, with parts that are common to all pages rendered by the base controller.
     */
    class Controller {
        private loaded;
        /**
         * Renders the page, and sets up event handlers.
         * Note that since the user can press the refresh button of the browser, the controller is
         * responsible for rendering the entire page, not just the portions that have changed.
         */
        load(params: QueryParams): void;
        /**
         * Check if this controller is still loaded.
         * When an ajax call returns, update the UI only if this method returns true.
         */
        isLoaded(): boolean;
        /**
         * Whether the controller is unloadable is returned through a callback.
         * This gives the controller the opportunity to display a "Do you want to save?" dialog.
         */
        isUnloadable(callback: (unloadable: boolean) => void): void;
        /**
         * Performs any cleanup or finalization that must be performed before the page is torn down.
         */
        unload(): void;
    }
    interface ControllerClass {
        new (app: App): Controller;
    }
    class PageNotFoundController extends Controller {
        load(params: QueryParams): void;
    }
}
declare module SimpleMvc {
    /**
     * The router is responsible for unloading and loading controllers when a page navigation
     * happens inside your app. You must associate paths with controllers when your application starts.
     * Each time the user navigates to a specific path/page a new instance of the controller will be created.
     */
    class Router {
        private routes;
        private resolver;
        private app;
        /** The currently active controller. */
        private currentController;
        /** The hash corresponding to the current controller. */
        private currentHash;
        constructor(app: App);
        /** Associates a path with a controller class. */
        addRoute(path: string, controllerClass: ControllerClass): void;
        /**
         * Sets a custom resolver that examines the path and the query parameters and returns
         * a controller class and extra parameters to pass to the controller.
         */
        setCustomResolver(resolver: Resolver): void;
        /** Loads the controller corresponding to the browser's current location. */
        loadController(): void;
        /** Loads the supplied controller and sets it as the current controller. */
        private loadNewController(controllerClass, query);
        /** Restores hash to its previous value. */
        private restoreHash();
        /** Removes the hash change handler. */
        private detachHashChangeHandler();
        /** Attaches the hash change handler. */
        private attachHashChangeHandler();
        /** Updates the hash without reloading the page. */
        updateHash(hash: string): void;
        /** Replaces a query parameter in the browser's location without reloading the page. */
        replaceQueryParameter(parameter: string, newValue: string): void;
        /** Constructs the query part of the hash from the supplied name value pairs. */
        private constructQueryString(query);
        /** Parses the query part of the hash. */
        private parseQuery(q);
        /** Parses the hash from the browser's current location. */
        parseHash(): {
            path: string;
            query: QueryParams;
        };
        /** Navigates the app to the new path. */
        navigate(path: string, query?: QueryParams): void;
        /** This enables your App subclass to talk to the currently active controller. */
        getCurrentController(): Controller;
    }
    interface QueryParams {
        [index: string]: string;
    }
    /** Custom resolver function. */
    type Resolver = (path: string, params: QueryParams) => ResolverResult;
    /** The return type of custom resolver. */
    interface ResolverResult {
        /** The controller class corresponding to the hash */
        controllerClass: ControllerClass;
        /** Extra query parameters to be passed to the controller */
        extraParams?: QueryParams;
    }
}
declare module SimpleMvc {
    /**
     * This is the root object of the application.
     * Do not use this class directly, make your own subclass instead.
     */
    class App {
        static cacheCleaningIntervalMinutes: number;
        private static instance;
        private router;
        private cache;
        constructor();
        /** This method must be called after your App subclass is fully initialized. */
        load(): void;
        getCache(): Cache;
        getRouter(): Router;
        static getInstance(): App;
        /**
         * Navigates the app to the page corresponding to the supplied URL.
         * @path path to the page for example "/bank/deposits" will set the location to http://localhost/#/bank/deposits
         */
        navigate(path: string, queryParams?: QueryParams): void;
        private static setupCacheCleaner();
    }
}
