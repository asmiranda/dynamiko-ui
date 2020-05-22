class AbstractSubUI {
    constructor(moduleName) {
        this.moduleName = moduleName;
        var context = this;
        $(document).on('click', `.selectSearchRecord[module="${moduleName}"]`, function() {
            context.loadRecordProfile(this);
        });
        $(document).on('click', `.btnSaveRecord[module="${moduleName}"]`, function() {
            context.saveRecord(this);
        });
        $(document).on('click', `.btnSaveSubRecord[parentModule="${moduleName}"]`, function() {
            context.saveSubRecord(this);
        });
        $(document).on('click', `.btnNewRecord[module="${moduleName}"]`, function() {
            context.newRecord(this);
        });

        $(document).on('keyup', `input.searchFilter[type="text"][module="${moduleName}"]`, function(evt) {
            context.searchRecordFilter(evt);
        });
        $(document).on('change', `input.searchFilter[type="checkbox"][module="${moduleName}"]`, function(evt) {
            context.searchRecordFilter(evt);
        });
        $(document).on('change', `input.calendar.searchFilter[module="${moduleName}"]`, function(evt) {
            context.searchRecordFilter(evt);
        });
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
            console.log("saveRecord", url, data);
            showModalAny.show("Save Record Message", data.value);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    saveSubRecord(obj) {
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
            // showModalAny.show("Save Sub Record Message", data.value);
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback); 
    }

    loadRecordProfile(obj) {
        utils.showSpin();
        var context = this;
        var recordId = $(obj).attr("recordId");
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/getRecordProfile/${recordId}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var successFunction = function(data) {
            console.log("loadRecordProfile", url, data);
            context.arrangeRecordProfile(data, `editRecord`);
            context.arrangeRecordProfileItems(data, `editRecord`);
            utils.hideSpin();
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successFunction);
    }

    arrangeRecordProfile(data, clsName) {
        utils.loadDataAndAutoComplete(clsName, data, 0, this.moduleName);
    }

    searchRecordFilter(obj) {
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
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadTopRecords(tabName) {
        var recordId = $(mainId).val();
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/widget/${this.moduleName}/getTopRecords`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");

        var context = this;
        var successCallback = function(data) {
            console.log("loadTopRecords", url, data);
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

    formatItems(subModule, data, clsName) {
        var items = data.getProp(subModule);
        this.createItemsHolder(subModule, items);
        this.clearModuleInputs(subModule);
        $(items).each(function(index, obj) {
            utils.loadDataAndAutoComplete(clsName, obj, index+1, subModule);
        })
    }

    clearModuleInputs(tmpModule) {
        $(`.autocomplete[module="${tmpModule}"]`).val("");
        $(`.editRecord[module="${tmpModule}"]`).val("");
    }

    createItemsHolder(subModule, subData) {
        var template = $(`.hiddenRecordTemplate[module="${subModule}"]`).html();
        this.clearItemsHolder(subModule);
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

    clearItemsHolder(subModule) {
        $(`.displayRecordTemplate[module="${subModule}"]`).empty();
    }
}