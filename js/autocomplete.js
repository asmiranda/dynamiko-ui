class DynaAutoComplete {
    constructor() {
        $(document).on('keyup', '.autocomplete', function () {
            dynaAutoComplete.doAutoComplete(this);
        });
        $(document).on('click', '.autocomplete', function () {
            dynaAutoComplete.doAutoComplete(this);
        });
        $(document).on('click', '.autocomplete-choice', function () {
            dynaAutoComplete.putAutoComplete(this);
        });
        $(document).on('click', '.btnCloseAutoComplete', function () {
            dynaAutoComplete.closeAutoComplete(this);
        });
        $(document).on('click', '.btnAutoClearSelected', function () {
            dynaAutoComplete.clearSelected(this);
        });
    }

    putAutoComplete(obj) {
        console.log("putAutoComplete Called");
        var value = $(obj).attr("value");
        var rowIndex = $(obj).attr("rowIndex");
        var html = $(obj).html();
        var moduleName = $(obj).attr("module");
        // var submodule = $(obj).attr("submodule");
        var fieldName = $(obj).attr("autoName");
        $(`.autocomplete[module="${moduleName}"][autoName="${fieldName}"][rowIndex='${rowIndex}']`).val(html);
        $(`.DivAutoComplete[module="${moduleName}"][autoName="${fieldName}"][name="${fieldName}"][rowIndex='${rowIndex}']`).html(html);
        $(`.autocomplete-items[autoName='${fieldName}'][module='${moduleName}'][rowIndex='${rowIndex}']`).empty();

        $(`.HiddenAutoComplete[module="${moduleName}"][autoName="${fieldName}"][name="${fieldName}"][rowIndex='${rowIndex}']`).val(value);
        $(`.HiddenAutoComplete[module="${moduleName}"][autoNameField="${fieldName}"][name="${fieldName}"][rowIndex='${rowIndex}']`).val(value);
        $(`.HiddenAutoComplete[module="${moduleName}"][autoName="${fieldName}"][rowIndex='${rowIndex}']`).val(value);
        $(`.HiddenAutoComplete[module="${moduleName}"][autoNameField="${fieldName}"][rowIndex='${rowIndex}']`).val(value);

        document.dispatchEvent(new CustomEvent(`changeAutoComplete[${fieldName}][${moduleName}]`, { bubbles: true, detail: { text: () => value } }))
        document.dispatchEvent(new CustomEvent(`changeAutoComplete[${fieldName}][${moduleName}][${rowIndex}]`, { bubbles: true, detail: { text: () => value } }))

        var subRecordAutoCompleteObj = $(`.HiddenAutoComplete[module="${moduleName}"][autoNameField="${fieldName}"][name="${fieldName}"][rowIndex='${rowIndex}']`);
        if ($(subRecordAutoCompleteObj).hasClass("autoSaveSubRecord")) {
            var parentModule = $(subRecordAutoCompleteObj).attr("parentModule");
            document.dispatchEvent(new CustomEvent(`autoCompleteSaveSubRecord[parentModule="${parentModule}"]`, { detail: subRecordAutoCompleteObj }))
        }
    }

    doAutoComplete(obj) {
        var value = $(obj).val();
        var moduleName = $(obj).attr("module");
        var fieldName = $(obj).attr("autoName");
        var rowIndex = $(obj).attr("rowIndex");
        $(`.autocomplete-items[autoName='${fieldName}'][module='${moduleName}'][rowIndex='${rowIndex}']`).show();
        var isAutoCompleteQuickUpdaterInput = $(obj).hasClass("autoCompleteQuickUpdaterInput");

        console.log("Autocomplete typed " + value);
        var url = `${MAIN_URL}/api/generic/${storage.getCompanyCode()}/autocomplete/${moduleName}/${fieldName}/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function (data) {
            console.log(data);
            if (isAutoCompleteQuickUpdaterInput) {
                $(`.autoCompleteQuickUpdaterSelect`).empty();
                $.each(data, function (index, obj) {
                    var key = obj.getProp("key");
                    var value = obj.getProp("value");
                    var strHtml = `<option value="${key}">${value}</option>`;
                    $(`.autoCompleteQuickUpdaterSelect`).append(strHtml);
                });
            }
            else {
                $(`.autocomplete-items[autoName='${fieldName}'][module='${moduleName}'][rowIndex='${rowIndex}']`).empty();
                $.each(data, function (index, obj) {
                    var key = obj.getProp("key");
                    var value = obj.getProp("value");

                    if (index == 0) {
                        var strHtmlClose = `<div title="Close" style="float: right;" class="btnCloseAutoComplete" autoName="${fieldName}" module="${moduleName}" rowIndex="${rowIndex}"><i style="position:fixed;margin-top: -5px;margin-left: -5px;" class="fa fa-close"></i></div>`;
                        $(`.autocomplete-items[autoName='${fieldName}'][module='${moduleName}'][rowIndex='${rowIndex}']`).append(strHtmlClose);
                    }
                    var strHtml = `<div value="${key}" class="autocomplete-choice" autoName="${fieldName}" module="${moduleName}" rowIndex="${rowIndex}">${value}</div>`;
                    $(`.autocomplete-items[autoName='${fieldName}'][module='${moduleName}'][rowIndex='${rowIndex}']`).append(strHtml);
                });
            }
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    closeAutoComplete(obj) {
        var moduleName = $(obj).attr("module");
        var fieldName = $(obj).attr("autoName");
        var rowIndex = $(obj).attr("rowIndex");
        $(`.autocomplete-items[autoName='${fieldName}'][module='${moduleName}'][rowIndex='${rowIndex}']`).hide();
    }

    clearSelected(obj) {
        var moduleName = $(obj).attr("module");
        var fieldName = $(obj).attr("autoName");
        var rowIndex = $(obj).attr("rowIndex");
        $(`.HiddenAutoComplete[name='${fieldName}'][module='${moduleName}'][rowIndex='${rowIndex}']`).val("");
        $(`.autocomplete[name='${fieldName}'][module='${moduleName}'][rowIndex='${rowIndex}']`).val("");
    }
}

$(function () {
    dynaAutoComplete = new DynaAutoComplete();
})