class ChildFieldConstructor {
    constructor(moduleName, subModuleName, mainForm) {
        this.moduleName = moduleName;
        this.subModuleName = subModuleName;
        this.mainForm = mainForm;
    }

    initFields() {
        console.log("this.initFields called == "+this.moduleName+":"+this.subModuleName+":"+this.mainForm);

        var childFieldAutoComplete = new ChildFieldAutoComplete(this.moduleName, this.subModuleName);
        childFieldAutoComplete.init();
    }
}

class ChildFieldAutoComplete {
    constructor(moduleName, subModuleName) {
        this.moduleName = moduleName;
        this.subModuleName = subModuleName;
    }

    init() {
        var dialogWindow = "#myModal"+this.subModuleName;
        var context = this;
        $(".autocomplete[submodule='"+this.subModuleName+"']").each(function() {
            var fieldLabelName = $(this).attr("autoName");
            var url = MAIN_URL+"/api/generic/"+localStorage.companyCode+"/subautocomplete/"+context.moduleName+"/"+context.subModuleName+"/"+fieldLabelName;
            var autoCompleteDisplayField = $(this);
            var autoCompleteValueField = $("[autoNameField='"+fieldLabelName+"'][name='"+fieldLabelName+"']");
            var autoCompleteField = $(this).autocomplete({
                appendTo : dialogWindow,
                source: function(request, response) {
                    $.ajax( {
                        url: url+"/"+request.term,
                        beforeSend: function(xhr) {
                            if (localStorage.token) {
                                xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.token);
                            }
                        },
                        success: function( data ) {
//                            console.log(data);
                            response(data);
                        }
                    } );
                },
                minLength: 1,
                select: function( event, ui ) {
                    console.log( "Selected: " + ui.item.getProp("value") + ":" + ui.item.getProp("key") );
                    autoCompleteDisplayField.val(ui.item.getProp("value"));
                    autoCompleteValueField.val(ui.item.getProp("key"));
                    return false;
                },
            });
            autoCompleteField.autocomplete("instance")._renderItem = function(ul, item) {
//                console.log(item);
                return $( "<li class='list-group-item' style='width: 500px;'><div>" + item.getProp("key") + " - " + item.getProp("value") + "</div></li>" ).appendTo(ul);
            };
        });
    }
}