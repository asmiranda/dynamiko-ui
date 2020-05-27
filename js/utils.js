class Utils {
    collectSubRecordDataForSaving(clsName, moduleName) {
        var tmp = [];
        for (var i=1; i<=10; i++) {
            var rec = utils.collectDataForSaving(clsName, moduleName, i);
            tmp.push(rec);
        }
        return tmp;
    }

    collectDataForSaving(clsName, moduleName, rowIndex) { 
        var tmp = {};
        $(`select[module="${moduleName}"][rowIndex="${rowIndex}"]`).each(function (index, myObj) {
            var name = $(myObj).attr("name");
            var value = $(myObj).val();

            tmp[name] = value;
        });
        $(`.${clsName}[type="hidden"][module="${moduleName}"][rowIndex="${rowIndex}"]`).each(function (index, myObj) {
            var name = $(myObj).attr("name");
            var value = $(myObj).val();

            tmp[name] = value;
        });
        $(`.${clsName}[type="text"][module="${moduleName}"][rowIndex="${rowIndex}"]`).each(function (index, myObj) {
            var name = $(myObj).attr("name");
            var value = $(myObj).val();

            tmp[name] = value;
        });
        $(`.${clsName}[type="checkbox"][module="${moduleName}"][rowIndex="${rowIndex}"]`).each(function (index, myObj) {
            var name = $(myObj).attr("name");
            var value = $(myObj).val();
            if ($(myObj).is(':checked')) {
                tmp[name] = value;
            }
            else {
                tmp[name] = "";
            }
        });
        return tmp;
    }

    nowString() {
        var str = moment(new Date()).format('YYYYMMDD');
        return str;
    }

    parseFloatOrZero(value) {
        var retVal = 0;
        var val = parseFloat(value);
        if (val > 0) {
            retVal = val;
        }
        return retVal;
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }     
    replaceAll(str, term, replacement) {
      return str.replace(new RegExp(this.escapeRegExp(term), 'g'), replacement);
    }
    clearForm(form) {
        $(form).each(function(){
            var allFields = $(this).find(':input');
            $(allFields).each( function(a, b) {
                $(b).val("");
            });
        });
        $(".inputHtml").html("");
        $(".inputHtmlImage").attr("src", "");
    };
    convertFormToJSON(form) {
        var out = {};
        var myform = $(form).serializeArray();
        $.each(myform, function () {
            if (out[this.name]) {
                if (!out[this.name].push) {
                    out[this.name] = [out[this.name]];
                }
                out[this.name].push(this.value || '');
            } else {
                out[this.name] = this.value || '';
            }
        });
        return out;
    };
    setFieldValue(form, field, value) {
        var moduleName = $(form).attr("module");
        var entityName = $(form).attr("bean");
        if ($(field).hasClass("profilePic")) {
            var recordId = $(form + " [name='"+entityName+"Id']").val();
            console.log("RECORD ID = "+recordId);
            var profilePicUrl = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/profilePic/"+moduleName+"/"+recordId;
            console.log("profilePicUrl = "+profilePicUrl);
            $(field).attr("src", profilePicUrl);
        }
        else if ($(field).hasClass("textOnly")) {
            $(field).html(value);
        }
        else {
            if ($(field).hasClass("calendar")) {
                var dateValue = moment(value);
                var newDateValue = dateValue.format(config.getDateFormat().toUpperCase());
                $(field).val(newDateValue);
            }
            else if ($(field).hasClass("currency")) {
                var newValue = parseFloat(value).toFixed(2);;
                $(field).val(newValue);
            }
            else {
                $(field).val(value);
                // $(field).trigger("change");
            }
        }
    }
    loadJsonAddInfo(data) {
        this.loadJsonToForm("form.addInfo ", data);
    }

    loadRecordToForm(obj, classToUse) {
        var moduleName = $(obj).attr("module");
        var selectedId = $(obj).attr("recordId");
        if (selectedId==null || selectedId=="" || selectedId==undefined) {
            selectedId = $(obj).val();
        }
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/findRecord/${moduleName}/${selectedId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log('loadRecordToForm called', url, data);
            dynamikoCache.setLastRecordId(selectedId);

            utils.loadJsonToForm(mainForm, data);
            utils.loadJsonAddInfo(data);

            childTabs.reloadAllDisplayTabs();
            for (const [key, value] of dynaRegister.saasMap) {
                value.loadToForm(classToUse);
            }
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadJsonToForm(form, data) {
        var innerForm = form;
        var innerData = data;
        var entityName = $(form).attr("bean");
        console.log("loadJsonToForm == " + innerForm);
        this.clearForm(innerForm);

        $.each(innerData, function(k, v) {
            // set id value first
            if (k == entityName+"Id") {
                var field = $(innerForm + " [name='"+k+"']");
                if (field) {
                    console.log("loadJsonToForm ==== "+k+":"+v+":"+innerForm);
                    console.log(field);
                    utils.setFieldValue(form, field, v);
                }
            }
        });

        $.each(innerData, function(k, v) {
            var fields = $(innerForm + " [name='"+k+"'].textOnly");
            if (fields) {
                $.each(fields, function(k, field) {
                    console.log("loadJsonToForm ==== "+k+":"+v+":"+innerForm);
                    console.log(field);
                    utils.setFieldValue(form, field, v);
                });
            }

            var field = $(innerForm + " [name='"+k+"']:not(.textOnly)");
            if (field) {
                console.log("loadJsonToForm ==== "+k+":"+v+":"+innerForm);
                console.log(field);
                utils.setFieldValue(form, field, v);
                if ($(field).hasClass("PopSearch")) {
                    console.log("PopSearch ==== "+k+" == "+v);
                    utils.loadPopSearchLabel(innerForm, field, k);
                }
                else if ($(field).hasClass("HiddenAutoComplete")) {
                    console.log("AutoComplete ==== "+k+" == "+v);
                    utils.loadAutoCompleteLabel(innerForm, field, k, v);
                }
            }
        });
    }

    loadAutoCompleteLabel(form, field, name) {
        console.log("loadAutoCompleteLabel == " + form + " [autoname='"+name+"'] == ");
        var tmpLabel = $(form + " [class~='autocomplete'][autoname='"+name+"']");
        tmpLabel.val("");

        var moduleName = $(field).attr("module");
        var subModuleName = $(field).attr("submodule");
        var value = $(field).val();

        if (value!=null && value!="") {
            var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/autocompletelabel/' + moduleName + '/' + name + '/' + value;
            if (subModuleName) {
                url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/autocompletelabel/' + subModuleName + '/' + name + '/' + value;
            }
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var innerForm = form;
            var successCallback = function(data) {
                console.log('loadAutoCompleteLabel called', innerForm, url, data);
                var divDescAutoComplete = $(innerForm + " [class~='DivAutoComplete'][autoname='"+data.getProp("fieldName")+"']");
                divDescAutoComplete.html(data.getProp("value"));
                var fieldAutoComplete = $(innerForm + " [class~='autocomplete'][autoname='"+data.getProp("fieldName")+"']");
                fieldAutoComplete.val(data.getProp("value"));
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
        }
    };

    loadDataAndAutoComplete(clsName, data, dRowIndex, dModuleName) {
        // benchMark.start(`loadDataAndAutoComplete`);
        $(`.${clsName}[module="${dModuleName}"][rowIndex="${dRowIndex}"]`).each(function(index, obj) {
            var key = $(obj).attr("name");
            var inputType = $(obj).attr("type");
            if (key) {
                var value = data.getProp(key);
                // console.log(key + " -> " + value);
                if (inputType=="checkbox") {
                    if (value==null || value==undefined || value=="" || value==false) {
                        $(obj).attr("checked", false);
                        $(obj).val("");
                    }
                    else {
                        $(obj).attr("checked", true);
                        $(obj).val(value);    
                    }
                }
                else if (inputType=="html") {
                    $(obj).html(value);    
                }
                else {
                    $(obj).val(value);    
                }
            }
        });

        $(`.${clsName}.HiddenAutoComplete`).each(function(index, obj) {
            var field = $(this).attr("autoNameField");
            var rowIndex = $(this).attr("rowIndex");
            var moduleName = $(this).attr("module");
            if (field && rowIndex==dRowIndex && moduleName==dModuleName) {
                utils.loadAutoCompleteRowLabel(field, rowIndex, obj);
            }
        });
        // benchMark.log();
    }

    loadAutoCompleteRowLabel(field, rowIndex, obj) {
        var moduleName = $(obj).attr("module");
        var tmpLabel = $(`[class~='autocomplete'][module='${moduleName}'][autoname='${field}'][rowIndex='${rowIndex}']`);
        tmpLabel.val("");

        var hiddenAutoComplete = `.HiddenAutoComplete[module='${moduleName}'][name="${field}"][rowIndex='${rowIndex}']`;
        var value = $(hiddenAutoComplete).val();

        if (value!=null && value!="") {
            var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/autocompletelabel/${moduleName}/${field}/${value}`;
            var data = sStorage.get(url);
            if (data==null || data=="") {
                var ajaxRequestDTO = new AjaxRequestDTO(url, "");
                var successCallback = function(data) {
                    console.log(url, `server loadAutoCompleteRowLabel == [autoname=${field}] == [value=${value}]`, data);
                    sStorage.set(url, data);
                    utils.arrangeLoadAutoCompleteRowLabel(moduleName, rowIndex, data);
                };
                ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
            }
            else {
                console.log(`cache loadAutoCompleteRowLabel == [autoname=${field}] == [value=${value}]`);
                utils.arrangeLoadAutoCompleteRowLabel(moduleName, rowIndex, data);
            }
        }
    };

    arrangeLoadAutoCompleteRowLabel(moduleName, rowIndex, data) {
        var fieldName = data.getProp("fieldName");
        var fieldValue = data.getProp("value");
        var divDescAutoComplete = $(`.DivAutoComplete[module='${moduleName}'][autoname='${fieldName}'][rowIndex='${rowIndex}']`);
        if ($(divDescAutoComplete)) {
            $(divDescAutoComplete).html(fieldValue);
        }
        var fieldAutoComplete = $(`.autocomplete[module='${moduleName}'][autoname='${fieldName}'][rowIndex='${rowIndex}']`);
        if ($(fieldAutoComplete)) {
            $(fieldAutoComplete).val(fieldValue);
        }
    }

    loadPopSearchLabel(form, field, name) {
        var tmpLabel = $(this.form + " [class~='labelPopSearch'][tmpname='"+this.name+"']");
        tmpLabel.val("");

        var moduleName = $(this.field).attr("module");
        var value = $(this.field).val();

        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/popsearchlabel/' + moduleName + '/' + this.name + '/' + value;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var innerForm = this.form;
        var successCallback = function(data) {
            console.log('loadPopSearchLabel called', url, innerForm, data);
            var fieldPopSearchLabel = $(innerForm + " [class~='labelPopSearch'][tmpname='"+data.POPSEARCHFIELDNAME+"']");
            fieldPopSearchLabel.val(data.POPSEARCHVALLABEL);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    };

    extractArray(arr, columnName) { 
        var retArr = [];
        $(arr).each(function(i, obj) {
            retArr.push(obj[columnName]);
        });
        return retArr;
    }

    extractArrayMinMax(arr, minCol, maxCol) {
        var retArr = [];
        $(arr).each(function(i, obj) {
            retArr.push({
                min: obj[minCol],
                max: obj[maxCol]
            });
        });
        return retArr;
    }
    toggleBox(obj) {
        utils.toggleAny(obj);
    }
    toggleAny(obj) {
        var str = $(obj).attr("toggleTarget");

        var b = $(str).is(":visible");
        console.log(b);
        if (b) {
            $(str).hide();
        } else {
            $(str).show();
        }
    }
    
    convertToQueryString(json) { 
        return '?' + 
            Object.keys(json).map(function(key) { 
                return encodeURIComponent(key) + '=' + 
                    encodeURIComponent(json[key]); 
            }).join('&'); 
    } 

    showSpin() {
        $("#waitingContainer").show();
    }
    hideSpin() {
        $("#waitingContainer").hide();
    }

    loadTab(moduleName, tabUrl, divSelector) {
        var url = `displaytabs/tabs/${moduleName}/${tabUrl}.html`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            $(divSelector).html(data);
        };
        var errorCallback = function(jqXHR, textStatus, errorThrown) {
            if (errorThrown=="Not Found") {
                $(divSelector).html(url + " Not Found!");
            }
        };
        ajaxCaller.ajaxGetErr(ajaxRequestDTO, successCallback, errorCallback);
    }

    getTabHtml(moduleName, tabUrl, successCallback) {
        var url = `displaytabs/tabs/${moduleName}/${tabUrl}.html`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var errorCallback = function(jqXHR, textStatus, errorThrown) {
            if (errorThrown=="Not Found") {
                alert(url + " Not Found!");
            }
        };
        ajaxCaller.ajaxGetErr(ajaxRequestDTO, successCallback, errorCallback);
    }
}

class BenchMark {
    constructor() {
        this.label = "";
        this.startTime = new Date();
    }

    start(label) {
        this.label = label;
        this.startTime = new Date();
    }

    log() {
        var endTime = new Date();
        var totalTime = endTime.getTime() - this.startTime.getTime();
        console.log(`#################${this.label} took ${totalTime} to complete.################`);
    }
}

$(function () {
    utils = new Utils();
    benchMark = new BenchMark();
});

