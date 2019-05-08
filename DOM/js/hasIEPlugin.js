function hasIEPlugin(name) {
    try{
        new ActiveXObject(name);
        return true;
    } catch (e) {
        return false;
    }
}