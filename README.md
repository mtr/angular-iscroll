# angular-iscroll
AngularJS module that enables iScroll 5 functionality, wrapping it in an easy-to-use directive

## Install

Install the [angular-iscroll NPM package](https://www.npmjs.com/package/angular-iscroll)
```bash
npm install --save angular-iscroll
```

Install through Bower
```bash
bower install --save angular-iscroll
```

Or, to check out a development version, start by cloning the repository, by
```bash
git clone git@github.com:mtr/angular-iscroll.git
```
Then, install the necessary dependencies:
```bash
cd angular-iscroll/
npm install
```
After that, you should have a `dist` directory with a subdirectory named `lib`:
```
dist/
└── lib
    ├── angular-iscroll.js
    └── angular-iscroll.min.js
```

### Build

To rebuild the library, run
```bash
gulp            # or "gulp watch" (to rebuild on every file change)
```

To build the examples, run
```bash
gulp examples   # (will rebuild on every file change)
```


## Demo
You may have a look at [core-layout](http://mtr.github.io/core-layout/examples/) ([GitHub repo](https://github.com/mtr/core-layout/)), an Angular demo app that shows how you can use the `iscroll` directive in a responsive-design web-app with support for both drawers (slide-out menus) and modals.  For example, the demo shows how to handle DOM content generated dynamically through [ngRepeat](https://docs.angularjs.org/api/ng/directive/ngRepeat).

## Usage

In the following, `IScroll` (with capital 'I' and 'S') refers to instances 
of the [iScroll Javascript library](http://iscrolljs.com/) that this package provides an AngularJS wrapper for. 

The main usage pattern for `angular-iscroll` is to define a dependency on the `angular-iscroll` module in your AngularJS app.  For example: 
```js
angular.module('myApp', ['angular-iscroll']);
```
or, in a Browserify-based code base:
```js
angular.module('myApp', [require('angular-iscroll').name]);
```

The `angular-iscroll` module includes both a directive, `iscroll`, and a service, `iScrollService`, which gives you access to and control over a shared, global state of whether to enable, disable, or refresh the `IScroll` instances for each `iscroll` directive instance.

Next, to use the directive, you should set up your HTML template like
```html
…
<body ng-controller="MyAppController as app"
      ng-class="{
      'iscroll-on': app.iScrollState.useIScroll,
      'iscroll-off': !app.iScrollState.useIScroll
      }">
<div class="iscroll-wrapper" iscroll>
  <div class="iscroll-scroller">
  </div>
</div>
…
```
Let me explain the essential parts of that HTML example.  First of all, the `iscroll` directive is an attribute of an element belonging to the `iscroll-wrapper` class, which wraps an element of the `iscroll-scroller` class.  Those two classes are defined in the [SASS](http://sass-lang.com/) file [dist/lib/scss/_iscroll.scss](dist/lib/scss/_iscroll.scss), but they don't have any meaning unless they occur inside an `iscroll-on` class; and that's where the shared, global state from iScrollService comes in.  The controller, `MyAppController`, in the above example exposes the state variable shared by iScrollService in its scope
```js
function MyAppController(iScrollService) {
    var vm = this;  // Use 'controller as' syntax 

    vm.iScrollState = iScrollService.state;
}
```
thereby providing a way to globally change the meaning of the `iscroll-wrapper` + `iscroll-scroller` combination.  Please note: To get more info about the "controller as" syntax, you might enjoy [John Papa's AngularJS Style Guide](https://github.com/johnpapa/angularjs-styleguide#controlleras-with-vm).

Furthermore, the global iScroll state exposed by the service should be changed through the service's `enable([signalOnly])`, `disable([signalOnly])`, and `toggle([signalOnly])` methods, where each method will change the state accordingly, and then emit a corresponding signal from `$rootScope` that gets picked up and handled by the available `angular-iscroll` directive instances.  If the `signalOnly` flag is `true`, then the state is not changed by the service method, but the signal is sent nonetheless.  If the directives receive an `iscroll:disabled` signal, they will destroy any existing `IScroll` instances, and if they receive an `iscroll:enabled` signal, they will create a new `IScroll` instances per directive instance if it doesn't already exist.

It should also be noted that during instantiation, in the directive's post-link phase, the `iscroll` directive will check the `iScrollService`'s `useIScroll` state to decide whether or not it will create an actual `IScroll` instance.  Consequently, if you would like to create an AngularJS solution that uses iScroll only on, for example, iOS devices, you should determine the current browser type early, probably inside the app controller's [configuration block](https://docs.angularjs.org/guide/module#module-loading-dependencies), and set the service's `useIscroll` state accordingly.  Please note that `angular-iscroll` does not contain any code to detect which browser or platform it is currently running on, which is a separate, complex task better solved by specialized libraries, like [platform.js](https://github.com/bestiejs/platform.js).


### Manual Interaction with Each Directive's IScroll Instance
If you want access to a scope's `IScroll` instance, you can supply an optional 
`iscroll-instance` attribute when applying the `iscroll` directive, like
```html
…
<div class="iscroll-wrapper" iscroll iscroll-instance="instance">
  <div class="iscroll-scroller">
  </div>
</div>
…
```
That way, the scope's `instance` variable will hold a reference to the actual
 `IScroll` instance, so you can access the IScroll instance's own API, for 
 example to define [custom events](http://iscrolljs.com/#custom-events) or 
 access its [scroller info](http://iscrolljs.com/#scroller-info).


### Configuration
I've designed this module so that it should be easy to configure.  First of all, you can supply per-instance options, both for `IScroll` and the directive itself, when you apply the directive.  For example
```html
<div iscroll="{mouseWheel: true, momentum: true, refreshInterval: 500}">…</div>
```
would pass along the options `{mouseWheel: true, momentum: true}` to `IScroll`, while the directive-specific configuration parameter, `{refreshInterval: 500}`, is only interpreted by the directive.  Any config option not recognized as a directive-specific option, will be forwarded to `IScroll`.

There are lots of configuration options for IScroll itself; those are best [documented by iScroll](http://iscrolljs.com/#configuring).

#### Directive Options
The directive provides two configuration options:

- `asyncRefreshDelay` (default `0`): defines the delay, in ms, before the directive asynchronously performs an IScroll.refresh().  If `false`, then no async refresh is performed.  This can come in handy when you need to wait for the DOM to be rendered before `IScroll` can know the size of its scrolling area.
- `refreshInterval` (default `false`): a delay, in ms, between each periodic iScroll.refresh().  If `false`, then no periodic refresh is performed.  This functionality can be handy in complex applications, where it might be difficult to decide when `iScrollService.refresh()` should be called, and a periodic call to `IScroll.refresh()`, for example every 500 ms, might provide a smooth user experience.  To avoid scroll stuttering caused by calls to refresh during an ongoing scroll operation, the `angular-iscroll` directive prevents `refresh()` calls if IScroll is currently performing a scroll operation.

#### Globally Configuring the Directive's Default Options

The `iscroll` directive gets its default configuration from the `iScrollService`.  To provide a way to easily, globally configure the defaults for all `iscroll` instances, the module defines an `iScrollServiceProvider` which can be injected into the app controller's configuration block which is guaranteed to run before the controller is used anywhere.  For example:
```js
/* @ngInject */
function _config(iScrollServiceProvider) {
    iScrollServiceProvider.configureDefaults(/* Supply your default configuration object here. */);
}

angular
    .module('myApp', ['angular-iscroll'])
    .config(_config);
```
The configuration you provide this way will serve as the updated global default for all `iscroll` directive instances.

Please note that the above example relies on [ng-annotate](https://www.npmjs.com/package/ng-annotate) for adding AngularJS dependency-injection annotations during builds, as indicated by the `/* @ngInject */` comment.
