// Copyright (C) 1999-2019 Siber Systems Inc. All Rights Reserved.
var RfapiJS=RfapiJS||{};(function(){var e=RfapiJS.traceJS,t=(RfapiJS.SibErrType,RfapiJS.traceLevel),s=(RfapiJS.RfErrType,RfapiJS.utils),r=RfapiJS.UTF8,i={enInitial:0,enError:1,enServerError:2,enClientFirstMessageSent:3,enServerFirstMessageRecieved:4,enClientFinalMessageSent:5,enServerFinalMessageRecieved:6,enAuthRejected:7,enServerVerified:8},a={enNone:0,enSHA1:1,enSHA224:2,enSHA256:3,enSHA512:4};function n(){this.m_ctx=new _,this.m_realm="",this.m_sid="",this.m_random=Math.floor(1e8*Math.random()),this.s_nonceLength=16}function _(){this.m_state=i.enInitial,this.m_user_name="",this.m_user_name_escaped="",this.m_password=null,this.m_client_nonce="",this.m_client_first_message="",this.m_client_first_message_bare="",this.m_server_first_message="",this.m_client_server_nonce="",this.m_salt=null,this.m_hash_iterations=0,this.m_use_password_MD5=!1,this.m_salted_password=null,this.m_client_key=null,this.m_stored_key=null,this.m_authentication_message=null,this.m_server_key=null,this.m_client_final_message="",this.m_server_final_message="",this.m_verifier=null,this.m_server_error="",this.m_have_cached_values=!1,this.m_cached_password=[],this.m_cached_salt=[],this.m_cached_hash_iterations=0,this.m_cached_use_password_md5=!1,this.m_cached_salted_password=null,this.m_cached_client_key=null,this.m_cached_server_key=null,this.m_cached_stored_key=null,this.m_hashAlgorithm=a.enNone,this.m_saltedPasswordLength=0,this.m_hashLength=0,this.EVP_MAX_MD_SIZE=64}function h(){this.m_sMethodA="",this.m_NamValArgs={}}n.prototype.Empty=function(){this.m_ctx.Empty(),this.m_sid=""},n.prototype.CheckRealm=function(s){return""==this.m_realm||s==this.m_realm||(e("Wrong realm: "+s,"rf-scram.js",t.INFO),!1)},n.prototype.SetRealm=function(e){this.m_realm=e},n.prototype.GenerateNonce=function(e){var t=s.randomBytes(e),r=s.bytesToBase64(t);return r=(r=(r=r.replace(new RegExp("=","g"),"")).replace(new RegExp("\\+","g"),"-")).replace(new RegExp("/","g"),"_")},n.prototype.GetAuthRequestHeader=function(n,_){var h="";switch(this.m_ctx.GetState()){case i.enServerFirstMessageRecieved:var m=this.m_ctx.MakeClientFinalMessage();h="SibAuth ",this.m_sid&&(h+='sid="'+this.m_sid+'",');var o=r.stringToBytes(m);h+='data="'+(d=s.bytesToBase64(o))+'"';break;case i.enClientFinalMessageSent:case i.enServerFinalMessageRecieved:case i.enServerVerified:var c=this.GenerateNonce(this.s_nonceLength);m=this.m_ctx.MakeClientNextMessage(c);h="SibAuth ";break;default:c=this.GenerateNonce(this.s_nonceLength);e("SibHttpScramAuthClient.GetAuthRequestHeader. FIRST_CLIENT nonce='"+c+"'","rf-scram.js",t.INFO);var l=r.stringToBytes(_),d=(m=this.m_ctx.MakeClientFirstMessage(n,l,a.enSHA256,c),o=r.stringToBytes(m),s.bytesToBase64(o));h='SibAuth realm="'+this.m_realm+'",data="'+d+'"'}return h},n.prototype.ParseServerResponse=function(a){var n=a.m_NamValArgs.realm,_=a.m_NamValArgs.sid,h=a.m_NamValArgs.data,m="";if(h){var o=s.base64ToBytes(h);m=r.bytesToString(o)}if(""==m)return e("SCRAM Auth: bad base64 encoding","rf-scram.js",t.INFO),!1;if(n)return this.Empty(),!!this.CheckRealm(n)&&(e("[SibAuth: sending first client message]","rf-scram.js",t.INFO),!1);switch(this.m_ctx.GetState()){case i.enClientFirstMessageSent:return!!this.m_ctx.ParseServerFirstMessage(m)&&(this.m_sid=_,e("[SibAuth: sending final client message]","rf-scram.js",t.INFO),!0);case i.enClientFinalMessageSent:return!!this.CheckSession(_)&&!!this.m_ctx.ParseServerFinalMessage(m);default:return e("Unathorized","rf-scram.js",t.INFO),!1}},_.prototype.MakeClientFinalMessage=function(){if(this.m_have_cached_values&&s.compareSets(this.m_password,this.m_cached_password)&&s.compareSets(this.m_salt,this.m_cached_salt)&&this.m_hash_iterations==this.m_cached_hash_iterations&&this.m_use_password_MD5==this.m_cached_use_password_md5)this.m_salted_password=this.m_cached_salted_password,this.m_client_key=this.m_cached_client_key,this.m_server_key=this.m_cached_server_key,this.m_stored_key=this.m_cached_stored_key;else{this.m_have_cached_values=!0,this.m_cached_password=this.m_password,this.m_cached_salt=this.m_salt,this.m_cached_hash_iterations=this.m_hash_iterations,this.m_cached_use_password_md5=this.m_use_password_MD5,this.m_salted_password=this.CalcSaltedPassword(this.m_use_password_MD5?this.GsMd5HashAsHexStr(this.m_password):this.m_password,this.m_salt,this.m_hash_iterations);var a=this.CalcInternalKeys(this.m_salted_password);this.m_client_key=a.Item1,this.m_server_key=a.Item2,this.m_stored_key=a.Item3,this.m_cached_salted_password=this.m_salted_password,this.m_cached_client_key=this.m_client_key,this.m_cached_server_key=this.m_server_key,this.m_cached_stored_key=this.m_stored_key}var n="c=biws,r="+this.m_client_server_nonce,_=this.m_client_first_message_bare+","+this.m_server_first_message+","+n;e("SibScramAuthClient.MakeClientFinalMessage. authMsg='"+_+"'","rf-scram.js",t.INFO),this.m_authentication_message=r.stringToBytes(_);for(var h=this.Hmac(this.m_stored_key,this.m_authentication_message,!1),m=this.m_client_key.length,o=new Array(m),c=0;c<m;c++)o[c]=this.m_client_key[c]^h[c];var l=n+",p="+s.bytesToBase64(o);return e("SibScramAuthClient.MakeClientFinalMessage. client_final_message='"+l+"'","rf-scram.js",t.INFO),this.m_state=i.enClientFinalMessageSent,l},_.prototype.ParseServerFirstMessage=function(r){if(this.m_state!=i.enClientFirstMessageSent)return this.SetError(),e("SCRAM Auth: unexpected server response","rf-scram.js",t.INFO),!1;this.m_server_first_message="",this.m_client_server_nonce="",this.m_salt=[],this.m_hash_iterations=0,this.m_use_password_MD5=!1;var a,n=[],_="",h=0,m="",o=r;do{var c=o.indexOf(",");-1!=c?(a=o.substring(0,c),o=o.substring(c+1)):(a=o,o="");var l={param:a};if(this.StrLeftEqRem(a,"r=",l))_=a=l.param;else if(this.StrLeftEqRem(a,"s=",l)){if(a=l.param,0==(n=s.base64ToBytes(a)).length)return this.SetError(),e("SCRAM Auth: bad server response - bad base64 encoding","rf-scram.js",t.INFO),!1}else if(this.StrLeftEqRem(a,"i=",l)){if(!(h=a=l.param)||0==h)return this.SetError(),e("SCRAM Auth: bad server response - iterations=0","rf-scram.js",t.INFO),!1}else this.StrLeftEqRem(a,"o=",l)&&(m=a=l.param)}while(""!=o);return""==_||0==n.length?(this.SetError(),e("SCRAM Auth: bad server response","rf-scram.js",t.INFO),!1):(e("SibHttpScramAuthClient.ParseServerFirstMessage. Server NONCE='"+_+"'","rf-scram.js",t.INFO),_.startsWith(this.m_client_nonce)?(this.m_server_first_message=r,this.m_client_server_nonce=_,this.m_salt=n,this.m_hash_iterations=h,m.indexOf("pwdMD5")>=0&&(this.m_use_password_MD5=!0),this.m_state=i.enServerFirstMessageRecieved,this.m_salt==this.m_cached_salt&&this.m_hash_iterations==this.m_cached_hash_iterations&&this.m_use_password_MD5==this.m_cached_use_password_md5||this.EmptyCache(),!0):(this.SetError(),e("SCRAM Auth: bad server response - nonce mismatch","rf-scram.js",t.INFO),!1))},_.prototype.MakeClientFirstMessage=function(s,r,a,n){return this.Empty(),r==this.m_cached_password&&a==this.m_hashAlgorithm||this.EmptyCache(),this.SetHashAlgorithm(a),this.m_user_name=s,this.m_password=r,this.m_client_nonce=this.MakeNonceValid(n),e("SibHttpScramAuthClient.MakeClientFirstMessage. after MakeNonceValid this.m_client_nonce='"+this.m_client_nonce+"'","rf-scram.js",t.INFO),this.m_client_first_message_bare="n="+encodeURI(this.m_user_name)+",r="+this.m_client_nonce,this.m_client_first_message="n,,"+this.m_client_first_message_bare,this.m_state=i.enClientFirstMessageSent,this.m_client_first_message},_.prototype.Empty=function(){this.m_state=i.enInitial,this.m_user_name="",this.m_password=[],this.m_client_nonce="",this.m_client_first_message="",this.m_client_first_message_bare="",this.m_server_first_message="",this.m_client_server_nonce="",this.m_salt=[],this.m_hash_iterations=0,this.m_use_password_MD5=!1,this.m_salted_password=[],this.m_client_key=[],this.m_stored_key=[],this.m_authentication_message=[],this.m_server_key=[],this.m_server_final_message="",this.m_verifier=[],this.m_server_error=""},_.prototype.EmptyCache=function(){this.m_have_cached_values&&(this.m_have_cached_values=!1,this.m_cached_password=[],this.m_cached_salt=[],this.m_cached_hash_iterations=0,this.m_cached_use_password_md5=!1,this.m_cached_salted_password=[],this.m_cached_client_key=[],this.m_cached_server_key=[],this.m_cached_stored_key=[])},_.prototype.GetUserName=function(){return this.m_user_name},_.prototype.StrLeftEqRem=function(e,t,s){return s.param=e,!!e.startsWith(t)&&(s.param=e.substring(t.length),!0)},_.prototype.GetNonce=function(){return this.m_client_server_nonce},_.prototype.GetSalt=function(){return this.m_salt},_.prototype.GetHashIterations=function(){return this.m_hash_iterations},_.prototype.GetServerError=function(){return this.m_server_error},_.prototype.SetError=function(){this.m_state=i.enError},_.prototype.GetState=function(){return this.m_state},_.prototype.GsMd5HashAsHexStr=function(e){var t=CryptoJS.MD5(r.bytesToString(e));return t=t.toString(),r.stringToBytes(t)},_.prototype.CalcStoredInfo=function(e,t,s){var i=this.CalcSaltedPassword(r.stringToBytes(e),t,s);return this.CalcInternalKeys(i)},_.prototype.SetHashAlgorithm=function(s){switch(this.m_hashAlgorithm=s,s){case a.enSHA256:break;case a.enNone:case a.enSHA1:case a.enSHA224:case a.enSHA512:default:return void e("SibScramAuthClient.SetHashAlgorithm. Hash algorithm is not supported","rf-scram.js",t.INFO)}this.m_saltedPasswordLength=this.m_hashLength=this.EVP_MAX_MD_SIZE},_.prototype.MakeNonceValid=function(e){for(var t="",s=0;s<e.length;s++){var r=null!=e[s]?e[s]:e.charAt(s),i=r,a=(i.charCodeAt(0)-"!".charCodeAt(0))%("~".charCodeAt(0)-"!".charCodeAt(0)+1)+"!".charCodeAt(0);","==(i=String.fromCharCode(a))&&(i="~"),t+=i!=r?i:r}return t},_.prototype.CalcStoredInfo=function(e,t,s){var r=this.CalcSaltedPassword(e,t,s),i=this.CalcInternalKeys(r);return{item2:i.Item2,item3:i.Item3}},_.prototype.CalcSaltedPassword=function(e,t,s){return new RfapiJS.Pbkdf2(2,t,r.bytesToString(e),s).GetBytes(32)},_.prototype.CalcInternalKeys=function(e){var t=this.Hmac(e,"Client Key",!0);return{Item1:t,Item2:this.Hmac(e,"Server Key",!0),Item3:this.Hash(t)}},_.prototype.Hmac=function(e,t,i){var a=s.bytesToBase64(e),n=CryptoJS.enc.Base64.parse(a);if(i)var _=r.stringToBytes(t),h=s.bytesToBase64(_);else h=s.bytesToBase64(t);var m=CryptoJS.enc.Base64.parse(h),o=CryptoJS.algo.HMAC.create(CryptoJS.algo.SHA256,n);o.update(m);var c=o.finalize();return c=c.toString(CryptoJS.enc.Base64),bytesHash=s.base64ToBytes(c),bytesHash},_.prototype.Hash=function(e){var t=s.bytesToBase64(e),r=CryptoJS.enc.Base64.parse(t),i=CryptoJS.SHA256(r);return i=i.toString(CryptoJS.enc.Base64),s.base64ToBytes(i)},_.prototype.EscapeUserName=function(e){return e.replace("=","=3D").replace(",","=2C")},_.prototype.UnescapeUserName=function(e){return e.replace("=2C",",").replace("=3D","=")},RfapiJS.SibHttpScramAuthClient=n,RfapiJS.SibHttpGetAuthMethod=function(e){var t=new h,s=e.indexOf(" ");t.m_sMethodA=e.substring(0,s);for(var r=(e=e.substring(s).trimLeft().trimRight()).split(","),i=0;i<r.length;i++){var a=r[i],n=a.indexOf("="),_=a.substring(0,n),m=a.substring(n+2);m=m.replace(new RegExp('"',"g"),""),_&&m&&(t.m_NamValArgs[_]=m)}return t},RfapiJS.SibScramAuthClient=_}).apply(RfapiJS);
//# sourceMappingURL=rf-scram.js.map