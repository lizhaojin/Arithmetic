function hasPlugin(name) {
    name = name.toLowerCase();
    for(var i = 0; i < navigator.plugins.length; i++) {
        if(navigator.plugins[i].name.toLocaleLowerCase().indexOf(name) > -1) {
            return true;
        }
    }
    return false;
}