// 检测所有浏览器中的Flash插件
function hasFlash() {
    var result = hasPlugin("Flash");
    if(!result) {
        result = hasIEPlugin("ShcokwaveFlash.ShockwaveFlash");
    }
    return false;
}

//检测所有浏览器中的QuickTime插件
function hasQuickTime() {
    var result = hasPlugin("QuickTime");
    if(!result) {
        result = hasIEPlugin("QuickTime.QuickTime");
    }
    return result;
}