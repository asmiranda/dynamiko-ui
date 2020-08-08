class MobileUtil {
    getToken() {
        alert(window.location.href)
        let token = this.getUrlParamValue(window.location.href, "token");
        return token;
    }

    getUrlParamValue(url, key) {
        var value = "";
        var arr = url.split("?");
        var query = arr[1];
        var vars = query.split('&');
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split('=');
            if (key == pair[0]) {
                value = decodeURIComponent(pair[1]);
                break;
            }
        }
        return value;
    };
}

$(function () {
    mobileUtil = new MobileUtil();
})