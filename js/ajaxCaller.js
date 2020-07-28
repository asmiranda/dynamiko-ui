class AjaxCaller {
    ajaxGetErr(dto, callback, errorCallback) {
        $.ajax({
            type: 'GET',
            url: dto.url,
            data: dto.data,
            contentType: 'application/json',
            beforeSend: function (xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + localStorage.token);
                }
            },
            error: errorCallback,
            success: callback
        });
    }
    ajaxGet(dto, callback) {
        $.ajax({
            type: 'GET',
            url: dto.url,
            data: dto.data,
            contentType: 'application/json',
            beforeSend: function (xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + localStorage.token);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                if ("Access Denied" == jqXHR.responseJSON.message) {
                    window.location.href = "login.html";
                }
                else {
                    if (jqXHR.responseJSON) {
                        showModuleHelp.show("Information", jqXHR.responseJSON.message);
                    }
                    else {
                        showModuleHelp.show("Information", jqXHR.responseText);
                    }
                }
            },
            success: callback
        });
    }
    ajaxPost(dto, callback) {
        $.ajax({
            type: 'POST',
            url: dto.url,
            data: dto.data,
            contentType: 'application/json',
            beforeSend: function (xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + localStorage.token);
                }
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log('jqXHR:');
                console.log(jqXHR);
                console.log('textStatus:');
                console.log(textStatus);
                // console.log('responseJSON:');
                // console.log(jqXHR.responseJSON.message);
                if (jqXHR.responseJSON) {
                    showModuleHelp.show("Information", jqXHR.responseJSON.message);
                }
                else {
                    showModuleHelp.show("Information", jqXHR.responseText);
                }
            },
            success: callback
        });
    }
    uploadCSV(callback, formUploadData) {
        var vurl = MAIN_URL + '/api/utils/uploadData/' + localStorage.companyCode + '/' + localStorage.chosenReport;

        console.log(vurl);
        $.ajax({
            url: vurl,
            type: "POST",
            data: formUploadData,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            beforeSend: function (xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + localStorage.token);
                }
            },
            success: callback,
        });
    }
    getAllFiles(callback, moduleName, recordId) {
        $.ajax({
            type: 'GET',
            url: `${MAIN_URL}/api/generic/${localStorage.companyCode}/attachment/${moduleName}/${recordId}`,
            data: "",
            contentType: 'application/json',
            beforeSend: function (xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + localStorage.token);
                }
            },
            success: callback
        });
    }
    displayReport(reportName, vdata) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `${MAIN_URL}/api/generic/${localStorage.companyCode}/report/${reportName}`, true);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);

        xhr.onload = function (e) {
            if (this.status == 200) {
                var file = new Blob([xhr.response], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                $("#reportContent").attr("data", fileURL);
            }
        };
        xhr.send(vdata);
    }
    displayDynamicReport(entity, selectedValue) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `${MAIN_URL}/api/generic/${localStorage.companyCode}/report/dynamic/${entity}/${selectedValue}`, true);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);

        xhr.onload = function (e) {
            if (this.status == 200) {
                var file = new Blob([xhr.response], { type: 'application/pdf' });
                var fileURL = URL.createObjectURL(file);
                $("#reportDynamicContent").attr("data", fileURL);
            }
        };
        xhr.send(vdata);
    }
    uploadFile(callback, moduleName, recordId, uploadType, formUploadData) {
        var callback = this.ajaxCallback;
        var vurl = `${MAIN_URL}/api/generic/${localStorage.companyCode}/attachment/upload/${uploadType}/${moduleName}/${recordId}`;
        console.log(vurl);
        $.ajax({
            url: vurl,
            type: "POST",
            data: formUploadData,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            beforeSend: function (xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + localStorage.token);
                }
            },
            success: callback,
        });
    }
    deleteFile(callback, fileUploadId) {
        $.ajax({
            url: MAIN_URL + "/api/generic/attachment/delete/" + fileUploadId,
            type: "GET",
            data: "",
            contentType: 'application/json',
            beforeSend: function (xhr) {
                if (localStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + localStorage.token);
                }
            },
            success: callback,
        });
    }
    loadGetBytes(callback, url) {
        var xhr = new XMLHttpRequest();

        xhr.open('GET', url);
        xhr.onload = function () {
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
    loadPostBytes(callback, url, vdata) {
        var xhr = new XMLHttpRequest();

        xhr.open('POST', url);
        xhr.onload = function () {
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

$(function () {
    ajaxCaller = new AjaxCaller();
});
