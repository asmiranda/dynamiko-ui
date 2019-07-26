class AjaxCaller {
    constructor(ajaxDTO, ajaxCallback) {
        this.ajaxDTO = ajaxDTO;
        this.ajaxCallback = ajaxCallback;
        this.resultData = "";
        console.log("URL ===== "+this.ajaxDTO.url);
    }

    ajaxGet() {
        var callback = this.ajaxCallback;
        $.ajax({
            type: 'GET',
            url: this.ajaxDTO.url,
            data: this.ajaxDTO.data,
            contentType: 'application/json',
            beforeSend: function(xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + localStorage.token);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('jqXHR:');
                console.log(jqXHR);
                console.log('textStatus:');
                console.log(textStatus);
                console.log('responseJSON:');
                console.log(jqXHR.responseJSON.message);
                var showModuleHelp = new ShowModuleHelp("Information", jqXHR.responseJSON.message);
                showModuleHelp.show();
            },
            success: callback
        });
    }

    ajaxPost() {
        var callback = this.ajaxCallback;
        $.ajax({
            type: 'POST',
            url: this.ajaxDTO.url,
            data: this.ajaxDTO.data,
            contentType: 'application/json',
            beforeSend: function(xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + localStorage.token);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('jqXHR:');
                console.log(jqXHR);
                console.log('textStatus:');
                console.log(textStatus);
                console.log('responseJSON:');
                console.log(jqXHR.responseJSON.message);
                var showModuleHelp = new ShowModuleHelp("Information", jqXHR.responseJSON.message);
                showModuleHelp.show();
            },
            success: callback
        });
    }
}

class AjaxFileViewer {
    constructor(ajaxCallback) {
        this.ajaxCallback = ajaxCallback;
    }

    getAllFiles(moduleName, recordId) {
        var callback = this.ajaxCallback;
        $.ajax({
            type: 'GET',
            url: "/api/generic/attachment/"+moduleName+"/"+recordId,
            data: "",
            contentType: 'application/json',
            beforeSend: function(xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + localStorage.token);
                }
            },
            success: callback
        });
    }

    download(fileUploadId) {
        var callback = this.ajaxCallback;
        $.ajax({
            type: 'GET',
            url: "/api/generic/attachment/download/"+recordId,
            data: "",
            contentType: 'application/octet-stream',
            beforeSend: function(xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + localStorage.token);
                }
            },
            success: callback
        });
    }
}

class AjaxReportViewer {
    constructor() {
    }

    display(reportName, vdata) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/generic/report/'+reportName, true);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);

        xhr.onload = function(e) {
            if (this.status == 200) {
                var file = new Blob([xhr.response], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                $("#reportContent").attr("data", fileURL);
            }
        };
        xhr.send(vdata);
    }

    displayDynamic(entity, selectedValue) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/api/generic/report/dynamic/'+entity+"/"+selectedValue, true);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);

        xhr.onload = function(e) {
            if (this.status == 200) {
                var file = new Blob([xhr.response], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                $("#reportDynamicContent").attr("data", fileURL);
            }
        };
        xhr.send(vdata);
    }
}

class AjaxUploader {
    constructor(ajaxCallback) {
        this.ajaxCallback = ajaxCallback;
    }

    uploadFile(moduleName, recordId, uploadType, formUploadData) {
        var callback = this.ajaxCallback;
        $.ajax({
            url: "/api/generic/attachment/upload/"+uploadType+"/"+moduleName+"/"+recordId,
            type: "POST",
            data: formUploadData,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            beforeSend: function(xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + localStorage.token);
                }
            },
            success: callback,
        });
    }
}

class AjaxDeleteFile {
    constructor(ajaxCallback) {
        this.ajaxCallback = ajaxCallback;
    }

    deleteFile(fileUploadId) {
        var callback = this.ajaxCallback;
        $.ajax({
            url: "/api/generic/attachment/delete/"+fileUploadId,
            type: "GET",
            data: "",
            contentType: 'application/json',
            beforeSend: function(xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + localStorage.token);
                }
            },
            success: callback,
        });
    }
}
