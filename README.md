# Kawa - A JavaScript Clientside Templating Engine

A simple templating engine, perfect for traversing JSON callback objects.

##### usage:

The examples are in plain JavaScript, but of course you can use jQuery ( or whatever library ).

Include the js file :
```html
<script src="kawa.js"></script>
```

generate a template snippet :
```html
<li id="test-template">
    Name : {name}<br>
    Address : {address}<br>
    <div>
        Zip-Code : {zip}<br>
    </div>
</li>
```

place somewhere the parent node :
```html
<ul id="template-container">
</ul>
```

traverse your data ( which, like said, will likely come from a JSON object ) :
```javascript
var testdata = {
    '0' : {
        'name' : 'Adrian Soluch',
        'address' : 'street 12/12',
        'zip' : '12345'
    },
    '1' : {
        'name' : 'Mr. Black',
        'address' : 'street 14/14',
        'zip' : '67890'
    },
    '2' : {
        'name' : 'Mr. White',
        'address' : 'street 16/16',
        'zip' : '123'
    }
};

var data,
    ul2 = document.getElementById('template-container');
for( var key in testdata ) {
    console.log( testdata[key] );
    data = kawa.make({'selector':'test-template', 'data':testdata[key]});
    ul2.appendChild( data );
}
```

##### Copyright and License
Kawa is licensed under the terms of the MIT License, see the included MIT-LICENSE file.
