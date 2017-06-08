var
  assert = require( 'assert' ),
  Vinyl = require( 'vinyl' ),
  icons = require( '../src/index.js' );

describe( 'gulp-angular-inline-icons', () => {

  var file = new Vinyl({
    path: './icon.svg',
    contents: new Buffer( '<svg>hey</svg>' ),
  });

  it( 'should run, honestly', done => {

    var options = {
      module: 'a',
    };

    var output = `
      angular
        .module( 'a' )
        .constant( 'ICONS', {"icon":"<svg>hey</svg>"} );
    `;

    var stream = icons( options );

    stream.once( 'data', file => {

      var contents = file.contents.toString( 'utf-8' );
      assert.equal( contents, output );
      done();
    });

    stream.end( file );
  });


  it( 'should allow custom module name', done => {

    var options = {
      module: 'foobar',
    };

    var output = `
      angular
        .module( 'foobar' )
        .constant( 'ICONS', {"icon":"<svg>hey</svg>"} );
    `;

    var stream = icons( options );

    stream.once( 'data', file => {

      var contents = file.contents.toString( 'utf-8' );
      assert.equal( contents, output );
      done();
    });

    stream.end( file );
  });


  it( 'should allow custom constant name', done => {

    var options = {
      module: 'foobaz',
      constant: 'ICNS',
    };

    var output = `
      angular
        .module( 'foobaz' )
        .constant( 'ICNS', {"icon":"<svg>hey</svg>"} );
    `;

    var stream = icons( options );

    stream.once( 'data', file => {

      var contents = file.contents.toString( 'utf-8' );
      assert.equal( contents, output );
      done();
    });

    stream.end( file );
  });

});
