class MobileLogin {
    login(uname, pword, successFunc) {
        var vdata = JSON.stringify({ "username": uname, "password": pword });
        console.log(vdata);
        $.ajax({
            url: MAIN_URL + '/api/auth/signin',
            type: 'POST',
            data: vdata,
            contentType: 'application/json',
            success: function (data) {
                successFunc(data);
            },
            error: function (data) {
                console.log(data.responseJSON.message);
            }
        });
    }

    hasRole(role) {
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

    loadProfile(token, successFunc) {
        let url = `${MAIN_URL}/api/auth/getProfile`;
        let ajaxRequestDTO = new AjaxRequestDTO(url, "");
        let successFunction = function (data) {
            storage.setCompanyCode(data.getPropDefault("companyCode", "--"));
            storage.set("UserObj", data.getPropDefault("user", "--"));
            storage.set("PersonObj", data.getPropDefault("person", "--"));
            storage.set("RolesObj", data.getPropDefault("roles", "--"));
        };
        mobileAjaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }
}

$(function () {
    mobileLogin = new MobileLogin();
});
