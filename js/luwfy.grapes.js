console.log("TEST", window);
if (!window.luwfy) {
  window.luwfy = {};
}

luwfy.editorJS = [];
luwfy.editorCSS = [];
luwfy.canvasJS = [];
luwfy.canvasCSS = [];
luwfy.registeredComponents = {};

luwfy.postURL = "";

luwfy.getOverlay = function () {
  if (!document.getElementById("luwfy-grapes-overlay")) {
    var style = document.createElement("style");
    style.setAttribute("id", "luwfy-grapes-overlay");
    style.innerHTML = `#overlay {
      position: absolute;
      display: block;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0,0,0,0.5);
      z-index: 1000;
    }
    #gjs {
      width: calc(100% - 80px) !important;
      height: calc(100% - 80px) !important;
      margin: 40px;
    }
    #overlay-close {
      float: right;
      position: absolute;
      top: 5px;
      right: 5px;
      font-size: 30px;
      color: orange;
      background: #dedede;
      border: 1px solid #dedede;
      border-radius: 10px;
      cursor: pointer;
    }
    `;
    document.getElementsByTagName("head")[0].appendChild(style);
  }

  var overlay = luwfy.appendElement("div", "overlay");
  var close = luwfy.appendElement("div", "overlay-close", overlay);
  var that = this;

  close.setAttribute("class", "fa fa-window-close");

  close.onclick = function () {
    var ol = document.getElementById("overlay");
    ol.parentNode.removeChild(ol);
    /*
    setTimeout(function () {

      luwfy.startEditor();

    },1000);
*/
  };

  var gjs = luwfy.appendElement("div", "gjs", overlay);
  return overlay;
};

luwfy.registerComponentsFromURL = function (endpoint) {
  if (endpoint) {
    fetch(endpoint)
      .then((response) => {
        luwfy.registerComponentsArray(response);
        // handle the response
        console.log("RESPONSE_GET_ENDPOINT", response);
      })
      .catch((error) => {
        console.log("RESPONSE_ERROR_ENDPOINT", response);
        // handle the error
      });
  }
};

luwfy.registerComponentsArray = function (array) {
  array.forEach((conf) => {
    console.log("FOR_EACH", array, conf);
    luwfy.registerComponent(conf);
  });

  console.log("ARRAY");
};

luwfy.registerComponent = function (conf) {
  if (conf.canvasJS) {
    if (luwfy.canvasJS.indexOf(conf.canvasJS) == -1) {
      luwfy.canvasJS.push(conf.canvasJS);
    }
  }
  if (conf.canvasCSS) {
    if (luwfy.canvasCSS.indexOf(conf.canvasCSS) == -1) {
      luwfy.canvasCSS.push(conf.canvasCSS);
    }
  }
  if (conf.editorJS) {
    if (luwfy.editorJS.indexOf(conf.editorJS) == -1) {
      luwfy.editorJS.push(conf.editorJS);
    }
  }
  if (conf.editorCSS) {
    if (luwfy.editorCSS.indexOf(conf.editorCSS) == -1) {
      luwfy.editorCSS.push(conf.editorCSS);
    }
  }

  luwfy.registeredComponents[conf.name] = conf;
};

luwfy.loadEditor = function (cb) {
  for (x in luwfy.editorCSS) {
    luwfy.appendStyle(luwfy.editorCSS[x]);
  }

  function callback() {
    var script = luwfy.editorJS.shift();
    console.log(script);

    if (script) {
      luwfy.appendScript(script, callback);
    } else {
      luwfy.appendElement("div", "root");
      //luwfy.appendElement('div', 'gjs');
      if (cb) {
        cb();
      } else {
        luwfy.startEditor();
      }
    }
  }

  callback();
};

luwfy.appendElement = function (type, id, target) {
  var tag = document.createElement(type);
  tag.setAttribute("id", id);
  if (target) {
    target.appendChild(tag);
  } else {
    document.getElementsByTagName("body")[0].appendChild(tag);
  }
  return tag;
};

luwfy.appendScript = function (src, cb) {
  var script = document.createElement("script");
  script.setAttribute("type", "text/javascript");
  document.getElementsByTagName("head")[0].appendChild(script);
  if (cb) {
    script.onload = cb;
  }
  script.setAttribute("src", src);
};

luwfy.appendStyle = function (src) {
  var link = document.createElement("link");
  link.href = src;
  link.type = "text/css";
  link.rel = "stylesheet";
  document.getElementsByTagName("head")[0].appendChild(link);
};

