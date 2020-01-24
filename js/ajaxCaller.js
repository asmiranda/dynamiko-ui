class AjaxCaller {
    ajaxGet(dto, callback) {
        $.ajax({
            type: 'GET',
            url: dto.url,
            data: dto.data,
            contentType: 'application/json',
            beforeSend: function(xhr) {
                if (sessionStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + sessionStorage.token);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('jqXHR:');
                console.log(jqXHR);
                console.log('textStatus:');
                console.log(textStatus);
                if (jqXHR.responseJSON.message=="Access Denied") {
                    window.location.href = "login.html";
                }
                else {
                    showModuleHelp.show("Information", jqXHR.responseJSON.message);
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
            beforeSend: function(xhr) {
                if (sessionStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + sessionStorage.token);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log('jqXHR:');
                console.log(jqXHR);
                console.log('textStatus:');
                console.log(textStatus);
                // console.log('responseJSON:');
                // console.log(jqXHR.responseJSON.message);
                showModuleHelp.show("Information", jqXHR.responseJSON.message);
            },
            success: callback
        });
    }
    uploadCSV(callback, formUploadData) {
        var vurl = MAIN_URL+'/api/utils/uploadData/'+sessionStorage.companyCode+'/'+sessionStorage.chosenReport;

        console.log(vurl);
        $.ajax({
            url: vurl,
            type: "POST",
            data: formUploadData,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            beforeSend: function(xhr) {
                if (sessionStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + sessionStorage.token);
                }
            },
            success: callback,
        });
    }
    getAllFiles(callback, moduleName, recordId) {
        $.ajax({
            type: 'GET',
            url: `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/attachment/${moduleName}/${recordId}`,
            data: "",
            contentType: 'application/json',
            beforeSend: function(xhr) {
                if (sessionStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + sessionStorage.token);
                }
            },
            success: callback
        });
    }
    displayReport(reportName, vdata) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/report/${reportName}`, true);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.token);

        xhr.onload = function(e) {
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
        xhr.open('GET', `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/report/dynamic/${entity}/${selectedValue}`, true);
        xhr.responseType = 'arraybuffer';
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.token);

        xhr.onload = function(e) {
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
        var vurl = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/attachment/upload/${uploadType}/${moduleName}/${recordId}`;
        console.log(vurl);
        $.ajax({
            url: vurl,
            type: "POST",
            data: formUploadData,
            processData: false,
            contentType: false,
            enctype: 'multipart/form-data',
            beforeSend: function(xhr) {
                if (sessionStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + sessionStorage.token);
                }
            },
            success: callback,
        });
    } 
    deleteFile(callback, fileUploadId) {
        $.ajax({
            url: MAIN_URL+"/api/generic/attachment/delete/"+fileUploadId,
            type: "GET",
            data: "",
            contentType: 'application/json',
            beforeSend: function(xhr) {
                if (sessionStorage.token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.token);
                    console.log("Sending token headers " + 'Authorization', 'Bearer ' + sessionStorage.token);
                }
            },
            success: callback,
        });
    }
    loadGetBytes(callback, url) {
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
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.token);
        xhr.send();
    }
    loadPostBytes(callback, url, vdata) {
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
        xhr.setRequestHeader('Authorization', 'Bearer ' + sessionStorage.token);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(vdata);
    }
}

$(function () {
    ajaxCaller = new AjaxCaller();
});
