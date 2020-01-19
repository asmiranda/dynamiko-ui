class FieldConstructor {
    initFields(moduleName, mainForm) {
        console.log("this.initFields called == " + moduleName + ":" + mainForm);
        var context = this;

        var fieldAutoComplete = new FieldAutoComplete(moduleName);
        fieldAutoComplete.init();

        fieldMultiSelect.init(moduleName);

        // <!--this is for calendar-->
        $('.calendar').datepicker({
            autoclose: true,
            format: config.getDateFormat()
        });

        $(mainForm).each(function (index, obj) {
            console.log("all inputs");
            var inputs = $(this).find(':input');
            $(inputs).each(function (index, obj) {
                var name = $(obj).attr("name");
                if (name) {
                    // <!--this is for popsearch only-->
                    var popSearchName = $(obj).attr("popSearchName");
                    if (popSearchName) {
                        initPopSearch.init(moduleName, mainForm, name);
                    }
                }
            });
        });
    }
}

class FieldMultiSelect {
    changeMultiSelectData(moduleName, mainId) {
        var recordId = $(mainId).val();
        console.log("RECORD ID = " + recordId);
        $(".multiSelect[module='" + moduleName + "'][mainmodule='" + moduleName + "']").each(function () {
            var fieldLabelName = $(this).attr("name");
            console.log("MULTI SELECT FIELD " + fieldLabelName);
            var url = MAIN_URL + "/api/generic/"+sessionStorage.companyCode+"/multiselect/" + moduleName + "/" + fieldLabelName + "/" + recordId;
            console.log("url = " + url);
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var successCallback = function (data) {
                console.log(data);
                var fieldName = $(data)[0].field;
                console.log("fieldName = " + fieldName);
                var myInput = $(".multiSelect[module='" + moduleName + "'][mainmodule='" + moduleName + "'][name='" + fieldName + "']");
                $(myInput).empty();
                $.each(data, function (i, obj) {
                    if (i > 0) {
                        var label = obj.getProp("label");
                        var id = obj.getProp("id");
                        var opt = new Option(label, id);
                        $(opt).html(label);
                        $(myInput).append(opt);
                    }
                });
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
        });
    }

    clickDisplayAdd(moduleName, btn) {
        var context = this;
        var fieldName = $(btn).attr("name");
        console.log("multiSelectDisplayAdd fieldName = " + fieldName);
        var url = MAIN_URL + "/api/generic/"+sessionStorage.companyCode+"/multiselect/options/" + moduleName + "/" + fieldName;
        console.log("multiSelectDisplayAdd url = " + url);
        var myInput = $(".multiSelect[module='" + moduleName + "'][mainmodule='" + moduleName + "'][name='" + fieldName + "']");
        var varr = [];
        $(".multiSelect[module='" + moduleName + "'][mainmodule='" + moduleName + "'][name='" + fieldName + "'] > option").each(function () {
            varr.push(this.value);
        });
        console.log("multiSelectDisplayAdd varr = " + varr);
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(varr));
        var successCallback = function (data) {
            console.log(data);
            var fieldName = $(data)[0].field;
            console.log("fieldName = " + fieldName);
            var myInput = $(".multiSelectOptionList[module='" + moduleName + "'][mainmodule='" + moduleName + "'][name='" + fieldName + "']");
            $(myInput).empty();
            $.each(data, function (i, obj) {
                if (i > 0) {
                    var label = obj.getProp("label");
                    var id = obj.getProp("id");
                    var opt = new Option(label, id);
                    $(opt).html(label);
                    $(myInput).append(opt);
                }
            });
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback);
    }

    addSelected(moduleName, btn) {
        var fieldName = $(btn).attr("name");
        console.log("fieldName = " + fieldName);
        var myInput = $(".multiSelect[module='" + moduleName + "'][mainmodule='" + moduleName + "'][name='" + fieldName + "']");
        $(".multiSelectOptionList[module='" + moduleName + "'][mainmodule='" + moduleName + "'][name='" + fieldName + "']" + " option:selected").each(function () {
            var opt = new Option($(this).text(), $(this).val());
            $(opt).html($(this).text());
            $(myInput).append(opt);

            $(this).remove();
        });
        console.log("myInput = " + $(myInput).val());
    }

    deleteSelected(moduleName, btn) {
        var fieldName = $(btn).attr("name");
        console.log("fieldName = " + fieldName);
        $(".multiSelect[module='" + moduleName + "'][mainmodule='" + moduleName + "'][name='" + fieldName + "']" + " option:selected").each(function () {
            $(this).remove();
        });
    }

