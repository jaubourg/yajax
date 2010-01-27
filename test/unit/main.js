test( "success - single" , function() {
	
	stop();
	expect( 2 );
	
	yajax( {
		url: "http://www.google.com" ,
		success: function( data ) {
			ok( /<html/i.test( data ) , "Contains html tag" );
		},
		error: function() {
			ok( false , "error issued" );
		},
		complete: function( data ) {
			strictEqual( 1 * data.status , 200 , "200 OK status received" );
			start();
		}
	} );
	
} );

test( "success - multiple - one call" , function() {
	
	stop();
	expect( 4 );
	
	yajax( {
		url: "http://www.google.com" ,
		success: function( data ) {
			ok( /<html/i.test( data ) , "Contains html tag" );
		},
		error: function() {
			ok( false , "error issued" );
		},
		complete: function( data ) {
			strictEqual( 1 * data.status , 200 , "200 OK status received" );
		}
	}, {
		url: "http://www.jQuery.com" ,
		success: function( data ) {
			ok( /<html/i.test( data ) , "Contains html tag" );
		},
		error: function() {
			ok( false , "error issued" );
		},
		complete: function( data ) {
			strictEqual( 1 * data.status , 200 , "200 OK status received" );
			start();
		}
	} );	
	
} );

test( "success - multiple - multiple calls" , function() {
	
	stop();
	expect( 4 );
	
	yajax( {
		url: "http://www.google.com" ,
		success: function( data ) {
			ok( /<html/i.test( data ) , "Contains html tag" );
		},
		error: function() {
			ok( false , "error issued" );
		},
		complete: function( data ) {
			strictEqual( 1 * data.status , 200 , "200 OK status received" );
		}
	} );
	
	yajax( {
		url: "http://www.jQuery.com" ,
		success: function( data ) {
			ok( /<html/i.test( data ) , "Contains html tag" );
		},
		error: function() {
			ok( false , "error issued" );
		},
		complete: function( data ) {
			strictEqual( 1 * data.status , 200 , "200 OK status received" );
			start();
		}
	} );	
	
} );

test( "error - single" , function() {
	
	stop();
	expect( 2 );
	
	yajax( {
		url: "doesnotexist" ,
		success: function() {
			ok( false , "success" );
		},
		error: function() {
			ok( true , "error issued" );
		},
		complete: function( data ) {
			strictEqual( data.status , undefined , "status is undefined" );
			start();
		}
	} );
	
} );

test( "error - multiple - one call" , function() {
	
	stop();
	expect( 4 );
	
	yajax( {
		url: "doesnotexist" ,
		success: function() {
			ok( false , "success" );
		},
		error: function() {
			ok( true , "error issued" );
		},
		complete: function( data ) {
			strictEqual( data.status , undefined , "status is undefined" );
		}
	} , {
		url: "doesnotexisteither" ,
		success: function() {
			ok( false , "success" );
		},
		error: function() {
			ok( true , "error issued" );
		},
		complete: function( data ) {
			strictEqual( data.status , undefined , "status is undefined" );
			start();
		}
	} );
	
} );

test( "error - multiple - multiple calls" , function() {
	
	stop();
	expect( 4 );
	
	yajax( {
		url: "doesnotexist" ,
		success: function() {
			ok( false , "success" );
		},
		error: function() {
			ok( true , "error issued" );
		},
		complete: function( data ) {
			strictEqual( data.status , undefined , "status is undefined" );
		}
	} );
	
	yajax ( {
		url: "doesnotexisteither" ,
		success: function() {
			ok( false , "success" );
		},
		error: function() {
			ok( true , "error issued" );
		},
		complete: function( data ) {
			strictEqual( data.status , undefined , "status is undefined" );
			start();
		}
	} );
	
} );

test( "mixed - one call" , function() {
	
	stop();
	expect( 4 );
	
	yajax(  {
		url: "http://www.google.com" ,
		success: function( data ) {
			ok( /<html/i.test( data ) , "Contains html tag" );
		},
		error: function() {
			ok( false , "error issued" );
		},
		complete: function( data ) {
			strictEqual( 1 * data.status , 200 , "200 OK status received" );
		}
	} , {
		url: "doesnotexist" ,
		success: function() {
			ok( false , "success" );
		},
		error: function() {
			ok( true , "error issued" );
		},
		complete: function( data ) {
			strictEqual( data.status , undefined , "status is undefined" );
			start();
		}
	} );
	
} );

