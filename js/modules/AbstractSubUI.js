class AbstractSubUI {
    constructor(moduleName) {
        this.moduleName = moduleName;
        this.selectSearchRecord = "selectSearchRecord";

        var context = this;
        this.initSearchFilterListener(context);
        this.initSearchSubRecordFilterListener(context);
        this.initSubRecordListener(context);

        $(document).on('click', `.selectSearchRecord[module="${context.moduleName}"]`, function() {
            context.loadRecordProfile(this);
        });
        $(document).on('click', `.btnNewRecord[module="${context.moduleName}"]`, function() {
            context.newRecord(this);
        });
        $(document).on('click', `.btnSaveRecord[module="${context.moduleName}"]`, function() {
            context.saveRecord(this);
        });
    }

    initSubRecordListener(context) {
        $(document).on('click', `.btnSaveSubRecord[parentModule="${context.moduleName}"]`, function() {
            context.saveSubRecord(this);
        });
        $(document).on('click', `.btnDeleteSubRecord[parentModule="${context.moduleName}"]`, function() {
            context.deleteSubRecord(this);
        });
        $(document).on('change', `.autoSaveSubRecord[parentModule="${context.moduleName}"]`, function(evt) {
            context.saveSubRecord(this);
        });
        $(document).on(`autoCompleteSaveSubRecord[parentModule="${context.moduleName}"]`, function(evt) { 
            context.saveSubRecord(evt.detail[0]);
        });
    }

    initSearchFilterListener(context) {
        $(document).on('keyup', `input.searchFilter[type="text"][module="${context.moduleName}"]`, function(evt) {
            context.searchRecordFilter(this);
        });
        $(document).on('change', `input.searchFilter[type="checkbox"][module="${context.moduleName}"]`, function(evt) {
            context.searchRecordFilter(this);
        });
        $(document).on('change', `input.calendar.searchFilter[module="${context.moduleName}"]`, function(evt) {
            context.searchRecordFilter(this);
        });
    }

    initSearchSubRecordFilterListener(context) {
        $(document).on('keyup', `input.subRecordSearchFilter[type="text"][module="${context.moduleName}"]`, function(evt) {
            context.searchSubRecordFilter(this);
        });
        $(document).on('change', `input.subRecordSearchFilter[type="checkbox"][module="${context.moduleName}"]`, function(evt) {
            context.searchSubRecordFilter(this);
        });
        $(document).on('change', `input.calendar.subRecordSearchFilter[module="${context.moduleName}"]`, function(evt) {
            context.searchSubRecordFilter(this);
        });
    }

    beforeSave(data) {
        return data;
    }

    arrangeRecordProfileAllSubRecords(data, clsName) {
    }
    arrangeRecordProfileSubRecords(data, clsName, subModule) {
    }
    
    newRecord() {  
    }

    saveRecord(obj) {  
        utils.showSpin();
        console.log("saveRecord called");
        var tmp = utils.collectDataForSaving(`editRecord`, `${this.moduleName}`, "0");
        tmp = this.beforeSave(tmp);

        console.log(tmp);
        var vdata = JSON.stringify(tmp); 
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/post/saveRecord`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log("saveRecord", url, data);
            showModalAny.show("Save Record Message", data.value);
            utils.hideSpin();
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    deleteSubRecord(obj) {
        utils.showSpin();
        console.log("deleteSubRecord called");
        var rowIndex = $(obj).attr("rowIndex");
        var subModule = $(obj).attr("module");

        var tmpParent = utils.collectDataForSaving(`editRecord`, `${this.moduleName}`, "0");
        var tmpChild = utils.collectDataForSaving(`editRecord`, `${subModule}`, rowIndex);
        tmpParent["Child"] = tmpChild;

        var vdata = JSON.stringify(tmpParent); 
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/post/deleteSubRecord`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log("deleteSubRecord", tmpParent, url, data);
            $(`.subRecord[module="${subModule}"][rowIndex="${rowIndex}"]`).empty();
            utils.hideSpin();
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    saveSubRecord(obj) {
        utils.showSpin();
        console.log("saveSubRecord called");
        var rowIndex = $(obj).attr("rowIndex");
        var subModule = $(obj).attr("module");

        var tmpParent = utils.collectDataForSaving(`editRecord`, `${this.moduleName}`, "0");
        var tmpChild = utils.collectDataForSaving(`editRecord`, `${subModule}`, rowIndex);
        tmpParent["Child"] = tmpChild;

        var vdata = JSON.stringify(tmpParent); 
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/post/saveSubRecord`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log("saveSubRecord", tmpParent, url, data);
            utils.hideSpin();
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    loadRecordProfile(obj) {
        autoSaveSubRecord = false;
        utils.showSpin();
        var context = this;
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/getRecordProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log("loadRecordProfile", url, data);
            context.arrangeRecordProfile(data, `editRecord`);
            context.arrangeRecordProfileAllSubRecords(data, `editRecord`);
            utils.hideSpin();
            autoSaveSubRecord = true;
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeRecordProfile(data, clsName) {
        utils.loadDataAndAutoComplete(clsName, data, 0, this.moduleName);
    }

    searchRecordFilter(obj) {
        utils.showSpin();
        var tabName = $(obj).attr("tabName");

        var tmp = utils.collectDataForSaving(`searchFilter`, `${this.moduleName}`, "0");
        var param = utils.convertToQueryString(tmp); 

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/filterRecord${param}`;
        console.log("searchRecordFilter", url);
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var context = this;
        var successCallback = function(data) {
            console.log("searchRecordFilter", url, data);
            context.arrangeSearchedRecords(data, tabName);
            utils.hideSpin();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    searchSubRecordFilter(obj) {
        autoSaveSubRecord = false;
        utils.showSpin();
        var subModule = $(obj).attr("subModule");
        var tmp = utils.collectDataForSaving(`subRecordSearchFilter`, `${this.moduleName}`, "0");
        var param = utils.convertToQueryString(tmp); 

        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/filterSubRecord/${subModule}${param}`;
        console.log("searchSubRecordFilter", url);
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var context = this;
        var successCallback = function(data) {
            console.log("searchSubRecordFilter", url, data);
            context.arrangeRecordProfileSubRecords(data, `editRecord`, subModule);
            utils.hideSpin();
            autoSaveSubRecord = true;
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTopRecords(tabName) {
        utils.showSpin();
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/getTopRecords`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var context = this;
        var successCallback = function(data) {
            console.log("loadTopRecords", url, data);
            context.arrangeSearchedRecords(data, tabName);
            utils.hideSpin();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    arrangeSearchedRecords(data, tabName) {
        var context = this;
        var divSelector = `.searchRecords[module="${this.moduleName}"][tabName="${tabName}"]`;
        $(divSelector).empty();
        $(data).each(function(index, obj) {
            var str = context.formatSearchList(index, obj, tabName);
            $(divSelector).append(str);
        });        
    }

    formatSearchList(index, obj, tabName) {
        return "Please override format";
    }

    formatSubRecords(subModule, subRecordData, clsName) {
        this.createSubRecordsHolder(subModule, subRecordData);
        this.clearModuleInputs(subModule);
        $(subRecordData).each(function(index, obj) {
            utils.loadDataAndAutoComplete(clsName, obj, index+1, subModule);
        })
    }

    formatSubRecordsFromMain(subModule, data, clsName) {
        var subRecordData = data.getProp(subModule);
        this.formatSubRecords(subModule, subRecordData, clsName);
    }

    clearModuleInputs(tmpModule) {
        $(`.autocomplete[module="${tmpModule}"]`).val("");
        $(`.editRecord[module="${tmpModule}"]`).val("");
    }

    createSubRecordsHolder(subModule, subData) {
        var template = $(`.hiddenRecordTemplate[module="${subModule}"]`).html();
        this.clearSubRecordsHolder(subModule);
        var subLength = 0;
        if (subData==null)  {
        }
        else {
            subLength = subData.length;
        }
        for (var offset=1; offset<=subLength+5; offset++) {
            var recHtml = utils.replaceAll(template, "----", offset)
            $(`.displayRecordTemplate[module="${subModule}"]`).append(recHtml);
        }
    }

    clearSubRecordsHolder(subModule) {
        $(`.displayRecordTemplate[module="${subModule}"]`).empty();
    }
}

$(function () {
    autoSaveSubRecord = false;
});
