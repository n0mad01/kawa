/*!
 * Kawa - Yet another Clientside templating engine
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
            var n, m, s;
            while( node ) {
                this.parseElement( node, data );
                if( node.nodeType === 3 ) {
                    n = node.data.toString();
                    m = n.match( openDelimiter+'(.*?)'+closeDelimiter );

                    if( m !== null ) {
                        s = this.parseObject( data );   // returns an array of all object literal identifiers, e.g.: address.private.zip

                        match = this.matchObjectToElement( s, m[1] );

                        if( match !== null ) {
                            node.data = node.data.replace( openDelimiter + m[1] + closeDelimiter, match.split('.').reduce( this.index, data ) ); // the magic
                        }
                    }

                    for( var key in data ) {
                        if( data.hasOwnProperty( key ) ) {
                            if( node.data.indexOf( openDelimiter + key + closeDelimiter ) !== -1 ) {

                                node.data = node.data.replace( openDelimiter + key + closeDelimiter, data[key] );
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
