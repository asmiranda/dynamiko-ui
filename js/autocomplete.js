class DynaAutoComplete {
    putAutoComplete(obj) {
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
    }

    doAutoComplete(obj) {
        var value = $(obj).val();
        var moduleName = $(obj).attr("module");
        var fieldName = $(obj).attr("autoName");
        var rowIndex = $(obj).attr("rowIndex");
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
                $(`.autocomplete-items[autoName='${fieldName}'][module='${moduleName}']`).empty();
                $.each(data, function(index, obj) {
                    var key = obj.getProp("key");
                    var value = obj.getProp("value");
                    var strHtml = `<div value="${key}" class="autocomplete-choice" autoName="${fieldName}" module="${moduleName}" rowIndex="${rowIndex}">${value}</div>`;
                    $(`.autocomplete-items[autoName='${fieldName}'][module='${moduleName}'][rowIndex='${rowIndex}']`).append(strHtml);
                });
            }
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }
}