test( "mixed - multiple calls" , function() {
	
	stop();
	expect( 4 );
	
	yajax(  {
		url: "http://www.google.com" ,
		success: function( data ) {
			ok( /<html/i.test( data ) , "Contains html tag" );
		},
		error: function() {
			ok( false , "error issued" );
		},
		complete: function( data ) {
			strictEqual( 1 * data.status , 200 , "200 OK status received" );
		}
	} );
	
	yajax ( {
		url: "doesnotexist" ,
		success: function() {
			ok( false , "success" );
		},
		error: function() {
			ok( true , "error issued" );
		},
		complete: function( data ) {
			strictEqual( data.status , undefined , "status is undefined" );
			start();
		}
	} );
	
} );

test( "concurrent" , function() {
	
	stop();
	expect( 8 );
	
	var count = 2;
	
	yajax(  {
		url: "http://www.google.com" ,
		success: function( data ) {
			ok( /<html/i.test( data ) , "Contains html tag" );
		},
		error: function() {
			ok( false , "error issued" );
		},
		complete: function( data ) {
			strictEqual( 1 * data.status , 200 , "200 OK status received" );
		}
	} , {
		url: "doesnotexist" ,
		success: function() {
			ok( false , "success" );
		},
		error: function() {
			ok( true , "error issued" );
		},
		complete: function( data ) {
			strictEqual( data.status , undefined , "status is undefined" );
			if ( ! --count ) start();
		}
	} );
	
	setTimeout( function() {
	
		yajax( {
			url: "doesnotexist" ,
			success: function() {
				ok( false , "success" );
			},
			error: function() {
				ok( true , "error issued" );
			},
			complete: function( data ) {
				strictEqual( data.status , undefined , "status is undefined" );
			}
		} , {
			url: "http://www.google.com" ,
			success: function( data ) {
				ok( /<html/i.test( data ) , "Contains html tag" );
			},
			error: function() {
				ok( false , "error issued" );
			},
			complete: function( data ) {
				strictEqual( 1 * data.status , 200 , "200 OK status received" );
				if ( ! --count ) start();
			}
		} );
	} , 10 );
	
} );

test( "extreme" , function() {
	
	stop();
	expect( 10 );
	
	var count = 5;
	
	yajax(  {
		url: "http://www.google.com" ,
		success: function( data ) {
			ok( /<html/i.test( data ) , "Contains html tag" );
		},
		error: function() {
			ok( false , "error issued" );
		},
		complete: function( data ) {
			strictEqual( 1 * data.status , 200 , "200 OK status received" );
			if ( ! --count ) start();
		}
	} );
	
	yajax(  {
		url: "http://www.jQuery.com" ,
		success: function( data ) {
			ok( /<html/i.test( data ) , "Contains html tag" );
		},
		error: function() {
			ok( false , "error issued" );
		},
		complete: function( data ) {
			strictEqual( 1 * data.status , 200 , "200 OK status received" );
			if ( ! --count ) start();
		}
	} );
	
	yajax(  {
		url: "http://www.doomworld.com" ,
		success: function( data ) {
			ok( /<html/i.test( data ) , "Contains html tag" );
		},
		error: function() {
			ok( false , "error issued" );
		},
		complete: function( data ) {
			strictEqual( 1 * data.status , 200 , "200 OK status received" );
			if ( ! --count ) start();
		}
	} );
	
	yajax(  {
		url: "http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.min.js" ,
		success: function( data ) {
			ok( /jQuery/.test( data ) , "Contains jQuery reference" );
		},
		error: function() {
			ok( false , "error issued" );
		},
		complete: function( data ) {
			strictEqual( 1 * data.status , 200 , "200 OK status received" );
			if ( ! --count ) start();
		}
	} );
	
	yajax(  {
		url: "http://ajax.googleapis.com/ajax/libs/jqueryui/1.7.2/jquery-ui.min.js" ,
		success: function( data ) {
			ok( /jQuery/.test( data ) , "Contains jQuery reference" );
		},
		error: function() {
			ok( false , "error issued" );
		},
		complete: function( data ) {
			strictEqual( 1 * data.status , 200 , "200 OK status received" );
			if ( ! --count ) start();
		}
	} );
	
} );