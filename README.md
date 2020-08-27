# luwfy-grapesjs

Luwfy wrapper for grapesjs editor

Allows loading web components and react components into editor with additional features

Sample Usage:

1.

  Load the library with
  <script type="text/javascript" src="js/luwfy.grapes.js"></script>

  Or dynamically from anywhere in the

  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  document.getElementsByTagName('head')[0].appendChild(script);
  script.onload = function () { // Editor is ready };
  script.setAttribute('src', src);

2.

Register your components


* React requires React and ReactDOM to be available in window scope
* Project needs to expose components in reachable scope defined per component in componentInstance
* Add isReact flag to use ReactDOM.render for component

Availble react native components in assets:

Modal, StatusBar, Alert, Picker, Switch, ScrollView, TextInput, Button, Image, StyleSheet, Text, View

Example register react component:

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

Availble smart components in assets:

accordion array breadcrumb button calendar card cardview carousel cdk chart checkbox checkinput chip colorinput colorpanel
colorpicker combobox common daterangeinput datetimepicker dockinglayout dropdownbutton dropdownlist element fileupload form ganttchart gauge grid
gridpanel input kanban layout led listbox listmenu maskedtextbox menu multicomboinput multiinput multilinetextbox multisplitbutton numerictextbox
pager passwordtextbox path pivottable progressbar querybuilder radiobutton rating scheduler scrollbar slider sortable splitter switchbutton
table tabs tank textarea textbox timepicker toast tooltip tree validator window

Example register smart component:

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

* You can use relative or absolute path to load editor or resources from any location

  luwfy.editorJS.push('https://cdn.jsdelivr.net/npm/lodash@4.17.20/lodash.min.js');
  luwfy.editorJS.push('https://cdn.jsdelivr.net/gh/artf/grapesjs/dist/grapes.min.js');
  luwfy.editorJS.push('https://cdn.jsdelivr.net/gh/artf/grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.js');
  luwfy.editorCSS.push('https://cdn.jsdelivr.net/gh/artf/grapesjs/dist/css/grapes.min.css');
  luwfy.editorCSS.push('https://cdn.jsdelivr.net/gh/artf/grapesjs-preset-webpage/dist/grapesjs-preset-webpage.min.css');


4.

Start the editor:

luwfy.loadEditor();


5.

You can access editor in luwfy.editor

6.

For the save icon
You can overwrite luwfy.saveCallback with custom function

7.

Editor contents are always available in

luwfy.editor.getHtml();
luwfy.editor.getCss();

8.

After editor was loaded once it can be displayed again with luwfy.showEditor();
