/*
 * $Id$
 *
 * Copyright (c) 2006-2011, Juniper Networks, Inc.
 * All rights reserved.
 * This SOFTWARE is licensed under the LICENSE provided in the
 * ../Copyright file. By downloading, installing, copying, or otherwise
 * using the SOFTWARE, you agree to be bound by the terms of that
 * LICENSE.
 */

jQuery(function ($) {
    var $body = $("body");
    var $newp = $("<div id='top'><div id='top-left'/>"
        + "<div id='top-right'/></div");
    var $left = $("div#top-left", $newp);
    var $right = $("div#top-right", $newp);

    $right.append($("<div id='nav-bar'><button id='nav-prev'/>"
                    + "<button id='nav-next'/></div>"));

    $("div.content", $body).each(function (i, elt) {
        $(elt).appendTo($right);
    });

    $body.append($newp);
    $left.append($("div#toc"));
    $("#rfc.toc").remove();
    $("h1", $left).remove();

    /* $body.append($("<div id='debug-log'/>")); */
    $left.append($("<div class='padding'/>"));

    var active;
    var tocactive;

    setActive($($right.children("div.content").get(0)));

    function setActive ($elt, toggle) {
        if ($elt && $elt.length > 0 && $elt.hasClass("content")) {
            /* Mark a new element "active" */
            if (active)
                active.removeClass("active");
            active = $elt;
            active.addClass("active");

            /* Now we want to find the matching TOC entry and mark it */
            if (tocactive)
                tocactive.removeClass("toc-active");

            var id = $elt.get(0).children[0].id
            $.dbgpr("sa:", id);
            if (id) {
                id = "#toc_" + id;
                tocactive = $("a", $(id).parent());
                $.dbgpr("ta:", tocactive.length, id);
                if (tocactive.length) {
                    tocactive = $(tocactive[0]);
                    tocactive.addClass("toc-active");

                    var $tt = tocactive.parents("li.tocline0");
                    $.dbgpr("tt:", $tt.length);
                    if (toggle)
                        $("ul.top-toc", $tt).toggleClass("top-toc-open");
                    else
                        $("ul.top-toc", $tt).addClass("top-toc-open");
                }
            }

            var szr = $("div#top-right div.active").innerHeight();
            var sz = $("p#title").innerHeight();
            sz = window.innerHeight - sz;
            sz -= 66;
            if (sz < 200)
                sz = 300;
            if (sz < szr)
                sz = szr;
            $("div#toc > ul.toc").innerHeight(sz);

        }
    }

    function findParent ($elt, className) {
        while ($elt) {
            if ($elt.hasClass(className))
                return $elt;
            $elt = $elt.parent();
        }
        return null;
    }

    $("a", $left).click(function (event) {
        event.preventDefault();
        var $this = $(this);
        var id = this.href.split("#");
        id = id[id.length - 1];

        var toggle = $(this).parent().hasClass("tocline0");

        var $target = $(document.getElementById(id));
        $.dbgpr("id: ", id, " + ", $target, " + ", $target.length);

        var $parent = findParent($target, "content");
        $.dbgpr("pr: ", $parent);
        setActive($parent, toggle);
        $.dbgpr("done");

        $("html").animate({ scrollTop: 0 }, 500);
    });

    $("a", $right).click(function (event) {
        event.preventDefault();
        var id = this.href.split("#");
        id = id[id.length - 1];

        var $target = $(document.getElementById(id));
        setActive($target.parents("div.content"));

        $("html").animate({ scrollTop: 0 }, 500);
    });

    $("a", $right).each(function (idx, elt) {
        /* Put the @title as the link value */
        var $elt = $(elt);
        var t = $elt.attr("title");
        var href = $elt.attr("href");
        if (t !== undefined && href !== undefined)
            $elt.text(t);
    });

    $("button#nav-prev").button({
        label: "<< Previous",
    }).click(function (event) {
        setActive(active.prev());
    });

    $("button#nav-next").button({
        label: "Next >>",
    }).click(function (event) {
        setActive(active.next());
    });


    function getMedia () {
        var mediaInspector = document.getElementById('media-inspector');
        var zIndex;

        if (mediaInspector === null)
            return -1;

        if (mediaInspector.currentStyle) {
            zIndex = mediaInspector.currentStyle['zIndex'];
        } else if (window.getComputedStyle) {
            zIndex = window.getComputedStyle(mediaInspector, '')
            		.getPropertyValue("z-index");
        }
        return zIndex;
    }
});
