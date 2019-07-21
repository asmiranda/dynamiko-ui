class ChildFieldConstructor {
    constructor(moduleName, subModuleName, mainForm) {
        this.moduleName = moduleName;
        this.subModuleName = subModuleName;
        this.mainForm = mainForm;
    }

    initFields() {
        console.log("this.initFields called == "+this.moduleName+":"+this.subModuleName+":"+this.mainForm);

        var childFieldAutoComplete = new ChildFieldAutoComplete(this.subModuleName);
        childFieldAutoComplete.init();
    }
}

class ChildFieldAutoComplete {
    constructor(subModuleName) {
        this.subModuleName = subModuleName;
    }

    init() {
        var dialogWindow = "#myModal"+this.subModuleName;
        var context = this;
        $(".autocomplete[submodule='"+this.subModuleName+"']").each(function() {
            var fieldLabelName = $(this).attr("autoName");
            var url = "/api/generic/autocomplete/"+context.subModuleName+"/"+fieldLabelName;
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
                    console.log( "Selected: " + ui.item.name + ":" + ui.item.id );
                    autoCompleteDisplayField.val(ui.item.code+" - "+ui.item.name);
                    autoCompleteValueField.val(ui.item.id);
                    return false;
                },
            });
            autoCompleteField.autocomplete("instance")._renderItem = function(ul, item) {
//                console.log(item);
                return $( "<li class='list-group-item' style='width: 500px;'><div>" + item.code + " - " + item.name + "</div></li>" ).appendTo(ul);
            };
        });
    }
}