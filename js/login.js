function LoginJS() {
    this.token = function () {
        console.log(sessionStorage.token);
        return sessionStorage.token;
    };

    this.login = function(uname, pword, redUrl) {
        var context = this;
        var vdata = JSON.stringify({ "username": uname, "password": pword });
        console.log(vdata);
        $.ajax({
            url: MAIN_URL+'/api/auth/signin',
            type: 'POST',
            data: vdata ,
            contentType: 'application/json',
            success: function (data) {
                console.log(data.token);
                storage.storeAccountToken(uname, data);
                // sessionStorage.uname = context.uname;
                // sessionStorage.token = data.token;
                // sessionStorage.companyCode = data.companyCode;
                //redirect
                setTimeout(function() {
                    window.location.href = redUrl;
                }, 500);
            },
            error: function (data) {
                console.log(data.responseJSON.message);
                showModalAny.show('', data.responseJSON.message);
            }
        });
    }

    this.register = function(uname, pword, firstName, lastName) {
        console.log(firstName);
        console.log(lastName);
        var vdata = JSON.stringify({ "username": uname, "password": pword, "name": firstName, "lastName": lastName });
        var redUrl = this.redirectURL;
        console.log(vdata);
        $.ajax({
            url: MAIN_URL+'/api/auth/register',
            type: 'POST',
            data: vdata ,
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
}

$(function () {
    loginJS = new LoginJS();
});