    filterChoices(moduleName, btn) {
        var fieldName = $(btn).attr("name");
        var fieldValue = $(btn).val();
        console.log("multiSelectTextFilter fieldName = " + fieldName);
        var url = MAIN_URL + "/api/generic/"+sessionStorage.companyCode+"/multiselect/options/filter/" + moduleName + "/" + fieldName + "/" + fieldValue;
        console.log("multiSelectTextFilter url = " + url);
        var myInput = $(".multiSelect[module='" + moduleName + "'][mainmodule='" + moduleName + "'][name='" + fieldName + "']");
        var varr = [];
        $(".multiSelect[module='" + moduleName + "'][mainmodule='" + moduleName + "'][name='" + fieldName + "'] > option").each(function () {
            varr.push(this.value);
        });
        console.log("multiSelectTextFilter varr = " + varr);
        var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(varr));
        var successCallback = function (data) {
            console.log(data);
            var fieldName = $(data)[0].field;
            console.log("fieldName = " + fieldName);
            var myInput = $(".multiSelectOptionList[module='" + moduleName + "'][mainmodule='" + moduleName + "'][name='" + fieldName + "']");
            $(myInput).empty();
            $.each(data, function (i, obj) {
                if (i > 0) {
                    var label = obj.getProp("label");
                    var id = obj.getProp("id");
                    var opt = new Option(label, id);
                    $(opt).html(label);
                    $(myInput).append(opt);
                }
            });
        };
        ajaxCaller.ajaxPost(ajaxRequestDTO, successCallback);
    }

    init(moduleName) {
        console.log("MULTI SELECT MODULE " + moduleName);
        var context = this;
        $(".mainId").change(function () {
            context.changeMultiSelectData(this);
        });
        $(".multiSelectDisplayAdd[module='" + moduleName + "']").click(function () {
            context.clickDisplayAdd(this);
        });
        $(".multiSelectAdd[module='" + moduleName + "']").click(function () {
            context.addSelected(this);
        });
        $(".multiSelectDelete[module='" + moduleName + "']").click(function () {
            context.deleteSelected(this);
        });
        $(".multiSelectTextFilter[module='" + moduleName + "']").keyup(function () {
            context.filterChoices(this);
        });
    }
}

class FieldAutoComplete {
    init(moduleName) {
        console.log("AUTO COMPLETE MODULE " + moduleName);
        var context = this;
        $(".autocomplete[module='" + moduleName + "'][mainmodule='" + moduleName + "']").each(function () {
            var fieldLabelName = $(this).attr("autoName");
            console.log("AUTO COMPLETE FIELD " + fieldLabelName);
            var url = MAIN_URL + "/api/generic/"+sessionStorage.companyCode+"/autocomplete/" + moduleName + "/" + fieldLabelName;
            var autoCompleteDisplayField = $(this);
            var autoCompleteValueField = $("[autoNameField='" + fieldLabelName + "'][name='" + fieldLabelName + "']");
            var autoCompleteDescDivDefault = $(".DivAutoCompleteDefault[autoName='" + fieldLabelName + "'][name='" + fieldLabelName + "']");
            var autoCompleteDescDiv = $(".DivAutoComplete[autoName='" + fieldLabelName + "'][name='" + fieldLabelName + "']");
            var autoCompleteHelpTip = $("label[autoName='" + fieldLabelName + "'][name='" + fieldLabelName + "']");
            $(autoCompleteHelpTip).click(function (e) {
                console.log("Clicked Help!!!");
                showAutoCompleteFieldHelp.show($(autoCompleteDisplayField).attr("helpTitle"), autoCompleteDisplayField, autoCompleteDescDivDefault, autoCompleteDescDiv);
            });
        });

    }
}

class InitPopSearch {
    constructor() {
        this.popSearchDataTable;
        this.mainPopInput;
        this.labelPopInput;
        this.popButton;
        this.popFilterButton;

        this.selectedRow;
        this.tableSelectorName;
    }

    init(moduleName, mainForm, name) {
        console.log("this.init called == " + moduleName + ":" + mainForm + ":" + name);
        // <!--get all the 3 fields for popsearch-->
        var context = this;
        this.mainPopInput = $(mainForm + ' input[module="' + moduleName + '"][name="' + name + '"][popSearchName="' + name + '"]');
        this.labelPopInput = $(mainForm + ' input[module="' + moduleName + '"][tmpName="' + name + '"][popSearchName="' + name + '"]');
        this.popButton = $(mainForm + ' button[module="' + moduleName + '"][popSearchName="' + name + '"]');
        this.popFilterButton = $(mainForm + ' button[class~="filter"][module="' + moduleName + '"][popSearchName="' + name + '"]');
        this.tableSelectorName = 'table[module="' + moduleName + '"][popSearchName="' + name + '"]';
        this.popSearchDataTable = $(this.tableSelectorName).DataTable({
            "searching": false
        });
        $(this.tableSelectorName + ' tbody').on('click', 'tr', function () {
            if ($(this).hasClass('selected')) {
                $(this).removeClass('selected');
            }
            else {
                context.popSearchDataTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                context.selectedRow = $(this);
                context.loadToForm();
                $('.modal').modal('hide');
            }
        });
        $(this.popButton).click(function () {
            context.reloadSearchRecords();
        });
    };

    reloadSearchRecords() {
        console.log("innerContext.popButton called");
        var context = this;

        var input = $('input[class~="filter"][module="' + this.moduleName + '"][popSearchName="' + this.name + '"]');
        var url = MAIN_URL + '/api/generic/'+sessionStorage.companyCode+'/popsearch/' + this.moduleName + '/' + this.name + '/' + input.val();
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function (data) {
            context.popSearchDataTable.clear();
            var keys = Object.keys(data[0]);
            $.each(data, function (i, obj) {
                var key = obj[keys[0]];
                var record = [];
                for (i = 1; i < keys.length; i++) {
                    record.push(obj[keys[i]]);
                }
                context.popSearchDataTable.row.add(record).node().id = key;
                context.popSearchDataTable.draw(false);
            });
            console.log(data);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    };

    loadToForm() {
        console.log("this.loadToForm called");
        console.log(this.selectedRow);

        $(this.mainPopInput).val(this.selectedRow.attr("id"));
        $(this.labelPopInput).val(this.selectedRow.find('td').eq(0).text());
    };
}

$(function () {
    fieldConstructor = new FieldConstructor();
    fieldMultiSelect = new FieldMultiSelect();
    initPopSearch = new InitPopSearch();
});
