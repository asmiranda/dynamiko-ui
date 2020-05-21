class AbstractSubUI {
    constructor(moduleName) {
        this.moduleName = moduleName;
    }

    beforeSave(data) {
        return data;
    }

    arrangeRecordProfileItems(data, clsName) {
    }

    newRecord() {  
    }

    saveRecord(obj) {  
        console.log("saveRecord called");
        var tmp = utils.collectDataForSaving(`editRecord`, `${this.moduleName}`, "0");
        tmp = this.beforeSave(tmp);

        console.log(tmp);
        var vdata = JSON.stringify(tmp); 
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/post/saveRecord`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log("saveRecord", url);
            console.log(data);
            showModalAny.show("Save Record Message", data.value);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    loadRecordProfile(obj) {
        var context = this;
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/getRecordProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log("loadRecordProfile", url);
            console.log(data);
            context.arrangeRecordProfile(data, `editRecord`);
            context.arrangeRecordProfileItems(data, `editRecord`);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeRecordProfile(data, clsName) {
        utils.loadDataAndAutoComplete(clsName, data, 0, this.moduleName);
    }

    searchRecordFilter(obj) {
        var value = $(obj).val();
        var tabName = $(obj).attr("tabName");
        console.log(value);

        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/getFilteredRecords/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var context = this;
        var successCallback = function(data) {
            console.log("searchRecordFilter", url);
            context.arrangeSearchedRecords(data, tabName);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTopRecords(tabName) {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/getTopRecords`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var context = this;
        var successCallback = function(data) {
            console.log("loadTopRecords", url);
            console.log(data);
            context.arrangeSearchedRecords(data, tabName);
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
}