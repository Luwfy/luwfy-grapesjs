# luwfy-grapesjs

Luwfy wrapper for grapesjs editor

Allows loading web components and react components into editor with additional features

Sample Usage:

1. <script type="text/javascript" src="js/luwfy.grapes.js"></script>


2. 

Register react component:

luwfy.registerComponent({

    'name': 'React Text',
    'component': 'Text',
    'editorJS': 'assets/react.js',
    'editorCSS': false,
    'canvasJS': 'assets/react.js',
    'canvasCSS': false,
    'rewriteTag': true,
    'inlineCSS': true,
    'keepClassNames': false,
    'traits': [ 'id', 'name', 'placeholder', 'label', 'text', 'value' ],
    'isReact': true,
    'componentInstance': 'reactNative.components.Text',

  });


Register smart component:

luwfy.registerComponent({

    'name': 'Smart Gauge',
    'component': 'smart-gauge',
    'editorJS': false,
    'editorCSS': 'assets/smart.default.css',
    'canvasJS': 'assets/smart/smart.gauge.js',
    'canvasCSS': 'assets/smart.default.css',
    'rewriteTag': false,
    'inlineCSS': false,
    'keepClassNames': true,
    'traits': [ 'id', 'name', 'placeholder', 'label', 'text', 'value' ]

});


3. 

Setup editor path and add lodash dependency:

luwfy.editorJS.push('assets/lodash.min.js');
luwfy.editorJS.push('assets/grapes.min.js');
luwfy.editorCSS.push('assets/grapes.min.css');


4. 

Start the editor:

luwfy.loadEditor();

