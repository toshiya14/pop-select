/**
 * POP-SELECT * V0.0.1
 * Author: Akaishi Toshiya @ RMEGo Studio
 */

(function ($) {
    'use strict'
    $.fn.popselect = function (ac, opts) {
        // Check if use a mobile device.
        var isMobile = false;
        if (/Android|webOS|iPhone|iPad|BlackBerry|Windows Phone|Opera Mini|IEMobile|Mobile/i.test(navigator.userAgent)) {
            isMobile = true;
        }

        var options = opts;
        var action = ac;
        if (!opts) {
            options = ac;
            action = "init";
        }

        // definations

        /**
         * Build option data from Html.
         * @param {HtmlNode} node the node of select.
         */
        var __buildFromHtml = function (node) {
            var $root = $(node);
            // get groups
            var result = [];
            var gps = $root.children("optgroup");

            if (gps.length === 0) {
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
                    item.optgroup = gname;
                    result.push(item);
                });
                return result;
            }

            // found optgroup
            $.each(gps, function (gi, ge) {
                var groot = $(ge);
                var gname = groot.attr("label");
                var ops = groot.children("option");
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
            return result;
        }

        /**
         * Insert container wrap to the select.
         * @param {HtmlNode} node the node of select.
         * @param {object} opts options.
         */
        var __insertContainer = function (node, opts) {
            var $el = $(node);
            $el.addClass("pop-select-hidden");
            $el.wrap('<div class="pop-select-control"></div>');
            return $($el.parents(".pop-select-control")[0]);
        }

        var __init = function () {
            var $el = $(this);
            if (!$el.hasClass("pop-select-control")) {
                $el = __insertContainer($el);
            }
            var $opts = $.extend({
                "direction": "auto",
                "mobile": "default",
                "canSearch": false,
                "searchFields": "%html",
                "displayField": "Text",
                "groupField": "optgroup",
                "valueField": "value",
                "isMulti": false,
                "maxSelection": 0,
                "maxHeight": "300px",
                "render": {},
                "emptyPlaceHolder": "No items could be selected.",
                "data": {}
            }, $el.data("opts"), options);
            var viewdata = __buildFromHtml($el.children("select"));
        }


        // router
        switch (action) {
            case "init":
                return this.each(__init);
        }
    };
}(jQuery));