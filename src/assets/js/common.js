/*!
 * 公共方法
 */


/**
 * 判断是否为手机用户
 * @returns {Boolean} 
 */
export function isPhone() {
  const userAgent = navigator.userAgent.toLowerCase();
  return userAgent.indexOf("iphone") > -1 || userAgent.indexOf("android") > -1;
}

/**
 * 将且仅将对象A中每个键对应的值改为对象B中的值
 * A{ a:0, b:'' }, B{ a:1, b:'b', c:2 } ==> A{ a:1, b:'b' }
 * @param {*} objA 对象A
 * @param {*} objB 对象B
 */
export function assignBToA(objA, objB) {
  Object.keys(objA).forEach(key => {
    objA[key] = objB[key] || objA[key]
  })
}

/**
 * 将对象属性由驼峰法命名转换为下划线命名
 * obj{ aId:0, b:1 }==> obj{ a_id:0, b:1 }
 * @param {*} obj 对象
 */
export function objectHumpToLine(obj) {
  const newObj = {}
  for (const key in obj) {
    newObj[key.replace(/([A-Z])/g, '_$1').toLowerCase()] = obj[key]
  }
  return newObj
}

/**
 * 将对象属性由下划线命名转换为驼峰法命名
 * obj{ a_id:0, b:1 }==> obj{ aId:0, b:1 }
 * @param {*} obj 对象
 */
export function objectLineToHump(obj) {
  const newObj = {}
  for (const key in obj) {
    newObj[key.replace(/_(\w)/g, function (all, letter) {
      return letter.toUpperCase()
    })] = obj[key]
  }
  return newObj
}

// 封装获取cookie
export function getCookie(name) {
  const prefix = name + "="
  const start = document.cookie.indexOf(prefix)

  if (start === -1) {
    return null;
  }

  let end = document.cookie.indexOf(";", start + prefix.length)
  if (end === -1) {
    end = document.cookie.length;
  }

  const value = document.cookie.substring(start + prefix.length, end)
  return unescape(value);
}

//封装设置cookie
export function setCookie(name, value, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  const expires = "expires=" + d.toUTCString();
  document.cookie = name + "=" + value + "; " + expires;
}


//封装删除cookie 
export function delCookie() {
  const expireTime = new Date();
  expireTime.setTime(expireTime.getTime() - 1);
  const existedCookie = getCookie(name);
  if (existedCookie != null)
    document.cookie = name + "=" + existedCookie + ";expires=" + expireTime.toUTCString();
}