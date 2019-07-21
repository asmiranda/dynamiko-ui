class ChildTabs {
    constructor(moduleName, mainForm) {
        this.moduleName = moduleName;
        this.mainForm = mainForm;
        this.childTabs = [];
    }

    initTabs() {
        var context = this;
        $.each($('table[submodule]'), function(i, obj) {
            console.log("initTabs");
            console.log(i);
            console.log($(obj).attr("submodule"));
            var childTab = new ChildTab(context.moduleName, context.mainForm, $(obj).attr("submodule"));
            childTab.constructTab();

            context.childTabs.push(childTab);
        });
    };

    reloadAllChildRecords() {
        var context = this;
        console.log("reloadAllChildRecords");
        console.log(this.childTabs);
        $.each(context.childTabs, function(i, childTab) {
            console.log(i);
            console.log(childTab);
            childTab.reloadChildRecords();
        });
    };
};

class ChildTab {
    constructor(moduleName, mainForm, subModuleName) {
        this.moduleName = moduleName;
        this.mainForm = mainForm;
        this.subModuleName = subModuleName;
        this.childTable;
        this.childFieldId;
        this.childTableColFields;
        this.tableSelector;

        this.selectedId;

        this.formSelector = 'form[module="'+this.moduleName+'"][submodule="'+this.subModuleName+'"]';
        this.modalId = $('button[class~="btnChildTabEdit"][module="'+this.moduleName+'"][submodule="'+this.subModuleName+'"]').attr("data-target");
        console.log("Modal ID === "+this.modalId);

        this.fieldConstructor = new ChildFieldConstructor(this.moduleName, this.subModuleName, this.formSelector);
    }

    constructTab() {
        var context = this;
        this.tableSelector = 'table[class~="childRecord"][submodule="'+this.subModuleName+'"]';
        this.childFieldId = $(this.tableSelector).attr("childFieldId");
        this.childTableColFields = $(this.tableSelector).attr("columns");
        console.log("init child table :: "+this.tableSelector);

        this.childTable = $(this.tableSelector).DataTable( {
            "searching": false,
            "bLengthChange": false,

            "autoWidth": false,
            "fixedHeader": {
                "header": false,
                "footer": false
            },
            "columnDefs": [
                {
                    "width": "70px",
                    "targets": 0,
                    'orderable': false,
                },
            ],
        } );
        this.reloadChildRecords();
        this.fieldConstructor.initFields();
    };

    reloadChildRecords() {
        var context = this;
        var convertFormToJSON = new ConvertFormToJSON($(this.mainForm));
        var url = '/api/generic/subrecord/' + this.moduleName + '/' + this.subModuleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(convertFormToJSON.convert()));
        var successCallback = function(data) {
            console.log(context.subModuleName + " Sub Record Reloaded");
            context.selectedId = null;
            context.childTable.clear().draw(false);
            console.log(data);
            if (data[0]) {
                console.log(context.childTableColFields);
                var keys = context.childTableColFields.split(",");
                console.log(keys);
                $.each(data, function(i, obj) {
                    <!--console.log(i);-->
                    var key = obj[context.childFieldId];
                    var record = [];
                    var modalId = "#myModal"+context.subModuleName;
                    var buttonEdit = '<button recordId="'+key+'" module="'+context.subModuleName+'" submodule="'+context.subModuleName+'" data-target="'+modalId+'" data-toggle="modal" type="button" class="btn btn-info btnChildTabEdit" title="Edit Selected Record"><i class="fa fa-pencil"></i></button>';
                    var buttonDelete = '<button recordId="'+key+'" module="'+context.subModuleName+'" submodule="'+context.subModuleName+'" type="button" class="btn btn-danger btnChildTabDelete" style="margin-left: 5px;" title="Delete Selected Record"><i class="fa fa-trash"></i></button>';
                    var buttons = '<div class="btn-group">'+buttonEdit+buttonDelete+'</div>'
                    record.push(buttons);
                    for (i=0;i<keys.length;i++) {
                        record.push(obj.getProp(keys[i]));
                    }
//                    console.log(record);
                    context.childTable.row.add(record).node().id = key;
                    context.childTable.draw(false);
                });
            }
            context.initButtons();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    };

