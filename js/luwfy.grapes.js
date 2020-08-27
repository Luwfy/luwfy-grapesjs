if(!window.luwfy) { window.luwfy = {}; }

luwfy.editorJS = [];
luwfy.editorCSS  = [];
luwfy.canvasJS = [];
luwfy.canvasCSS  = [];
luwfy.registeredComponents = {};

luwfy.registerComponent = function(conf) {

  if(conf.canvasJS) {
    if(luwfy.canvasJS.indexOf(conf.canvasJS) == -1) {
      luwfy.canvasJS.push(conf.canvasJS);
    }
  }
  if(conf.canvasCSS) {
    if(luwfy.canvasCSS.indexOf(conf.canvasCSS) == -1) {
      luwfy.canvasCSS.push(conf.canvasCSS);
    }
  }
  if(conf.editorJS) {
    if(luwfy.editorJS.indexOf(conf.editorJS) == -1) {
      luwfy.editorJS.push(conf.editorJS);
    }
  }
  if(conf.editorCSS) {
    if(luwfy.editorCSS.indexOf(conf.editorCSS) == -1) {
      luwfy.editorCSS.push(conf.editorCSS);
    }
  }

  luwfy.registeredComponents[conf.name] = conf;

}

luwfy.loadEditor = function() {

  for(x in luwfy.editorCSS) {
    luwfy.appendStyle(luwfy.editorCSS[x]);
  }

  function callback() {

    var script = luwfy.editorJS.shift();
    console.log(script);

    if(script) {

      luwfy.appendScript(script, callback);

    } else {

      luwfy.appendElement('div', 'root');
      luwfy.appendElement('div', 'gjs');
      luwfy.startEditor();

    }
  }

  callback();

};

luwfy.appendElement = function(type, id) {
  var tag = document.createElement(type);
  tag.setAttribute('id', id);
  document.getElementsByTagName('body')[0].appendChild(tag);
}

luwfy.appendScript = function(src,cb) {

  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  document.getElementsByTagName('head')[0].appendChild(script);
  if(cb) {
    script.onload = cb;
  }
  script.setAttribute('src', src);

};

luwfy.appendStyle = function(src) {

  var link = document.createElement("link");
  link.href = src;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);

};

luwfy.startEditor = function() {

    luwfy.editor = grapesjs.init({
      container : '#gjs',
      storageManager: {
        autosave: false,         // Store data automatically
        autoload: false,         // Autoload stored data on init
      },
      canvas: {
        styles: luwfy.canvasCSS,
        scripts: luwfy.canvasJS
      }
    });

    for(x in luwfy.registeredComponents) {
        luwfy.addComponentToEditor(luwfy.registeredComponents[x]);
    }


    var newButton = luwfy.editor.Panels.addButton('options',{
      className: 'fa fa-save',
      command: function(editor) {

        console.log('SAVE');
        console.log("HTML:: " + editor.getHtml());
        console.log("CSS :: " + editor.getCss());

        if(luwfy.saveCallback) {
          luwfy.saveCallback(editor);
        }

      },
      attributes: { title: 'Save', style: "color: orange"  },
      active: false,
    });

}

luwfy.addComponentToEditor = function(cmp) {

  var lbl = cmp.name;
  var tpl = '<' + cmp.component + ' data-gjs-type="' + cmp.name + '"></' + cmp.component + '>';

  if(cmp.rewriteTag) {
    tpl = '<div replace-type="' + cmp.component + '" data-gjs-type="' + cmp.name + '"></div>';
  }

  const defaultType = luwfy.editor.DomComponents.getType('default');

  luwfy.editor.DomComponents.addType(cmp.name, {
    model: {
      defaults: {
        traits: cmp.traits || [],
      },
      toHTML: function() {

        var original = defaultType.model.prototype.toHTML.apply(this);

        if(cmp.rewriteTag) {

          var type     = original.substr(19, original.substr(19).indexOf('"'));
          var css      = cmp.inlineCSS ? ' style="' + JSON.stringify(this.getStyle()).replace(new RegExp('"', 'g'), "'") + '"' : '';
          var fixed    = '<' + type + css + original.substr(20 + type.length);
          var modified = fixed.substr(0, fixed.length - 6) + '</' + type + '>';
          return modified;

        } else {

          return original;

        }

      },
      init() {
      },
      updated(property, value, prevValue) {

        if(cmp.keepClassNames) {
          var that = this;
          setTimeout(function () {
              var tmp = that.views[0].$el.attr('class');
              that.views[0].$el.attr('class', that.views[0].originalClass + ' ' + tmp);
          }, 10);
        }

        if(cmp.isReact) {
          reactDOM.render(react.createElement(_.get(window,cmp.componentInstance), that.attributes.attributes), that.views[0].$el[0]);
        }

      },
    },
    view: {

      onRender() {

        if(cmp.keepClassNames) {
          var that = this;
          setTimeout(function () { that.originalClass = that.$el[0].className; }, 10);
        }

        if(cmp.isReact) {
          reactDOM.render(react.createElement(_.get(window,cmp.componentInstance)), this.$el[0]);
        }

      },
    },
  });

  luwfy.editor.BlockManager.add(cmp.component, { label: cmp.name, content: tpl });

}
