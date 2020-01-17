function LoginJS(uname, pword) {
    this.uname = uname;
    this.pword = pword;
    
    this.token = function () {
        console.log(sessionStorage.token);
        return sessionStorage.token;
    };

    this.login = function(redUrl) {
        var context = this;
        var vdata = JSON.stringify({ "username": this.uname, "password": this.pword });
        console.log(vdata);
        $.ajax({
            url: MAIN_URL+'/api/auth/signin',
            type: 'POST',
            data: vdata ,
            contentType: 'application/json',
            success: function (data) {
                console.log(data.token);
                sessionStorage.uname = context.uname;
                sessionStorage.token = data.token;
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

    this.register = function(firstName, lastName) {
        console.log(firstName);
        console.log(lastName);
        var vdata = JSON.stringify({ "username": this.uname, "password": this.pword, "name": firstName, "lastName": lastName });
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
