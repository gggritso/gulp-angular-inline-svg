# gulp-angular-inline-svg

You:
- have SVG files you’d like to use
- are using Angular 1.x
- don’t want to use sprites

We:
- provide a Gulp task that concatenates your icons into an Angular constant

You:
- inject the constant into your components (or create a component wrapper)
- drop the SVG into your markup using `ng-bind-html` or something similar
- use CSS to size and style your SVG files in markup
- celebrate

## Installation

```
npm install gulp-angular-inline-svg
```

## Gulp Example

```
var gulp = require( 'gulp' );
var icons = require( 'gulp-angular-inline-svg' );

gulp.task( 'icons', function() {
  gulp.src( './icons/*.svg' )
    .pipe( icons({
      module: 'myApp',
    }) )
    .pipe( gulp.dest( './' ) );
});
```

## Options
The task `icons` takes in an options object like so `.pipe( icons( options ) )`. The available options are:
- `module` the name of the Angular module that goes into the result file
- `constant` the name of the Angular constant that goes into the result file
- `file` the result filename
- `optimize` whether to run the files through SVGO to optimize the markup

## SVGO Options
The plugin runs everything through [SVGO](https://github.com/svg/svgo). If you need to pass SVGO option, you can do so using the second argument, like this:

```
    .pipe( icons({
      module: 'myApp',
    }, {
      removeDoctype: true,
    }) )
```

## Usage Recommendation

The best way to use this is through a component like this:

```
angular
  .module( 'myApp' )
  .component( 'svg-icon', {
    template: '{{ $ctrl.markup }}',
    controller: mctIconController,
    bindings: { name: '@' },
  });

function iconController( ICONS, $sce ) {
  this.markup = $sce.trustAsHtml( ICONS[ this.name] );
}
```

which you can use in a page like so:

```
<icon name="clock"></icon>
```

## Under-The-Hood
A directory like this:

```
icons/
├── clock.svg
└── shopper.svg
```

With this gulp file:

```
var gulp = require( 'gulp' );
var icons = require( 'gulp-angular-inline-svg' );

gulp.task( 'icons', function() {
  gulp.src( './icons/*.svg' )
    .pipe( icons({
      module: 'myApp',
      constant: 'ICNS',
      optimize: true,
      file: 'icns.js',
    }) )
    .pipe( gulp.dest( './' ) );
});
```

Will create a file called `icns.js` that looks like this:

```
angular
  .module( 'myApp' )
  .constant( 'ICNS', {
    clock: '<svg version="1.0" encoding=" etc etc etc </path></svg>',
    shopper: '<svg version="1.0" encoding=" etc etc etc </path></svg>',
  });
```
