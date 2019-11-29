class ReplaceStr {
    constructor() {

    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
     
    /* Define functin to find and replace specified term with replacement string */
    replaceAll(str, term, replacement) {
      return str.replace(new RegExp(this.escapeRegExp(term), 'g'), replacement);
    }
     
    /* Testing our replaceAll() function  */
    // var myStr = 'if the facts do not fit the theory, change the facts.';
    // var newStr = replaceAll(myStr, 'facts', 'statistics')
}

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
        this.moduleName = $(form).attr("module");
        this.entityName = $(form).attr("bean");
    }

    setFieldValue(field, value) {
        if ($(field).hasClass("profilePic")) {
            var recordId = $(this.form + " [name='"+this.entityName+"Id']").val();
            console.log("RECORD ID = "+recordId);
            var profilePicUrl = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/profilePic/"+this.moduleName+"/"+recordId;
            console.log("profilePicUrl = "+profilePicUrl);
            $(field).attr("src", profilePicUrl);
        }
        else if ($(field).hasClass("textOnly")) {
            $(field).html(value);
        }
        else {
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
    }

    load () {
        var context = this;
        var innerForm = this.form;
        var innerData = this.data;
        console.log("LoadJsonToForm == " + innerForm);
        var clearForm = new ClearForm(innerForm);
        clearForm.clear();

        $.each(innerData, function(k, v) {
            // set id value first
            if (k == this.entityName+"Id") {
                var field = $(innerForm + " [name='"+k+"']");
                if (field) {
                    console.log("LoadJsonToForm ==== "+k+":"+v+":"+innerForm);
                    console.log(field);
                    context.setFieldValue(field, v);
                }
            }
        });

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
            var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/autocompletelabel/' + moduleName + '/' + this.name + '/' + value;
            if (subModuleName) {
                url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/autocompletelabel/' + subModuleName + '/' + this.name + '/' + value;
            }
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var innerForm = this.form;
            var successCallback = function(data) {
                console.log(data);
                console.log("Callback called "+innerForm);
                var fieldAutoComplete = $(innerForm + " [class~='autocomplete'][autoname='"+data.getProp("fieldName")+"']");
                fieldAutoComplete.val(data.getProp("value"));
                var divDescAutoComplete = $(innerForm + " [class~='DivAutoComplete'][autoname='"+data.getProp("fieldName")+"']");
                divDescAutoComplete.html(data.getProp("value"));
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

        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/popsearchlabel/' + moduleName + '/' + this.name + '/' + value;
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