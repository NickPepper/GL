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
                
                // own properties
                this.gl                         = null;
                this.shaderProgram              = null;
                this.vertexPositionAttribute    = null;
                this.canvas                     = doc.getElementById(canvasID);
                if(!this.canvas) {
                    throw new Error("WebGL_Controller\'s constructor :: couldn't get node with ID: " + canvasID);
                }

                // init WebGL
                try {
                    // try to grab the standard context - if it fails, fallback to experimental
                    this.gl = this.canvas.getContext("webgl") || this.canvas.getContext("experimental-webgl");
                    if (this.gl) {
                        this.initWebGL(this.gl);
                    } else {
                        // just give up
                        this.gl = null;
                        throw new Error("WebGL_Controller's constructor :: Unable to initialize WebGL.");
                    }
                } catch(e) {
                    throw new Error("WebGL_Controller\'s constructor :: ERROR while grabbing the context: " + e);
                }
  

                // init shaders
                var ish = this.initShaders("shader_vs", "shader_fs");
                if(ish.status == "ERROR") {
                    throw new Error(ish.error);
                }

                DEBUG && win.console && console.log('an instance of WebGL_Controller created OK');

            } else {
                return new WebGL_Controller(canvasID);
            }
        };



    WebGL_Controller.prototype = {

        /**
         * Initialize the WebGL.
         * @param {Object}      gl context
         */
        initWebGL: function(gl) {
            // set clear color to black, fully opaque
            gl.clearColor(0.0, 0.0, 0.0, 1.0);
            // clear everything
            gl.clearDepth(1.0);
            // enable depth testing
            gl.enable(gl.DEPTH_TEST);
            // near things obscure far things
            gl.depthFunc(gl.LEQUAL);
            // clear the color as well as the depth buffer.
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            // resize the viewport
            gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        },


        /**
         * Load shaders from the DOM.
         * @param {Object}      link to gl context
         * @param {String}      id of shader node
         * @return {Object}     status object
         */
        getShader: function(gl, id) {
            var shaderScript    = doc.getElementById(id), 
                theSource       = "",
                currentChild    = null,
                shader          = null;
            
            if (!shaderScript) {
                return {status: "ERROR", error: "getShader() :: Unable to find in DOM the shader script with ID " + id, 'shader': shader};
            }

            currentChild = shaderScript.firstChild;
          
            while(currentChild) {
                if (currentChild.nodeType == currentChild.TEXT_NODE) {
                    theSource += currentChild.textContent;
                }
                currentChild = currentChild.nextSibling;
            }
            
            if (shaderScript.type == "x-shader/x-fragment") {
                shader = gl.createShader(gl.FRAGMENT_SHADER);
            } else if (shaderScript.type == "x-shader/x-vertex") {
                shader = gl.createShader(gl.VERTEX_SHADER);
            } else {
                return {status: "ERROR", error: "getShader() :: Unknown shader type", 'shader': shader};
            }

            gl.shaderSource(shader, theSource);
            
            // compile the shader program
            gl.compileShader(shader);  
            
            // compiled successfully ?
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {  
                return {status: "ERROR", error: "getShader() :: An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader), 'shader': shader};
            }
            
            return {status: "OK", error: null, 'shader': shader};
        },



        /**
         * Initialize the shaders.
         * @param {String}      id of vertex shader node
         * @param {String}      id of fragment shader node
         * @return {Object}     status object
         */
        initShaders: function(vShaderId, fShaderId) {
            var vertexShader    = this.getShader(this.gl, vShaderId),
                fragmentShader  = this.getShader(this.gl, fShaderId);

            if(vertexShader.status == "ERROR") {
                return {status: vertexShader.status, error: vertexShader.error};
            }
            if(fragmentShader.status == "ERROR") {
                return {status: fragmentShader.status, error: fragmentShader.error};
            }
          
            // create the shader program
            this.shaderProgram = this.gl.createProgram();
            this.gl.attachShader(this.shaderProgram, vertexShader.shader);
            this.gl.attachShader(this.shaderProgram, fragmentShader.shader);
            this.gl.linkProgram(this.shaderProgram);
            // if failed, return the error
            if (!this.gl.getProgramParameter(this.shaderProgram, this.gl.LINK_STATUS)) {
                return {status: "ERROR", error: "Unable to initialize the shader program: " + this.gl.getProgramInfoLog(shader)};
            }
          
            this.gl.useProgram(this.shaderProgram);
          
            this.vertexPositionAttribute = this.gl.getAttribLocation(this.shaderProgram, "aVertexPosition");
            this.gl.enableVertexAttribArray(this.vertexPositionAttribute);

            return {status: "OK", error: null};
        },



        /**
         * Detect if the parameter is a natural number.
         * @return {Boolean}
         */
        // isNaturalNumber: function(n) {
        //     return typeof n === 'number' && n%1 === 0;
        // },

        /**
         * Warn if the parameter is a 'safe' Integer.
         */
        // isSafeInteger: function(n) {
        //     return Math.abs(n) <= 9007199254740991; // ( 9007199254740991 == Math.pow(2, 53) - 1 )
        // },

        /**
         * Check the 'value' parameter for following:
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
