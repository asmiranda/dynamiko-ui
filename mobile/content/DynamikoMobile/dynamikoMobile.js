class DynamikoMobile {
    loadExplore() {
        var url = "https://dynamikosoft.com:7777/mobile/content/DynamikoMobile/exploreContent.html";
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function (data) {
            $("#main").html(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadNews() {
        var url = "https://dynamikosoft.com:7777/mobile/content/DynamikoMobile/newsContent.html";
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function (data) {
            $("#main").html(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }
}

$(function () {
    alert("loaded dynamiko mobile!");
})