luwfy.startEditor = function (opts, cb) {
  return new Promise((resolve) => {
    luwfy.getOverlay();

    if (opts.getURL) {
      fetch(opts.getURL)
        .then((response) => {
          luwfy.editor = grapesjs.init({
            container: "#gjs",
            components: response || "",
            storageManager: {
              type: "remote",
              autosave: false, // Store data automatically
              autoload: false, // Autoload stored data on init
              // urlStore: "http://endpoint/store-template/some-id-123",
              // urlLoad: "http://endpoint/load-template/some-id-123",
            },
            plugins: ["gjs-preset-webpage"],
            pluginsOpts: {
              "gjs-preset-webpage": {
                // options
              },
            },
            canvas: {
              styles: luwfy.canvasCSS,
              scripts: luwfy.canvasJS,
            },
          });

          // handle the response
          console.log("RESPONSE_GET_ENDPOINT", response);
          resolve("resolved");
        })
        .catch((error) => {
          luwfy.editor = grapesjs.init({
            container: "#gjs",
            components: "",
            storageManager: {
              type: "remote",
              autosave: false, // Store data automatically
              autoload: false, // Autoload stored data on init
              // urlStore: "http://endpoint/store-template/some-id-123",
              // urlLoad: "http://endpoint/load-template/some-id-123",
            },
            plugins: ["gjs-preset-webpage"],
            pluginsOpts: {
              "gjs-preset-webpage": {
                // options
              },
            },
            canvas: {
              styles: luwfy.canvasCSS,
              scripts: luwfy.canvasJS,
            },
          });
          console.log("RESPONSE_ERROR_ENDPOINT", response);
          resolve("resolved");
        });
    } else {
      luwfy.editor = grapesjs.init({
        container: "#gjs",
        components: opts.content || "",
        storageManager: {
          type: "remote",
          autosave: false, // Store data automatically
          autoload: false, // Autoload stored data on init
          // urlStore: "http://endpoint/store-template/some-id-123",
          // urlLoad: "http://endpoint/load-template/some-id-123",
        },
        plugins: ["gjs-preset-webpage"],
        pluginsOpts: {
          "gjs-preset-webpage": {
            // options
          },
        },
        canvas: {
          styles: luwfy.canvasCSS,
          scripts: luwfy.canvasJS,
        },
      });

      resolve("resolved");
    }
  });

  for (x in luwfy.registeredComponents) {
    luwfy.addComponentToEditor(luwfy.registeredComponents[x]);
  }

  var newButton = luwfy.editor.Panels.addButton("options", {
    className: "fa fa-save",
    command: function (editor) {
      console.log("SAVE");
      console.log("HTML:: " + editor.getHtml());
      console.log("CSS :: " + editor.getCss());
      let json = {
        html: editor.getHtml(),
        css: editor.getCss(),
      };
      console.log("POST_URL", luwfy.postURL, json);

      if (luwfy.saveCallback) {
        console.log("POST_URL_CALLBACK", luwfy.postURL, json);
        luwfy.saveCallback(editor);
      }
    },
    attributes: { title: "Save", style: "color: orange" },
    active: false,
  });

  // Remove extra category
  const bm = luwfy.editor.BlockManager;
  const blocks = bm.getAll();
  const toRemove = blocks.filter((block) => block.get("category") === "Extra");
  toRemove.forEach((block) => bm.remove(block.get("id")));

  if (cb) {
    setTimeout(function () {
      cb(luwfy.editor);
    }, 100);
  }
};

luwfy.addComponentToEditor = function (cmp) {
  var lbl = cmp.name;
  var tpl =
    "<" +
    cmp.component +
    ' data-gjs-type="' +
    cmp.name +
    '"></' +
    cmp.component +
    ">";

  if (cmp.rewriteTag) {
    tpl =
      '<div replace-type="' +
      cmp.component +
      '" data-gjs-type="' +
      cmp.name +
      '"></div>';
  }
  if (cmp.template) {
    tpl = cmp.component;
  }
  console.log("tpl form grape", tpl);
  const defaultType = luwfy.editor.DomComponents.getType("default");

  luwfy.editor.DomComponents.addType(cmp.name, {
    model: {
      defaults: {
        traits: cmp.traits || [],
        //TODO UNCOMMENT for draggable/dropable items
        //draggable: cmp.draggable, // Can be dropped only inside `form` elements EX:"form, form *"
        // droppable: cmp.droppable, // Can't drop other elements inside ex:"true"
      },
      toHTML: function () {
        var original = defaultType.model.prototype.toHTML.apply(this);

        if (cmp.rewriteTag) {
          var type = original.substr(19, original.substr(19).indexOf('"'));
          var css = cmp.inlineCSS
            ? ' style="' +
              JSON.stringify(this.getStyle()).replace(
                new RegExp('"', "g"),
                "'"
              ) +
              '"'
            : "";
          var fixed = "<" + type + css + original.substr(20 + type.length);
          var modified = fixed.substr(0, fixed.length - 6) + "</" + type + ">";
          return modified;
        } else {
          return original;
        }
      },
      init() {},
      updated(property, value, prevValue) {
        if (cmp.keepClassNames) {
          var that = this;
          setTimeout(function () {
            var tmp = that.views[0].$el.attr("class");
            that.views[0].$el.attr(
              "class",
              that.views[0].originalClass + " " + tmp
            );
          }, 10);
        }

        if (cmp.isReact) {
          reactDOM.render(
            react.createElement(
              _.get(window, cmp.componentInstance),
              that.attributes.attributes
            ),
            that.views[0].$el[0]
          );
        }
      },
    },
    view: {
      onRender() {
        if (cmp.keepClassNames) {
          var that = this;
          setTimeout(function () {
            that.originalClass = that.$el[0].className;
          }, 10);
        }

        if (cmp.isReact) {
          reactDOM.render(
            react.createElement(_.get(window, cmp.componentInstance)),
            this.$el[0]
          );
        }
      },
    },
  });
  if (cmp.displayInPalette == true || cmp.displayInPalette == null) {
    luwfy.editor.BlockManager.add(cmp.component, {
      label: cmp.name,
      content: tpl,
      category: cmp.category || "",
      attributes: { class: cmp.class || "" },
    });
  }
};
