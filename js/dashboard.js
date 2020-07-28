class Dashboard {
    load(obj) {
        var moduleName = $(obj).attr("data");
        console.log("load " + moduleName);

        var url = MAIN_URL + "/api/ui/" + localStorage.companyCode + "/module/" + moduleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function (data) {
            $("#content-main").html(data);
            $('[data-mask]').inputmask();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }
}
