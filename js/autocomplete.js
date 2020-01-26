class DynaAutoComplete {
    putAutoComplete(obj) {
        var value = $(obj).attr("value");
        var html = $(obj).html();
        var moduleName = $(obj).attr("module");
        // var submodule = $(obj).attr("submodule");
        var fieldName = $(obj).attr("autoName");
        $(`input.autocomplete[module="${moduleName}"][autoName="${fieldName}"]`).val(html);
        $(`input.HiddenAutoComplete[module="${moduleName}"][autoName="${fieldName}"][name="${fieldName}"]`).val(value);
        $(`div.DivAutoComplete[module="${moduleName}"][autoName="${fieldName}"][name="${fieldName}"]`).html(html);        
        $(`div.autocomplete-items[autoName='${fieldName}'][module='${moduleName}']`).empty();
    }

    doAutoComplete(obj) {
        var value = $(obj).val();
        var moduleName = $(obj).attr("module");
        var fieldName = $(obj).attr("autoName");
        var isAutoCompleteQuickUpdaterInput = $(obj).hasClass("autoCompleteQuickUpdaterInput");

        console.log("Autocomplete typed "+value);
        var url = `${MAIN_URL}/api/generic/${sessionStorage.companyCode}/autocomplete/${moduleName}/${fieldName}/${value}`;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log(data);
            if (isAutoCompleteQuickUpdaterInput) {
                $(`.autoCompleteQuickUpdaterSelect`).empty();
                $.each(data, function(index, obj) {
                    var key = obj.getProp("key");
                    var value = obj.getProp("value");
                    var strHtml = `<option value="${key}">${value}</option>`;
                    $(`.autoCompleteQuickUpdaterSelect`).append(strHtml);
                });
            }
            else {
                $(`div.autocomplete-items[autoName='${fieldName}'][module='${moduleName}']`).empty();
                $.each(data, function(index, obj) {
                    var key = obj.getProp("key");
                    var value = obj.getProp("value");
                    var strHtml = `<div value="${key}" class="autocomplete-choice" autoName="${fieldName}" module="${moduleName}">${value}</div>`;
                    $(`div.autocomplete-items[autoName='${fieldName}'][module='${moduleName}']`).append(strHtml);
                });
            }
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }
}
