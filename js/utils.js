class ClearForm {
    constructor(form) {
        this.form = form;
    }

    clear() {
        $(this.form).each(function(){
            var allFields = $(this).find(':input');
            $(allFields).each( function(a, b) {
                $(b).val("");
            });
        });
    };
}

class ConvertFormToJSON {
    constructor(form) {
        this.form = form;
    }

    convert() {
        var out = {};
        var myform = $(this.form).serializeArray();
        $.each(myform, function () {
            if (out[this.name]) {
                if (!out[this.name].push) {
                    out[this.name] = [out[this.name]];
                }
                out[this.name].push(this.value || '');
            } else {
                out[this.name] = this.value || '';
            }
        });
        return out;
    };
}

class LoadJsonToForm {
    constructor(form, data) {
        this.form = form;
        this.data = data;
        this.config = new Config();
    }

    setFieldValue(field, value) {
        if ($(field).hasClass("calendar")) {
            var dateValue = moment(value);
            var newDateValue = dateValue.format(this.config.getDateFormat().toUpperCase());
            $(field).val(newDateValue);
        }
        else if ($(field).hasClass("currency")) {
            var newValue = parseFloat(value).toFixed(2);;
            $(field).val(newValue);
        }
        else {
            $(field).val(value);
            $(field).trigger("change");
        }
    }

    load () {
        var context = this;
        var innerForm = this.form;
        var innerData = this.data;
        console.log("LoadJsonToForm == " + innerForm);
        $.each(innerData, function(k, v) {
            var field = $(innerForm + " [name='"+k+"']");
            if (field) {
                console.log("LoadJsonToForm ==== "+k+":"+v+":"+innerForm);
                console.log(field);
                context.setFieldValue(field, v);
                if ($(field).hasClass("PopSearch")) {
                    console.log("PopSearch ==== "+k+" == "+v);
                    var loadPopSearchLabel = new LoadPopSearchLabel(innerForm, field, k, v);
                    loadPopSearchLabel.setData();
                }
                else if ($(field).hasClass("HiddenAutoComplete")) {
                    console.log("AutoComplete ==== "+k+" == "+v);
                    var loadAutoCompleteLabel = new LoadAutoCompleteLabel(innerForm, field, k, v);
                    loadAutoCompleteLabel.setData();
                }
            }
        });
    };
}

class LoadAutoCompleteLabel {
    constructor(form, field, name, value) {
        this.context = this;
        this.form = form;
        this.field = field;
        this.name = name;
        this.value = value;
        this.resultData = "";
    }

    setData() {
        console.log("LoadAutoCompleteLabel == " + this.form + " [autoname='"+this.name+"'] == " + this.value);
        var tmpLabel = $(this.form + " [class~='autocomplete'][autoname='"+this.name+"']");
        tmpLabel.val("");

        var moduleName = $(this.field).attr("module");
        var subModuleName = $(this.field).attr("submodule");
        var value = $(this.field).val();

        if (value!=null && value!="") {
            var url = MAIN_URL+'/api/generic/autocompletelabel/' + moduleName + '/' + this.name + '/' + value;
            if (subModuleName) {
                url = MAIN_URL+'/api/generic/autocompletelabel/' + subModuleName + '/' + this.name + '/' + value;
            }
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var innerForm = this.form;
            var successCallback = function(data) {
                console.log(data);
                console.log("Callback called "+innerForm);
                var fieldAutoComplete = $(innerForm + " [class~='autocomplete'][autoname='"+data.AUTOCOMPLETEFIELDNAME+"']");
                fieldAutoComplete.val(data.AUTOCOMPLETELABEL);
                var divDescAutoComplete = $(innerForm + " [class~='DivAutoComplete'][autoname='"+data.AUTOCOMPLETEFIELDNAME+"']");
                divDescAutoComplete.html(data.AUTOCOMPLETEDESC);
            };
            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
            ajaxCaller.ajaxGet();
        }
    };
};

class LoadPopSearchLabel {
    constructor(form, field, name, value) {
        this.context = this;
        this.form = form;
        this.field = field;
        this.name = name;
        this.value = value;
        this.resultData = "";
    }

    setData() {
        console.log("LoadPopSearchLabel == " + this.form + " [tmpname='"+this.name+"'] == " + this.value);
        var tmpLabel = $(this.form + " [class~='labelPopSearch'][tmpname='"+this.name+"']");
        tmpLabel.val("");

        var moduleName = $(this.field).attr("module");
        var value = $(this.field).val();

        var url = '/api/generic/popsearchlabel/' + moduleName + '/' + this.name + '/' + value;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var innerForm = this.form;
        var successCallback = function(data) {
            console.log(data);
            console.log("Callback called "+innerForm);
            var fieldPopSearchLabel = $(innerForm + " [class~='labelPopSearch'][tmpname='"+data.POPSEARCHFIELDNAME+"']");
            fieldPopSearchLabel.val(data.POPSEARCHVALLABEL);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    };
};

class ExtractColumnArray {
    constructor() {
    }

    extract(arr, columnName) {
        var retArr = [];
        $(arr).each(function(i, obj) {
            retArr.push(obj[columnName]);
        });
        return retArr;
    }

    extractMinMax(arr, minCol, maxCol) {
        var retArr = [];
        $(arr).each(function(i, obj) {
            retArr.push({
                min: obj[minCol],
                max: obj[maxCol]
            });
        });
        return retArr;
    }
}