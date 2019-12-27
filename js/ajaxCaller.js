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
                // console.log('responseJSON:');
                // console.log(jqXHR.responseJSON.message);
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
                // console.log('responseJSON:');
                // console.log(jqXHR.responseJSON.message);
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
            url: MAIN_URL+"/api/generic/attachment/"+moduleName+"/"+recordId,
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
            url: MAIN_URL+"/api/generic/attachment/download/"+recordId,
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
        xhr.open('GET', MAIN_URL+'/api/generic/report/'+reportName, true);
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
        xhr.open('GET', MAIN_URL+'/api/generic/report/dynamic/'+entity+"/"+selectedValue, true);
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
        var vurl = MAIN_URL+"/api/generic/attachment/upload/"+uploadType+"/"+moduleName+"/"+recordId;
        console.log(vurl);
        $.ajax({
            url: vurl,
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
            url: MAIN_URL+"/api/generic/attachment/delete/"+fileUploadId,
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

class AjaxBytesLoader {
    constructor() {

    }

    loadGet(url, callback) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.onload = function() {
            if (this.readyState === this.DONE) {
                if (this.status === 200) {
                    // this.response is a Blob, because we set responseType above
                    var data_url = URL.createObjectURL(this.response);
                    callback(data_url);
                } else {
                    console.error('no pdf :(');
                }
            }
        };
        xhr.responseType = 'blob';
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
        xhr.send();
    }

    loadPost(url, callback, vdata) {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', url);
        xhr.onload = function() {
            if (this.readyState === this.DONE) {
                if (this.status === 200) {
                    // this.response is a Blob, because we set responseType above
                    var data_url = URL.createObjectURL(this.response);
                    callback(data_url);
                } else {
                    console.error('no pdf :(');
                }
            }
        };
        xhr.responseType = 'blob';
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(vdata);
    }
}

class AjaxCSVUploader {
    constructor(ajaxCallback) {
        this.ajaxCallback = ajaxCallback;
    }

    uploadFile(formUploadData) {
        var callback = this.ajaxCallback;
        var vurl = MAIN_URL+'/api/utils/uploadData/'+localStorage.companyCode+'/'+localStorage.chosenReport;

        console.log(vurl);
        $.ajax({
            url: vurl,
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
