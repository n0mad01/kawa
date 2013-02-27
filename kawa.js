/*!
 * Kawa - A Clientside Templating Engine
 * Copyright 2013, Adrian Soluch http://soluch.at/
 * Released under the MIT license
 */

( function( window, undefined ) {

    //'use strict';

    var element,        // the selected template snippet
        clone,          // the selected template snippets clone
        //object_string = null,  // 
        exact_matches_only = false,     // only exact mapping will be used e.g. address.street === address.street AND NOT address.street IN user.private.address.street 
        openDelimiter = '{',
        closeDelimiter = '}';

    kawa = {
        make : function( options ) {

            if( options ) {
                if( options.hasOwnProperty( 'selector' ) ) {
                    if( document.getElementById( options.selector ) && options.hasOwnProperty( 'data' ) ) {

                        this.setElement( options.selector );
                        this.parseElement( clone, options.data );

                        return clone;
                    }
                }
            }
        },
        setElement : function( selector ) {

            var text;

            element = document.getElementById( selector );
            clone = element.cloneNode( true );

            element.style.display = 'none';
            clone.style.display = 'block';
            clone.removeAttribute('id');
        },
        parseElement : function( node, data ) {
            node = node.firstChild;
            var find = openDelimiter+'(.*?)'+closeDelimiter,
                regex = new RegExp( find,'gi' ),
                object_identifiers, // array containing all object literal identifiers, e.g.: ['address.private.street','address.private.zip']
                haystack,
                match,
                ma;
                
            while( node ) {
                this.parseElement( node, data );
                if( node.nodeType === 3 ) {

                    haystack = node.data.toString();
                    
                    while( match = regex.exec( haystack ) ){

                        if( match !== null ) {

                            object_identifiers = this.parseObject( data );   // returns an array of all object literal identifiers, e.g.: ['address.private.street','address.private.zip']

                            ma = this.matchObjectToElement( object_identifiers, match[1] ); // all matching strings which will be replaced

                            if( ma !== null ) {
                                node.data = node.data.replace( openDelimiter + match[1] + closeDelimiter, ma.split('.').reduce( this.index, data ) ); // the magic / replacement
                            }
                        }
                    }
                }
                node = node.nextSibling;
            }
        },
        index : function( data, i ) { 
            return data[i] 
        },
        matchObjectToElement : function( o, e ) {

            ret = null;

            for( var key in o ) {
                if( o[key] === e ) {
                    ret = o[key];
                }
                else {
                    if( ! exact_matches_only ) {
                        if( o[key].indexOf( e ) !== -1 ) {
                            ret = o[key];
                        }
                    }
                }
            }
            return ret;
        },
        parseObject : function( data ) {

            var s = new String;
            var last_object_name = new String;
            var o = [];

            var recursive = function( data, root ) {
                for( var key in data ) {
                    if( typeof data[key] === 'object' ) {
                        last_object_name = root + key + '.';
                        recursive( data[key], last_object_name ); // Recursive call
                    }
                    else {
                        s = last_object_name + key;
                        o.push( s );
                    }
                }
                last_object_name = '';  // next node, void root again
            };
            recursive( data, '' );

            return o;
        }
    };
})( this );
