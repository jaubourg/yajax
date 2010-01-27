/**
 * YajaX v.0.1(a) [01/27/10 21:20:52.366 - CET]
 * Copyright 2010, Julian Aubourg
 * Dual licensed under the MIT and GPL Version 2 licenses
 */
( function( document ) {
	
	var	// Head node
		head = document.getElementsByTagName( "head" )[ 0 ] || document.documentElement,
	
		// References
		toString = {}.toString,
		
		// Callbacks
		callbacks = {},
		
		// query to come
		query = [],
		
		// Queries running
		queries = {},
		
		// String quoter
		quoter = /"/g, /*"*/
		
		// toString reference
		toString = {}.toString;
		
	// Serializer
	function serialize( value ) {
		
		var i, length, array, type = toString.call( value );
		
		if ( type === "[object String]" ) {
			
			value = '"' + value.replace( quoter , '\\"' ) + '"';
		
		} else if ( type === "[object Array]" ) {
		
			array = [];
			
			for ( i = 0, length = value.length ; i < length ; i++ ) {
				array.push( serialize( value[ i ] ) );
			}
			
			value = "[" + array.join( "," ) + "]";
			
		} else if ( type === "[object Object]" ) {
			
			array = [];
			
			for ( i in value ) {
				array.push( serialize( i ) + ":" + serialize( value[ i ] ) );
			}
			
			value = "{" + array.join(",") + "}";
		
		} else {
			
			value = "" + value;
		
		}
		
		return value;
	};
	
	// doSend
	function doSend( query ) {
		
		var url = [],
			script = document.createElement("script"),
			i, length, tmp, tmp2;
		
		for ( i = 0 , length = query.length ; i < length ; i++ ) {
			tmp = query[ i ];
			tmp2 = { url: tmp.url };
			if ( tmp.headers ) {
				tmp2.headers = tmp.headers;
			}
			if ( tmp.type && ! /^GET$/i.test( tmp.type ) ) {
				tmp2.type = tmp.type.toUpperCase();
			}
			url.push( serialize( tmp2 ).replace( /'/g /*'*/, "\\'" ) );
		}
		
		// We build the jsonp request
		url = "use'http://github.com/jaubourg/yajax/raw/master/db/yajax.xml'as t;select*from t where options in('"
			+ url.join("','")
			+ "')";

		// Store the query
		queries[ url ] = {
			script: script,
			options: query
		};
		
		// Reset
		query = [];

		// Initialize actual query
		script.type = "text/javascript";
		script.async = true;
		script.defer = true;
		script.src = "http://query.yahooapis.com/v1/public/yql?diagnostics=false&format=json&callback=yajax&q="
			+ escape( url );

		// Initiate the request
		head.appendChild( script );
	}
		
	// Send a query
	function send() {
		
		var length = query.length;
		
		query.push.apply( query , arguments );
		
		// If we just received our first queries
		if ( ! length && query.length ) {
			
			// We timeout to group as much request as possible together
			setTimeout( function() {
				
				while ( length = query.length ) {
					
					doSend( query.splice( 0 , length < 3 ? length : 3 ) );
					
				}
				
			} , 0 );
			
		}

	}
	
	// Receive an answer to a query
	function receive( response ) {
		
		var key,
			query,
			options,
			object;
		
		if  // Filter out response.error types
			// (we just don't handle them, they shouldn't happen)
			( ( response = response.query )
			// Get the corresponding query
			// (in case we have concurrent ones)
			&& ( key = unescape ( /\?q=(.+)($|&)/.exec( response.uri )[ 1 ].replace( /\+/g , " " ) ) )
			&& ( query = queries[ key ] )
			// Get the result array
			&& ( response = response.results )
			&& ( response = response.result ) ) {
		
			// First thing first, we remove the script tag
			// head.removeChild( query.script );
			
			// YQL is smart enough not to be consistent
			// If there was only one element in the in(), we don't get an array
			if ( toString.call( response ) !== "[object Array]" ) {
				response = [ response ];
			}
			
			// Results are in order
			for ( var i = 0, length = response.length ; i < length ; i++ ) {
				
				object = response[ i ];
				options = query.options[ i ];
				
				if ( object && options ) {

					// We don't want exceptions from callbacks causing troubles
					try {
					
						if ( object.exception ) {
							options.error( object.exception , object );
						} else {
							options.success( object.response , object );
						}
					} catch( e ) {}
					
					// And we don't want problem in success/error
					// to prevent fireing complete (hence 2 try/catch blocks)
					try {
						options.complete( object );
					} catch( e ) {}
					
				}
			}
			
			// query has been treated, we can forget about it
			delete queries[ key ];
			
		}
	}
	
	// Main function
	function yajax( object ) {
		
		if ( object ) {
		
			if ( ! object.query && ! object.exception ) {
			
				send.apply( window , arguments );
				
			} else {
				
				receive( object );
				
			}
			
		}
		
		return yajax;
	}
		
		
	// EXPOSE
	
	window.yajax = yajax;
	
} )( document );