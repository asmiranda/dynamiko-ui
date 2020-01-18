class ChildFieldConstructor {
    initFields(moduleName, subModuleName, mainForm) {
        console.log("this.initFields called == "+moduleName+":"+subModuleName+":"+mainForm);
        childFieldAutoComplete.init(moduleName, subModuleName);
    }
}

class ChildFieldAutoComplete {
    init(moduleName, subModuleName) {
        var dialogWindow = "#myModal"+subModuleName;
        var context = this;
        $(".autocomplete[submodule='"+subModuleName+"']").each(function() {
            var fieldLabelName = $(this).attr("autoName");
            var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/subautocomplete/"+moduleName+"/"+subModuleName+"/"+fieldLabelName;
            var autoCompleteDisplayField = $(this);
            var autoCompleteValueField = $(".HiddenAutoComplete[submodule='" + subModuleName + "'][name='" + fieldLabelName + "']");
            var autoCompleteDescDivDefault = $(".DivAutoCompleteDefault[autoName='" + fieldLabelName + "'][name='" + fieldLabelName + "']");
            var autoCompleteDescDiv = $(".DivAutoComplete[autoName='" + fieldLabelName + "'][name='" + fieldLabelName + "']");
        });
    }
}

$(function () {
    childFieldConstructor = new ChildFieldConstructor();
    childFieldAutoComplete = new ChildFieldAutoComplete();
});
