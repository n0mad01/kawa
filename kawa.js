/*!
 * Kawa - Yet another Clientside templating engine
 * Copyright 2013, Adrian Soluch http://soluch.at/
 * Released under the MIT license
 */

( function( window, undefined ) {

    var element,    // the selected template snippet
        clone,      // the selected template snippets clone
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
            while( node ) {
                this.parseElement( node, data );
                if( node.nodeType === 3 ) {
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
        }
    };
})( this );
