;(function(){

	// the minimum version of jQuery we want
	var v = "1.10.2";

	// check for jQuery. if it exists, verify it's not too old.
	if (window.jQuery === undefined || greaterVersion(window.jQuery.fn.jquery, v) === 2) {
		var done = false;
		var script = document.createElement("script");
		script.src = "http://ajax.googleapis.com/ajax/libs/jquery/" + v + "/jquery.min.js";
		script.onload = script.onreadystatechange = function(){
			if (!done && (!this.readyState || this.readyState == "loaded" || this.readyState == "complete")) {
				done = true;
				initJarvis();
			}
		};
		document.getElementsByTagName("head")[0].appendChild(script);
	} else {
		initJarvis();
	}

  function greaterVersion(vStr1, vStr2) {
    var vArr1 = vStr1.split('.'),
        vArr2 = vStr2.split('.'),
        vNum1, vNum2;
    for (var i = 0; i < vArr1.length; i++) {
      vNum1 = parseInt(vArr1[i], 10);
      vNum2 = parseInt(vArr2[i], 10);
      if (vNum1 === vNum2) {
        continue;
      } else if (vNum1 < vNum2) {
        return 2;
      } else {
        return 1;
      }
    }
    return false;
  }
	
	function initJarvis() {
		(window.jarvis = function() {
      var keys = [],
          mapping = {
            71: "https://www.google.com/#q=%s", //g
            87: "http://en.wikipedia.org/w/index.php?&search=%s", //w
            65: "http://www.amazon.com/s/?field-keywords=%s", //a
            69: "http://www.ebay.com/sch/i.html?_nkw=%s", //e
            68: "http://dictionary.com/browse/%s", //d
            84: "http://thesaurus.com/browse/%s", //t
            89: "http://www.youtube.com/results?search_query=%s", //y
            70: "http://www.facebook.com/search.php?q=%s", //f
            77: "https://maps.google.com/?q=%s", //m
          },
          qs = '';
      
      if (typeof $ === 'undefined') {
        $ = jQuery;
      }

			function getSelText() {
				var s = '';
				if (window.getSelection) {
					s = window.getSelection();
				} else if (document.getSelection) {
					s = document.getSelection();
				} else if (document.selection) {
					s = document.selection.createRange().text;
				}
				return s;
			}

      $(document).on('keyup', function(e) {
        delete keys[e.keyCode];
      });

      $(document).on('keydown', function(e) {
        var s = getSelText();
        if (s) {
          keys[e.keyCode] = true;

          if (keys[17] && keys[16]) {
            console.log(keys);
            if (e.keyCode in mapping) {
              qs = mapping[e.keyCode].replace(/\%s/g, encodeURI(s));
              sendQuery(qs);
            }
          }
        }
      });

      function sendQuery(qs) {
        if ($("#wikiframe").length === 0) {
          $("body").append("\
          <div id='wikiframe'>\
            <div id='wikiframe_veil' style=''>\
              <p>Loading...</p>\
            </div>\
            <iframe src=" + qs + " onload=\"$('#wikiframe iframe').slideDown(500);\">Enable iFrames.</iframe>\
            <style type='text/css'>\
              #wikiframe_veil { display: none; position: fixed; width: 100%; height: 100%; top: 0; left: 0; background-color: rgba(255,255,255,.25); cursor: pointer; z-index: 900; }\
              #wikiframe_veil p { color: black; font: normal normal bold 20px/20px Helvetica, sans-serif; position: absolute; top: 50%; left: 50%; width: 10em; margin: -10px auto 0 -5em; text-align: center; }\
              #wikiframe iframe { display: none; position: fixed; top: 10%; left: 10%; width: 80%; height: 80%; z-index: 999; border: 10px solid rgba(0,0,0,.5); margin: -5px 0 0 -5px; }\
            </style>\
          </div>");
          $("#wikiframe_veil").fadeIn(750);
        } else {
          $("#wikiframe_veil").fadeOut(750);
          $("#wikiframe iframe").slideUp(500);
          setTimeout("$('#wikiframe').remove()", 750);
        }

        $("#wikiframe_veil").click(function(event){
          $("#wikiframe_veil").fadeOut(750);
          $("#wikiframe iframe").slideUp(500);
          setTimeout("$('#wikiframe').remove()", 750);
        });
      }
      
		})();
	}

})();