    initButtons() {
        var context = this;
        $('button[class~="btnChildTabEdit"]').click(function(e) {
            var recId = $(this).attr("recordId");
            context.selectedId = recId;
            console.log("SELECTED ID == "+context.selectedId);
            if (context.selectedId) {
                context.loadToForm();
                context.editChildRecord(this);
            }
            else {
                e.stopPropagation();
                var noSelectedRecordEdit = new NoSelectedRecordEdit();
                noSelectedRecordEdit.alert();
            }
        });
        $('button[class~="btnChildTabNew"]').click(function() {
            context.newChildRecord(this);
        });
        $('button[class~="btnChildTabDelete"]').click(function() {
            var recId = $(this).attr("recordId");
            var myButton = this;
            context.selectedId = recId;
            console.log("SELECTED ID == "+context.selectedId);
            if (context.selectedId) {
                var confirmFunc = function() {
                    console.log("Confirm selected");
                    context.loadToForm();
                    context.deleteChildRecord(myButton);
                };
                var deleteRecordConfirm = new DeleteRecordConfirm(confirmFunc);
                deleteRecordConfirm.confirm();
            }
            else {
                var noSelectedRecordEdit = new NoSelectedRecordEdit();
                noSelectedRecordEdit.alert();
            }
        });
        $('button[class~="btnChildTabSave"]').click(function() {
            context.saveChildRecord(this);
        });
        $('button[class~="btnChildTabCancel"]').click(function() {
            context.cancelChildRecord();
        });
    };

    editChildRecord(myButton) {
        console.log("Child Tab New Button Called");
        console.log("Modal ID === "+this.modalId);
    };

    newChildRecord(myButton) {
        console.log("Child Tab New Button Called");
        console.log("Modal ID === "+this.modalId);
        this.selectedId = null;
        this.removeTableSelectedRecord();
        var clearForm = new ClearForm(this.formSelector);
        clearForm.clear();
    };

    deleteChildRecord(myButton) {
        var context = this;
        console.log("Child Tab Delete Button Called");

        var convertParent = new ConvertFormToJSON($(this.mainForm));
        var parentRecord = convertParent.convert();

        var subRecordId = $(myButton).attr("recordId");

        var url = '/api/generic/deletesubrecord/' + this.moduleName + '/' + this.subModuleName + '/' + subRecordId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(parentRecord));
        var successCallback = function(data) {
            console.log("Delete success called : "+data);
            context.reloadChildRecords();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    };

    saveChildRecord(myButton) {
        var context = this;
        console.log("Child Tab Save Button Called");

        var convertParent = new ConvertFormToJSON($(this.mainForm));
        var parentRecord = convertParent.convert();

        var convertRecord = new ConvertFormToJSON($(this.formSelector));
        var subRecord = convertRecord.convert();

        var tmp = [];
        tmp.push(parentRecord);
        tmp.push(subRecord);

        var url = '/api/generic/savesubrecord/' + this.moduleName + '/' + this.subModuleName;
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(tmp));
        var successCallback = function(data) {
            var loadJsonToForm = new LoadJsonToForm(context.formSelector, data);
            loadJsonToForm.load();
            context.reloadChildRecords();
            $(context.modalId).modal('hide');
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
    };

    cancelChildRecord() {
        console.log("Child Tab Cancel Button Called");
    };

    loadToForm() {
        var context = this;
        console.log(this.subModuleName + " loadToForm");
        console.log("selectedId == " + this.selectedId);
        console.log("context.formSelector == " + this.formSelector);

        var url = '/api/generic/findRecord/' + this.subModuleName + '/' + this.selectedId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Record Found");
            console.log(data);
            var loadJsonToForm = new LoadJsonToForm(context.formSelector, data);
            loadJsonToForm.load();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    };

    removeTableSelectedRecord() {
        this.selectedId = null;
        var allRecords =  $(this.tableSelector + ' tbody tr');
        $.each(allRecords, function(i, tblRow) {
            $(tblRow).removeClass("selected");
        });
    };
}

