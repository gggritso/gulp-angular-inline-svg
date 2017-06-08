'use strict';

module.exports = inlineSVG;

var
  through = require( 'through2' ),
  Vinyl = require( 'vinyl' ),
  path = require( 'path' ),
  SVGO = require( 'svgo' );

function inlineSVG( options = {}) {

  if ( !options.module ) throw new Error( 'gulp-angular-inline-svg: Need a module option!' );
  if ( !options.file ) options.file = 'icons.js';
  if ( !options.constant ) options.constant = 'ICONS';

  var
    icons = {},
    svgo = new SVGO();

  function runStream( file, enc, callback ) {

    if ( file.isNull() ) {
      callback();
      return;
    }

    if ( file.isStream() ) {
      this.emit( 'error', new Error( 'gulp-angular-inline-svg: No streaming support, sorry!' ) );
      callback();
      return;
    }

    var iconName = path.parse( path.basename( file.path ) ).name;

    if ( options.optimize ) {
      svgo
        .optimize( file.contents.toString( 'utf-8' ), optimizedSVG => {
          icons[ iconName ] = optimizedSVG;
          callback();
        });
    } else {
      icons[ iconName ] = file.contents.toString( 'utf-8' );
      callback();
    }

  }

  function endStream( callback ) {

    var contents = `
      angular
        .module( '${ options.module }' )
        .constant( '${ options.constant }', ${ JSON.stringify( icons, 2 ) } );
    `;

    var file = new Vinyl({
      path: options.file,
      contents: new Buffer( contents, 'utf-8' ),
    });

    this.push( file );
    callback();
  }

  return through.obj( runStream, endStream );
}
