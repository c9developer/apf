/*
 * See the NOTICE file distributed with this work for additional
 * information regarding copyright ownership.
 *
 * This is free software; you can redistribute it and/or modify it
 * under the terms of the GNU Lesser General Public License as
 * published by the Free Software Foundation; either version 2.1 of
 * the License, or (at your option) any later version.
 *
 * This software is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
 * Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public
 * License along with this software; if not, write to the Free
 * Software Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA
 * 02110-1301 USA, or see the FSF site: http://www.fsf.org.
 *
 */

// #ifdef __AMLSPLITBUTTON || __INC_ALL

/**
 * An element displaying a skinnable rectangle which can contain other 
 * AML elements. This element is used by other elements such as the 
 * toolbar and statusbar element to specify sections within those elements
 * which in turn can contain other AML elements.
 * 
 * #### Remarks
 *
 * This component is used in the accordian element to create its sections. In
 * the statusbar, the panel element is an alias of `bar`.
 *
 * @class apf.splitbutton
 * @define bar, panel, menubar
 * @allowchild button
 * @allowchild {elements}, {anyaml}
 *
 * @inherits apf.GuiElement
 *
 * @author      Ruben Daniels (ruben AT ajax DOT org)
 * @version     %I%, %G%
 * @since       0.4
 */
/**
 * @attribute {String} icon Sets or gets the url pointing to the icon image.
 */
/**
 * @attribute {Boolean} collapsed=false  Sets or gets collapse panel on load.
 */
/**
 * @attribute {String} title   Describes the content in a panel
 */
apf.splitbutton = function(struct, tagName){
    this.$init(tagName || "splitbutton", apf.NODE_VISIBLE, struct);
};

(function(){
    this.$focussable = false;
    
    this.$propHandlers["caption"] = function(value) {
        this.$button1.setProperty("caption", value);
    }
    
    this.$propHandlers["icon"] = function(value) {
        this.$button1.setProperty("icon", value);
    }
    
    this.$propHandlers["tooltip"] = function(value) {
        this.$button1.setProperty("tooltip", value);
    }
    
    this.$propHandlers["hotkey"] = function(value) {
        this.$button1.setProperty("hotkey", value);
    }

    this.$propHandlers["disabled"] = function(value) {
        this.$button1.setProperty("disabled", value);
        this.$button2.setProperty("disabled", value);
    }
    
    this.$propHandlers["submenu"] = function(value) {
        this.$button2.setProperty("submenu", value);
        
        var _self = this;
        this.$button2.addEventListener("mousedown", function() {
            if (!self[value].$splitInited) {
                self[value].addEventListener("display", function(){
                    var split = this.opener.parentNode;
                    var diff = apf.getAbsolutePosition(split.$button2.$ext)[0]
                        - apf.getAbsolutePosition(split.$button1.$ext)[0];
                    
                    this.$ext.style.marginLeft = "-" + diff + "px";
                });
                self[value].$splitInited = true;
            }
            
            this.removeEventListener("mousedown", arguments.callee);
        });
    }
    
    this.$draw = function(){
        var _self = this;
        this.$ext = this.$pHtmlNode.appendChild(document.createElement("div"));
        //this.$ext.style.overflow = "hidden";
        //this.$ext.style.position = "relative";
        
        var skin = this.getAttribute("skin") || this.localName;
        
        this.$button1 = new apf.button({
            htmlNode: this.$ext,
            parentNode: this,
            skin: skin,
            "class": "main",
            onmouseover: function() {
                apf.setStyleClass(this.$ext, "primary");
                _self.$button2.$setState("Over", {});
                
                _self.dispatchEvent("mouseover", { button: this });
            },
            onmouseout: function() {
                apf.setStyleClass(this.$ext, "", ["primary"]);
                _self.$button2.$setState("Out", {});
                
                _self.dispatchEvent("mouseout", { button: this });
            },
            onclick: function(e) {
                _self.dispatchEvent("click");
            }
        });
        
        this.$button2 = new apf.button({
            htmlNode: this.$ext,
            parentNode: this,
            skin: skin,
            "class": "arrow",
            onmouseover: function() {
                apf.setStyleClass(this.$ext, "primary");
                _self.$button1.$setState("Over", {});
                
                _self.dispatchEvent("mouseover", { button: this });
            },
            onmouseout: function() {
                if(!_self.$button2.value) {
                    apf.setStyleClass(this.$ext, "", ["primary"]);
                    _self.$button1.$setState("Out", {});
                }
                else {
                    apf.setStyleClass(this.$ext, "primary");
                    _self.$button1.$setState("Over", {});
                }
                
                _self.dispatchEvent("mouseout", { button: this });
            }
        });
    };

    this.$loadAml = function(x){
        
    };
    
}).call(apf.splitbutton.prototype = new apf.GuiElement());

apf.aml.setElement("splitbutton",  apf.splitbutton);

// #endif
