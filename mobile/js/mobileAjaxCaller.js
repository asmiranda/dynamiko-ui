class MobileAjaxCaller {
    beforeSend(xhr) {
        if (mobileStorage.token) {
            xhr.setRequestHeader('Authorization', 'Bearer ' + mobileStorage.token);
        }
    }
    errFunction(jqXHR, textStatus, errorThrown) {
        if ("Access Denied" == jqXHR.responseJSON.message) {
            // window.location.href = "login.html";
        }
        else {
            if (jqXHR.responseJSON) {
                showModuleHelp.show("Information", jqXHR.responseJSON.message);
            }
            else {
                showModuleHelp.show("Information", jqXHR.responseText);
            }
        }
    }
    ajaxGet(dto, callback) {
        $.ajax({
            type: 'GET',
            url: dto.url,
            data: dto.data,
            contentType: 'application/json',
            beforeSend: mobileAjaxCaller.beforeSend,
            error: mobileAjaxCaller.errFunction,
            success: callback
        });
    }
    ajaxPost(dto, callback) {
        $.ajax({
            type: 'POST',
            url: dto.url,
            data: dto.data,
            contentType: 'application/json',
            beforeSend: mobileAjaxCaller.beforeSend,
            error: mobileAjaxCaller.errFunction,
            success: callback
        });
    }
}

$(function () {
    mobileAjaxCaller = new MobileAjaxCaller();
});
