function LoginJS() {
    this.token = function () {
        console.log(sessionStorage.token);
        return sessionStorage.token;
    };

    this.hasRole = function (role) {
        var withRole = false;
        let roles = sStorage.get("RolesObj");
        $(roles).each(function (index, obj) {
            var authority = obj.getPropDefault("authority", "--");
            if (authority.toUpperCase() == role.toUpperCase()) {
                withRole = true;
            }
        })
        console.log(roles);
        return withRole;
    }

    this.login = function (uname, pword, redUrl) {
        var context = this;
        var vdata = JSON.stringify({ "username": uname, "password": pword });
        console.log(vdata);
        $.ajax({
            url: MAIN_URL + '/api/auth/signin',
            type: 'POST',
            data: vdata,
            contentType: 'application/json',
            success: function (data) {
                if (data.token == undefined) {
                    data.token = data.Authorization;
                }
                console.log(data.token);
                storage.storeAccountToken(uname, data);
                // loginJS.loadProfile(sessionStorage.token);
                setTimeout(function () {
                    if (redUrl) {
                        window.location.href = redUrl;
                    }
                }, 500);
            },
            error: function (data) {
                console.log(data.responseJSON.message);
                showModalAny.show('', data.responseJSON.message);
            }
        });
    }

    this.testLogin = function (uname, successFunc) {
        var context = this;
        var vdata = JSON.stringify({ "username": uname, "password": "password" });
        console.log(vdata);
        $.ajax({
            url: MAIN_URL + '/api/auth/signin',
            type: 'POST',
            data: vdata,
            contentType: 'application/json',
            success: function (data) {
                console.log(data.token);
                storage.storeAccountToken(uname, data);
                loginJS.loadProfile(sessionStorage.token);
                successFunc();
            },
            error: function (data) {
                console.log(data.responseJSON.message);
                showModalAny.show('', data.responseJSON.message);
            }
        });
    }

    this.register = function (uname, pword, firstName, lastName) {
        console.log(firstName);
        console.log(lastName);
        var vdata = JSON.stringify({ "username": uname, "password": pword, "name": firstName, "lastName": lastName });
        var redUrl = this.redirectURL;
        console.log(vdata);
        $.ajax({
            url: MAIN_URL + '/api/auth/register',
            type: 'POST',
            data: vdata,
            contentType: 'application/json',
            success: function (data) {
                console.log(data);

            },
            error: function (data) {
                console.log(data.responseJSON.message);
                showModalAny.show('', data.responseJSON.message);
            }
        });
    }

    this.loadProfile = function (token) {
        sessionStorage.token = token;
        // alert(`loadProfile token = ${sessionStorage.token}`);
        let url = `${MAIN_URL}/api/auth/getProfile`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        let successFunction = function (data) {
            // alert(`loadProfile success = ${data}`);
            sessionStorage.companyCode = data.getPropDefault("companyCode", "--");
            // alert(`loadProfile companyCode = ${sessionStorage.companyCode}`);
            sStorage.set("UserObj", data.getPropDefault("user", "--"));
            sStorage.set("PersonObj", data.getPropDefault("person", "--"));
            sStorage.set("RolesObj", data.getPropDefault("roles", "--"));
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }
}

$(function () {
    loginJS = new LoginJS();
});
