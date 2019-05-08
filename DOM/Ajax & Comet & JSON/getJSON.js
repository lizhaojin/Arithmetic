var getJSON = function(url) {
    var promise = new Promise(function(resolve, reject) {
        var client = new XMLHttpRequest();
        client.open('GET', url);
        client.onreadystatechange = handle;
        client.responseType = 'json';
        client.setRequestHeader('Accept', 'application/json');
        client.send();

        function handle() {
            if (this.readyState === this.DONE) {
                if (this.status === 200) {
                    resolve(this.reaponse);
                } else {
                    reject(this);
                }
            }
        }
    });
    return promise;
};

getJSON('/posts.json').then(function(json) {

}, function(error) {

});