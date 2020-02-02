class FieldConstructor {
    initFields(moduleName) {
        console.log("this.initFields called == " + moduleName);

        var fieldAutoComplete = new FieldAutoComplete(moduleName);
        fieldAutoComplete.init();

        // <!--this is for calendar-->
        $('.calendar').datepicker({
            autoclose: true,
            format: Config.getDateFormat()
        });
    }
}

class FieldMultiSelect {
    changeMultiSelectData(moduleName) {
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
    }
}

class FieldAutoComplete {
    init(moduleName) {
        console.log("AUTO COMPLETE MODULE " + moduleName);
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
