class Utils {
    constructor() {
        var context = this;
        $(document).on('click', '.toggle-box', function() {
            context.toggleBox(this);
        });
    }
    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }     
    replaceAll(str, term, replacement) {
      return str.replace(new RegExp(this.escapeRegExp(term), 'g'), replacement);
    }
    clearForm(form) {
        $(form).each(function(){
            var allFields = $(this).find(':input');
            $(allFields).each( function(a, b) {
                $(b).val("");
            });
        });
        $(".inputHtml").html("");
        $(".inputHtmlImage").attr("src", "");
    };
    convertFormToJSON(form) {
        var out = {};
        var myform = $(form).serializeArray();
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
    setFieldValue(form, field, value) {
        var moduleName = $(form).attr("module");
        var entityName = $(form).attr("bean");
        if ($(field).hasClass("profilePic")) {
            var recordId = $(form + " [name='"+entityName+"Id']").val();
            console.log("RECORD ID = "+recordId);
            var profilePicUrl = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/profilePic/"+moduleName+"/"+recordId;
            console.log("profilePicUrl = "+profilePicUrl);
            $(field).attr("src", profilePicUrl);
        }
        else if ($(field).hasClass("textOnly")) {
            $(field).html(value);
        }
        else {
            if ($(field).hasClass("calendar")) {
                var dateValue = moment(value);
                var newDateValue = dateValue.format(config.getDateFormat().toUpperCase());
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
    loadJsonAddInfo(data) {
        this.load("form.addInfo ", data);
    }
    loadJsonToForm(form, data) {
        var context = this;
        var innerForm = form;
        var innerData = data;
        var entityName = $(form).attr("bean");
        console.log("loadJsonToForm == " + innerForm);
        this.clearForm(innerForm);

        $.each(innerData, function(k, v) {
            // set id value first
            if (k == entityName+"Id") {
                var field = $(innerForm + " [name='"+k+"']");
                if (field) {
                    console.log("loadJsonToForm ==== "+k+":"+v+":"+innerForm);
                    console.log(field);
                    context.setFieldValue(form, field, v);
                }
            }
        });

        $.each(innerData, function(k, v) {
            var fields = $(innerForm + " [name='"+k+"'].textOnly");
            if (fields) {
                $.each(fields, function(k, field) {
                    console.log("loadJsonToForm ==== "+k+":"+v+":"+innerForm);
                    console.log(field);
                    context.setFieldValue(form, field, v);
                });
            }

            var field = $(innerForm + " [name='"+k+"']:not(.textOnly)");
            if (field) {
                console.log("loadJsonToForm ==== "+k+":"+v+":"+innerForm);
                console.log(field);
                context.setFieldValue(form, field, v);
                if ($(field).hasClass("PopSearch")) {
                    console.log("PopSearch ==== "+k+" == "+v);
                    context.loadPopSearchLabel(innerForm, field, k);
                }
                else if ($(field).hasClass("HiddenAutoComplete")) {
                    console.log("AutoComplete ==== "+k+" == "+v);
                    context.loadAutoCompleteLabel(innerForm, field, k, v);
                }
            }
        });
    }

    loadAutoCompleteLabel(form, field, name) {
        console.log("loadAutoCompleteLabel == " + form + " [autoname='"+name+"'] == ");
        var tmpLabel = $(form + " [class~='autocomplete'][autoname='"+name+"']");
        tmpLabel.val("");

        var moduleName = $(field).attr("module");
        var subModuleName = $(field).attr("submodule");
        var value = $(field).val();

        if (value!=null && value!="") {
            var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/autocompletelabel/' + moduleName + '/' + name + '/' + value;
            if (subModuleName) {
                url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/autocompletelabel/' + subModuleName + '/' + name + '/' + value;
            }
            var ajaxRequestDTO = new AjaxRequestDTO(url, "");
            var innerForm = form;
            var successCallback = function(data) {
                console.log(data);
                console.log("Callback called "+innerForm);
                var divDescAutoComplete = $(innerForm + " [class~='DivAutoComplete'][autoname='"+data.getProp("fieldName")+"']");
                divDescAutoComplete.html(data.getProp("value"));
                var fieldAutoComplete = $(innerForm + " [class~='autocomplete'][autoname='"+data.getProp("fieldName")+"']");
                fieldAutoComplete.val(data.getProp("value"));
            };
            ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
        }
    };

    loadPopSearchLabel(form, field, name) {
        console.log("loadPopSearchLabel == " + this.form + " [tmpname='"+this.name+"'] == ");
        var tmpLabel = $(this.form + " [class~='labelPopSearch'][tmpname='"+this.name+"']");
        tmpLabel.val("");

        var moduleName = $(this.field).attr("module");
        var value = $(this.field).val();

        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/popsearchlabel/' + moduleName + '/' + this.name + '/' + value;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var innerForm = this.form;
        var successCallback = function(data) {
            console.log(data);
            console.log("Callback called "+innerForm);
            var fieldPopSearchLabel = $(innerForm + " [class~='labelPopSearch'][tmpname='"+data.POPSEARCHFIELDNAME+"']");
            fieldPopSearchLabel.val(data.POPSEARCHVALLABEL);
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    };

    extractArray(arr, columnName) {
        var retArr = [];
        $(arr).each(function(i, obj) {
            retArr.push(obj[columnName]);
        });
        return retArr;
    }

    extractArrayMinMax(arr, minCol, maxCol) {
        var retArr = [];
        $(arr).each(function(i, obj) {
            retArr.push({
                min: obj[minCol],
                max: obj[maxCol]
            });
        });
        return retArr;
    }
    toggleBox(obj) {
        var str = $(obj).attr("target");

        var b = $(str).is(":visible");
        console.log(b);
        if (b) {
            $(str).hide();
        } else {
            $(str).show();
        }
    }
}

$(function () {
    utils = new Utils();
});
