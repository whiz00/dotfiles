// Copyright (C) 1999-2019 Siber Systems Inc. All Rights Reserved.
var CRfProxy=CRfProxyChromeNativeMessage;function CRfProxyChromeNativeMessage(){this.m_port=void 0,this.m_callbacks={},this.m_counter=0,this.m_chunks=[]}CRfProxyChromeNativeMessage.prototype.Connect=function(e,t,o){try{this.m_port=browser.runtime.connectNative("com.siber.roboform");var r=this;this.m_port.onMessage.addListener(function(e){try{var t=e.chunk;if(t){var o=t.index;0==o&&(r.m_chunks.length=0),r.m_chunks.push(t);t.count;var s=t.last;if(!s)return;for(var a="",n=0;n<r.m_chunks.length;n++)a+=r.m_chunks[n].data;r.m_chunks.length=0,e=JSON.parse(a)}var c=e.callbackId;if(c){var i=r.m_callbacks[c];if(!i)return void log("!!! no callback");delete r.m_callbacks[c],i(e.result)}else{var m=e.tabId,h=e.frameId,l=e.name,g=e.args||[];if(!m||!l)return void log("!!! wrong params");var u=g_roboform.g_browsers[m];if(!u)return void log("!!! no browser");if(h){var _=u.m_frames[h];if(!_)return void log("!!! no frame");_[l].apply(_,g)}else u[l].apply(u,g)}}catch(e){log(e)}}),this.m_port.onDisconnect.addListener(t),this.sendMessage("ping",[],function(){try{e(),r.m_port.onDisconnect.removeListener(t),r.m_port.onDisconnect.addListener(o)}catch(e){log(e),t()}})}catch(e){log("can not connect to host"),t()}},CRfProxyChromeNativeMessage.prototype.postMessage=function(e,t){this.m_port.postMessage({name:e,args:t})},CRfProxyChromeNativeMessage.prototype.sendMessage=function(e,t,o){var r,s={name:e,args:t};o&&(this.m_counter++,this.m_counter<=0&&(this.m_counter=1),r=this.m_counter,s.callbackId=r,this.m_callbacks[r]=o);try{this.m_port.postMessage(s)}catch(e){throw log(e),o&&delete this.m_callbacks[r],e}};
//# sourceMappingURL=proxy-chrome-nm.js.map