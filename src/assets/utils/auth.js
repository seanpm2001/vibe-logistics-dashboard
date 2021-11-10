const TokenKey = 'Admin-Token';

export function setCookie(name,value){  
  const Days = 30;  
  const exp  = new Date();  
  exp.setTime(exp.getTime() + Days*24*60*60*1000);  
  document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();  
}  

export function getCookie(name){  
  const arr = document.cookie.match(new RegExp("(^| )"+name+"=([^;]*)(;|$)"));  
  if(arr != null){  
    return (arr[2]);  
  }else{  
    return "";  
  }  
}

export function delCookie(name) {  
  const exp = new Date();  
  exp.setTime(exp.getTime() - 1);  
  const cval= getCookie(name);  
  if(cval!=null) document.cookie= name + "="+cval+";expires="+exp.toGMTString();  
}

export function getToken() {
  return getCookie(TokenKey);
}

export function setToken(token) {
  return setCookie(TokenKey, token);
}

export function removeToken() {
  return delCookie(TokenKey);
}
