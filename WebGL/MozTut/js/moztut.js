/**
 * @file: MozTut
 * @author: Nick Pershin
 * @copyright: Nick Pershin © 2016
 */

;(function(win, doc) {
    "use strict";

    var DEBUG                   = true, // switch the debug info on/off
        WebGL_Controller        = function(canvasID) {
            if (this instanceof WebGL_Controller) {
                if(!canvasID) {
                    throw new Error("WebGL_Controller's constructor :: the canvasID parameter must be passed!");
                }
                this.canvas = doc.getElementById(canvasID);
                if(!this.canvas) {
                    throw new Error("WebGL_Controller\'s constructor :: couldn't get node with ID: " + canvasID);
                }
                // init WebGL
                this.gl = null;
                try {
                    // try to grab the standard context - if it fails, fallback to experimental
                    this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
                } catch(e) {
                    throw new Error("WebGL_Controller\'s constructor :: ERROR while grabbing the context: " + e);
                }
  
                if (this.gl) {
                    // set clear color to black, fully opaque
                    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
                    // clear everything
                    this.gl.clearDepth(1.0);
                    // enable depth testing
                    this.gl.enable(this.gl.DEPTH_TEST);
                    // near things obscure far things
                    this.gl.depthFunc(this.gl.LEQUAL);
                    // clear the color as well as the depth buffer.
                    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
                    // resize the viewport
                    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
                } else {
                    // if we don't have a GL context, give up
                    this.gl = null;
                    throw new Error("WebGL_Controller's constructor :: Unable to initialize WebGL.");
                }

                DEBUG && win.console && console.log('an instance of WebGL_Controller created OK');

            } else {
                return new WebGL_Controller(canvasID);
            }
        };

    WebGL_Controller.prototype = {

        /**
         * Detects if the parameter is a natural number.
         * @return {Boolean}
         */
        // isNaturalNumber: function(n) {
        //     return typeof n === 'number' && n%1 === 0;
        // },

        /**
         * Warns if the parameter is a 'safe' Integer.
         */
        // isSafeInteger: function(n) {
        //     return Math.abs(n) <= 9007199254740991; // ( 9007199254740991 == Math.pow(2, 53) - 1 )
        // },

        /**
         * Checks the 'value' parameter for following:
         * - finite number ?
         * - natural number ?
         * - safe Integer ?
         *
         * @param name {String}
         * @param value {Number?}
         */
        // checkIntParam: function(name, value) {
        //     if(!isFinite(value) || !this.isNaturalNumber(value)) {
        //         throw new TypeError(name + ' must be finite Integer!');
        //     }
        //     if(!this.isSafeInteger(value)) {
        //         throw new Error(name + ' is not the safe Integer!');
        //     }
        // }


    };


    doc.addEventListener('DOMContentLoaded', function(e) {
        win.WebGL_Controller = new WebGL_Controller("glcanvas");
    },false);

})(window, document);
