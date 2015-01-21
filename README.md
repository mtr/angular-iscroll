# angular-iscroll
AngularJS module that enables iScroll 5 functionality, wrapping it in an easy-to-use directive

## Install

To check out a development version, start by cloning the repository, by
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
You may have a look at an Angular [demo app](http://mtr.github.io/angular-iscroll/examples/) that shows how you can use the `iscroll` directive.  For example, the demo shows how to handle DOM content generated dynamically through [ngRepeat](https://docs.angularjs.org/api/ng/directive/ngRepeat).
