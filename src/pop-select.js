/**
 * POP-SELECT * V0.0.1
 * Author: Akaishi Toshiya @ RMEGo Studio
 */

(function ($) {
  "use strict";
  $.fn.popselect = function (ac, opts) {
    // Check if use a mobile device.

    var CLASS_PREFIX = 'pop-select';
    var isMobile = false;
    if (
      /Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(
        navigator.userAgent
      )
    ) {
      isMobile = true;
    }

    var options = opts;
    var action = ac;
    if (typeof opts === 'undefined' && typeof ac !== 'string') {
      options = ac;
      action = "init";
    }

    var $opts = $.extend({
        direction: "auto",
        mobile: "default",
        canSearch: false,
        searchFields: "%html",
        displayField: "Text",
        groupField: "optgroup",
        valueField: "value",
        isMulti: false,
        maxSelection: 0,
        maxHeight: "300px",
        render: {},
        emptyPlaceHolder: "No items could be selected.",
        data: {}
      },
      $(this).data("opts"),
      options
    );

    // definations

    /**
     * Build option data from Html.
     * @param {HtmlNode} node the node of select.
     */
    var __buildFromHtml = function (node) {
      var $root = $(node);
      // get groups
      var result = [];
      var meta = {};
      var gps = $root.children("optgroup");

      if (gps.length === 0) {
        meta.hasGroup = false;
        var ops = $root.children("option");
        $.each(ops, function (i, e) {
          var item = {};
          $.each(e.attributes, function (ai, attr) {
            var name = attr.name;
            var value = attr.value;
            if (!name) return;
            if (name.startsWith("data-")) {
              item[name] = value;
            }
          });
          item.text = e.innerText;
          item.value = $(e).attr("value");
          item.disabled = Boolean($(e).attr("disabled"));
          result.push(item);
        });
        meta.options = result;
        return meta;
      }

      // found optgroup
      meta.hasGroup = true;
      meta.groups = [];
      $.each(gps, function (gi, ge) {
        var groot = $(ge);
        var gname = groot.attr("label");
        var ops = groot.children("option");
        if (meta.groups.indexOf(gname) === -1) {
          meta.groups.push(gname);
        }
        if (ops.length === 0) return;
        $.each(ops, function (i, e) {
          var item = {};
          $.each(e.attributes, function (ai, attr) {
            var name = attr.name;
            var value = attr.value;
            if (!name) return;
            if (name.startsWith("data-")) {
              item[name] = value;
            }
          });
          item.text = e.innerText;
          item.value = $(e).attr("value");
          item.disabled = Boolean($(e).attr("disabled"));
          item.optgroup = gname;
          result.push(item);
        });
      });
      meta.options = result;
      return meta;
    };

    /**
     * use the node inside the control or itself to find the root node of the control.
     * @param {HtmlNode} node - the node inside the control or itself.
     */
    var __findControl = function (node) {
      var $el = $(node);
      if ($el.hasClass(CLASS_PREFIX + "-control")) {
        return $el;
      } else {
        var $parents = $el.parents("." + CLASS_PREFIX + "-control");
        return $($parents[0]);
      }
    }

    var __growInput = function (node) {
      var $el = $(node);
      if ($el.is("input")) {
        if ($.fn.inputAutogrow) {
          $el.inputAutogrow();
        }
      }
    }

    /**
     * Insert container wrap to the select.
     * @param {HtmlNode} node - the node of select.
     */
    var __insertContainer = function (node) {
      var $el = $(node);
      if ($el.hasClass("pop-select-control")) {
        return;
      }
      $el.addClass("pop-select-hidden");
      $el.wrap('<div class="pop-select-control"></div>');
      return $($el.parents(".pop-select-control")[0]);
    };

    /**
     * Insert the select control substitute into container.
     * @param {HtmlNode} node - the node of container.
     */
    var __insertWrap = function (node) {
      var $el = __findControl(node);
      var $wrap = $el.children(CLASS_PREFIX + "-wrap");
      if ($wrap.length === 0) {
        $wrap = $('<div class="' + CLASS_PREFIX + '-wrap"></div>');
        $el.append($wrap);
      } else {
        $wrap.empty();
      }
      return $wrap;
    };

    /**
     * Insert the tag list and input into select box.
     * @param {HtmlNode} node - the node of select box wrap.
     */
    var __insertMultiWrap = function (node) {
      var $el = $(node);
      if (!$el.hasClass(CLASS_PREFIX + "-wrap")) {
        return;
      }
      $el.empty();
      var $taglist = $('<div class="' + CLASS_PREFIX + '-tag-list"></div>');
      var $search = $('<input class="pop-select-search" type="text" />');
      $search.on("keyup", function () {
        __filterOptions();
      });
      $taglist.append($search);
      $el.append($taglist);
    }

    /**
     * Insert the input into select box.
     * @param {HtmlNode} node - the node of select box wrap.
     */
    var __insertSingleWrap = function (node) {
      var $el = $(node);
      if (!$el.hasClass(CLASS_PREFIX + "-wrap")) {
        return;
      }
      $el.empty();
      var $search = $('<input class="' + CLASS_PREFIX + '-label ' + CLASS_PREFIX + '-search" type="text"/>');
      $search.on("keyup", function () {
        __filterOptions();
      });
      $el.append($search);
    }

    /**
     * Insert the option list container into container.
     * @param {HtmlNode} node - the node of container.
     */
    var __insertOptionList = function (node) {
      var $el = __findControl(node);
      var $wrap = $el.children(CLASS_PREFIX + "-option-list");
      if ($wrap.length === 0) {
        $wrap = $('<div class="' + CLASS_PREFIX + '-option-list"></div>');
        $el.append($wrap);
      } else {
        $wrap.empty();
      }
      return $wrap;
    }

    /**
     * Insert the group wrap into option list.
     * @param {HtmlNode} node - the node of the option list.
     * @param {string} label - the group name.
     */
    var __insertGroupWrap = function (node, label) {
      var $el = $(node);
      var wrapName = CLASS_PREFIX + "-option-group-container";
      var labelName = CLASS_PREFIX + "-option-group-title";
      if (!$el.hasClass(CLASS_PREFIX + "-option-list")) {
        return;
      }
      var $wrap = $el.children(wrapName);

      // find wrap render function or set default.
      let wrapHtml;
      if ($opts) {
        if ($opts.render) {
          if (typeof $opts.render.group_container === 'function') {
            wrapHtml = $opts.render.group_container;
          }
        }
      }
      if (!wrapHtml) {
        wrapHtml = function (label) {
          return '<div class="' + wrapName + '"></div>';
        }
      }

      // find title render function or set default.
      let titleHtml;
      if ($opts) {
        if ($opts.render) {
          if (typeof $opts.render.group_header === 'function') {
            titleHtml = $opts.render.group_header;
          }
        }
      }
      if (!titleHtml) {
        titleHtml = function (label) {
          return '<h4 class="' + labelName + '">' + label + '</h4>';
        }
      }

      var $wrap = $(wrapHtml(label));
      var $title = $(titleHtml(label));
      $wrap.append($title);
      $el.append($wrap);
      return $wrap;
    }

    /**
     * Insert the option into group wrap or option list.
     * @param {HtmlNode} node - the node of the option list or the group wrap.
     * @param {object} item - the generated view data of option.
     */
    var __insertOption = function (node, item) {
      var $el = $(node);
      if (!$el.hasClass(CLASS_PREFIX + "-option-list") && !$el.hasClass(CLASS_PREFIX + "-option-group-container")) {
        return;
      }

      // find option render function or set default.
      let optionHtml;
      if ($opts) {
        if ($opts.render) {
          if (typeof $opts.render.option === 'function') {
            optionHtml = $opts.render.option;
          }
        }
      }
      if (!optionHtml) {
        optionHtml = function (item) {
          return '<div class="' + CLASS_PREFIX + '-option pop-select-ori-option' + (item.disabled ? ' disabled' : '') + '" data-value="' + item.value + '">' + item.text + '</div>';
        }
      }

      $el.append($(optionHtml(item)));
      return $el;
    }

    /**
     * Display the option list.
     * @param {jQuery.Event} e - the event.
     */
    var __showOptionList = function (e) {
      var node = this;
      var $el = __findControl(node);
      if ($el.hasClass("active")) {
        return;
      } else {
        $el.addClass("active");
        $el.data("isOpen", true);
      }
    };

    /**
     * Dismiss the option list.
     * @param {jQuery.Event} e - the event.
     */
    var __dismissOptionList = function (e) {
      var node = this;
      var $el = __findControl(node);
      if (!$el.hasClass("active")) {
        return;
      } else {
        $el.removeClass("active");
        $el.data("isOpen", false);
      }
    };

    /**
     * Dismiss all option lists except current.
     * @param {jQuery.Event} e - the event.
     */
    var __dismissAllExceptThis = function (e) {
      var $el = __findControl($(e.target));
      $(".active." + CLASS_PREFIX + "-control").each(function () {
        if ($el.is($(this))) {
          return;
        } else {
          $(this).removeClass("active");
          $(this).data("isOpen", false);
        }
      });
    }

    var __toggleOptionList = function (e) {
      var isOpen = $(this).data("isOpen");
      console.log("toggle", isOpen)
      if (isOpen) {
        __dismissOptionList.call(this, e);
      } else {
        __showOptionList.call(this, e);
      }
    }

    /**
     * Init the html and plugin.
     */
    var __init = function () {
      var $el = $(this);
      if (!$el.hasClass("pop-select-control")) {
        $el = __insertContainer($el);
      }
      var viewdata = __buildFromHtml($el.children("select"));
      $el.data("viewdata", viewdata);
      var $wrap = __insertWrap($el);
      var $optionWrap = __insertOptionList($el);

      $el.on("click", function (e) {
        console.log(e.target);
        if ($(e.target).hasClass(CLASS_PREFIX + "-wrap")) {
          __toggleOptionList.call(this, e);
        } else {
          __showOptionList.call(this, e);
        }
      });
      $(document).on("click", __dismissAllExceptThis);

      // Generate Select Box.
      var isMulti = $opts.isMulti;
      if (isMulti) {
        __insertMultiWrap($wrap);
      } else {
        __insertSingleWrap($wrap);
      }

      // Generate Option List.
      if (viewdata.hasGroup) {
        $.each(viewdata.groups, function (gi, ge) {
          var $groupWrap = __insertGroupWrap($optionWrap, ge);
          var options = viewdata.options.filter(function (x) {
            return x.optgroup === ge;
          });
          $.each(options, function (oi, opt) {
            __insertOption($groupWrap, opt);
          });
        });
      } else {
        $.each(viewdata.options, function (oi, opt) {
          __insertOption($optionWrap, opt);
        });
      }
      return $el;
    };

    // router
    switch (action) {
      case "init":
        return this.each(__init);

      case "show":
      case "open":
        return this.each(__showOptionList);

      case "dismiss":
      case "close":
      case "hide":
        return this.each(__dismissOptionList);
    }
  };
})(jQuery);