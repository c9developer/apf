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

/**
 * Notification componenet, which shows popups when new events happen. Similar
 * to growl on the OSX platform.
 * Example:
 * <pre class="code">
 * <j:notifier position="bottom-right" margin="10,10">
 *     <j:event when="{offline.isOnline}" message="You are currently working offline" icon="icoOffline.gif" />
 *     <j:event when="{!offline.isOnline}" message="You are online" icon="icoOnline.gif" />
 *     <j:event when="{offline.syncing}" message="Your changes are being synced" icon="icoSyncing.gif" />
 *     <j:event when="{!offline.syncing}" message="Syncing done" icon="icoDone.gif" />
 * </j:notifier>
 * </pre>
 */
jpf.notifier = jpf.component(jpf.GUI_NODE, function() {   
    this.pHtmlNode = document.body;
    this.timeout   = 4000;//in milliseconds    
    
    this.__supportedProperties.push("margin", "position", "width", "timeout");

    var lastPos = null;
    var showing = 0;
    var _self   = this;
	var sign = 1;	

    this.popupEvent = function(ev){       
        var oNoti = this.pHtmlNode.appendChild(this.oExt.cloneNode(true)); 
		var ww = jpf.isIE ? document.documentElement.offsetWidth : window.innerWidth;
		var wh = jpf.isIE ? document.documentElement.offsetHeight : window.innerHeight;			       
        
        this.__getLayoutNode("notification", "message", oNoti).innerHTML = ev.message;
        var oIcon = this.__getLayoutNode("notification", "icon", this.oExt);
        if (oIcon) {
            if (oIcon.nodeType == 1)
                oIcon.style.backgroundImage = "url(" + this.iconPath + ev.icon + ")";
            else
                oIcon.nodeType = this.iconPath + ev.icon;
        }
        oNoti.style.display = "block";
                
        var margin = jpf.getBox(this.margin || "0");
		var nh = oNoti.offsetHeight;
		var nw = oNoti.offsetWidth;
		var x = this.position.split("-");
        
		/* start positions */
		if (!lastPos) {            
			var ver = (x[0] == "top" ? margin[0] : (x[0] == "bottom" ? wh - nh - margin[2] : wh/2 - nh/2));
			var hor = (x[1] == "left" ? margin[3] : (x[1] == "right" ? ww - nw - margin[1] : ww/2 - nw/2));
			
			lastPos = [ver, hor];  
        }				
		
		/* reset to next line, first for vertical, second horizontal */
		if(lastPos[0] > wh-nh || lastPos[0] < 0){			
			lastPos[1] += (x[1] == "left" ? nw + margin[3] : (x[1] == "right" ? -nw - margin[3] : 0));
			sign *=-1;
			lastPos[0] += sign*(x[0] == "top" ? margin[0] + nh : (x[0] == "bottom" ? - margin[2] - nh : 0));		
		}
		else if(lastPos[1] > ww-nw || lastPos[1] < 0){
			lastPos[0] += (x[0] == "top" ? nh + margin[0] : (x[0] == "bottom" ? - nh - margin[0] : 0));
			sign *=-1;
			lastPos[1] += x[0] == "center" ? 0 : sign*(x[1] == "left" ? margin[3] + nw : (x[1] == "right" ? - margin[1] - nw : 0));
		}
		
        oNoti.style.left = lastPos[1] + "px";
        oNoti.style.top  = lastPos[0] + "px";
		
		if(this.arrange == "vertical"){
			lastPos[0] += x[1] == "center" ? 0 : sign*(x[0] == "top" ? margin[0] + nh : (x[0] == "bottom" ? - margin[2] - nh : 0));	
		}
		else{
			lastPos[1] += x[0] == "center" ? 0 : sign*(x[1] == "left" ? margin[3] + nw : (x[1] == "right" ? - margin[1] - nw : 0)); 
		}		
        
        showing++;
        
        jpf.tween.single(oNoti, {
            type    : 'fade', 
            from    : 0, 
            to      : 0.8, 
            anim    : jpf.tween.NORMAL, 
            steps   : 100,
            interval: 10,
            onmouseover : function(){
				to : 1
			},
			onfinish: function(container){
                setTimeout(function(){
                    jpf.tween.single(oNoti, {
                        type    : 'fade', 
                        from    : 0.8, 
                        to      : 0, 
                        anim    : jpf.tween.NORMAL, 
                        steps   : 100,
                        interval: 10,
                        onfinish: function(){
                            showing--;
                            oNoti.parentNode.removeChild(oNoti);
                            if (!showing)
                                lastPos = null;
                        }
                    });
                }, _self.timeout);
            }
        });
    
		/* Events */	
		oNoti.onmouseover = function(e){
			if (jpf.hasStyleFilters) 
	            oNoti.style.filter  = "alpha(opacity=100)";        
	        else
	            oNoti.style.opacity = 1;
		}
		
		oNoti.onmouseout = function(e){
			if (jpf.hasStyleFilters) 
	            oNoti.style.filter  = "alpha(opacity=80)";        
	        else
	            oNoti.style.opacity = 0.8;
		}
	
	}
	this.popup = function(message, icon){
		
	}

    this.draw = function() {
        //Build Main Skin
        this.oExt = this.__getExternal("notification");
        this.oExt.style.display = "none";
    }
    
    this.__loadJML = function(x) {
        var nodes = x.childNodes;        		
			
		for (var l = nodes.length-1, i = 0; i < l; i++) {           
		    node = nodes[i];
            if (node.nodeType != 1)
                continue;
            
            if (node[jpf.TAGNAME] == "event") {
                var ev = new jpf.notifier.event(this.pHtmlNode, "event", this);
                
                ev.loadJML(node);               
				ev.handlePropSet("when", node.getAttribute("when"), false);
								
                this.childNodes.push(ev);
            }
        }
    }
}).implement(jpf.Presentation);

//@todo You might want to add icons to the event as well
jpf.notifier.event = jpf.subnode(jpf.NOGUI_NODE, function(){
    var first = true;
	this.__supportedProperties = ["when", "message", "icon"];
    
    this.handlePropSet = function(prop, value, force){        
		this[prop] = value;
        
        if (first && prop == "when" && this.parentNode && this.parentNode.popupEvent){
			this.parentNode.popupEvent(this);
		}	
		first = true;			
    }
    
    this.loadJML = function(x){
        this.message = x.getAttribute("message") || "[Empty]";
    }
});