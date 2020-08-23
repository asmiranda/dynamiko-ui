function LoginJS() {
    this.token = function () {
        console.log(session.getToken());
        return session.getToken();
    };

    this.hasRole = function (role) {
        var withRole = false;
        let roles = storage.get("RolesObj");
        $(roles).each(function (index, obj) {
            var authority = obj.getPropDefault("authority", "--");
            if (authority.toUpperCase() == role.toUpperCase()) {
                withRole = true;
            }
        })
        console.log(roles);
        return withRole;
    }

    this.redirectHome = function (roles) {
        let str = JSON.stringify(roles);
        let redUrl = "home.html";
        if (utils.isAndroid()) {
            redUrl = "home-android.html";
        }
        if (str.includes("STUDENT")) {
            redUrl = "student-home.html"
        }
        else if (str.includes("FACULTY")) {
            redUrl = "faculty-home.html"
        }
        setTimeout(function () {
            window.location.href = redUrl;
        }, 500);
    }

    this.login = function (uname, pword, successFunc) {
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
                if (successFunc) {
                    successFunc(data);
                }
                else {
                    loginJS.redirectHome(data.roles);
                }
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

    this.loadProfile = function (token, successFunc) {
        // alert(`loadProfile token = ${sessionStorage.token}`);
        let url = `${MAIN_URL}/api/auth/getProfile`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        let successFunction = function (data) {
            storage.setCompanyCode(data.getPropDefault("companyCode", "--"));
            storage.set("UserObj", data.getPropDefault("user", "--"));
            storage.set("PersonObj", data.getPropDefault("person", "--"));
            storage.set("RolesObj", data.getPropDefault("roles", "--"));
            storage.setToken(token);
            if (successFunc) {
                successFunc();
            }
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }
}

$(function () {
    loginJS = new LoginJS();
});
