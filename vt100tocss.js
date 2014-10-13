(function(){
    var cloneObj = function(obj)
    {
        return JSON.parse(JSON.stringify(obj));
    };
    var cssObjToStr = function (obj)
    {
        var str = "";
        for (var key in obj)
        {
            str += key + ":" + obj[key] + ";";
        }
        return str;
    }

	var VTClient = function (){
        this.state = cloneObj(this.defaultState);
	};
    VTClient.prototype.adjustment = -64;
    VTClient.prototype.defaultState = {color:null, background: null, adjustment: false};
    VTClient.prototype.rules_m =
    {
        "" : {color: null,            background:null,                adjustment:  true  },
        0  : {color: null,            background:null,                adjustment:  true  },
        1  : {                                                        adjustment:  false },

        30 : {color: [ 64,  64,  64]                                                     }, // grey
        31 : {color: [255,   0,   0]                                                     }, // red
        32 : {color: [  0, 255,   0]                                                     }, // green
        33 : {color: [255, 255,   0]                                                     }, // yellow
        34 : {color: [  0,   0, 255]                                                     }, // blue
        35 : {color: [255,   0, 255]                                                     }, // pink
        36 : {color: [  0, 255, 255]                                                     }, // cyan
        37 : {color: [255, 255, 255]                                                     }, // white

        40 : {                        background: [  0,  64,  64]                        }, // grey
        41 : {                        background: [255,   0,   0]                        }, // red
        42 : {                        background: [  0, 255,   0]                        }, // green
        43 : {                        background: [255, 255,   0]                        }, // yellow
        44 : {                        background: [  0,   0, 255]                        }, // blue
        45 : {                        background: [255,   0, 255]                        }, // pink
        46 : {                        background: [  0, 255, 255]                        }, // cyan
        47 : {                        background: [255, 255, 255]                        }  // white
    };

    VTClient.prototype.mergeRule = function (rule){
        var state_before = JSON.stringify(this.state);
        for (var key in rule){
            this.state[key] = rule[key];
        }
        var state_after = JSON.stringify(this.state);
        return state_before != state_after;
    };

    VTClient.prototype.toCSSRule = function (){
        var cssRules = {};
        if (this.state.color instanceof Array){
            var r = this.state.color[0] ? this.state.color[0] + this.state.adjustment * this.adjustment : 0;
            var g = this.state.color[1] ? this.state.color[1] + this.state.adjustment * this.adjustment : 0;
            var b = this.state.color[2] ? this.state.color[2] + this.state.adjustment * this.adjustment : 0;
            cssRules.color = "rgb(" + [r,g,b].join() + ")";
        }
        if (this.state.background instanceof Array){
            var r = this.state.background[0] ? this.state.background[0] + this.adjustment : 0;
            var g = this.state.background[1] ? this.state.background[1] + this.adjustment : 0;
            var b = this.state.background[2] ? this.state.background[2] + this.adjustment : 0;
            cssRules.background = "rgb(" + [r,g,b].join() + ")";
        }
        return cssObjToStr(cssRules);
    };

    VTClient.prototype.parse = function (str){
        var strArray = str.split('\033[');
        var out = [];
        if (strArray[0].length){
            out.push({text: strArray[0], css: this.toCSSRule()});
        }
        for (var i = 1; i < strArray.length; i++){
            var s = strArray[i];
            var match = s.match(/^([\d;]*)([a-zA-Z])([\s\S]*)/);
            if (match){
                var cmd = match[2];
                var param = match[1].split(';');
                var text = match[3];
                if (this["parse_" + cmd])
                {
                    this["parse_" + cmd](param);
                }
                else{
                    // Unsupported cmd;
                }
                if (text.length){
                    out.push({text: text, css: this.toCSSRule()});
                }
            }
            else{
                out.push({text: '\033[' + s, css: this.toCSSRule()});
            }
        }
        return out;
    };

    VTClient.prototype.parse_m = function (param){
        if (param.length === 0){
            this.mergeRule(this.rules_m[""]);
        }
        else{
            for (var i = 0; i < param.length; i++){
                var rule = this.rules_m[param[i]];
                if (rule){
                    this.mergeRule(rule);
                }
            }
        }
    };

	if (typeof window == "object") window.VTClient = VTClient;
	if (typeof module == "object" && module.exports) module.exports.VTClient = VTClient;
})();