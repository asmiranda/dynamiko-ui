class FieldConstructor {
    constructor(moduleName, mainForm) {
        this.moduleName = moduleName;
        this.mainForm = mainForm;
    }

    initFields() {
        console.log("this.initFields called == "+this.moduleName+":"+this.mainForm);
        var context = this;

        var config = new Config();

        var fieldAutoComplete = new FieldAutoComplete(this.moduleName);
        fieldAutoComplete.init();

        var fieldMultiSelect = new FieldMultiSelect(this.moduleName);
        fieldMultiSelect.init();

        // <!--this is for calendar-->
        $('.calendar').datepicker({
            autoclose: true,
            format: config.getDateFormat()
        });

        $(mainForm).each(function(index, obj) {
            console.log("all inputs");
            var inputs = $(this).find(':input');
            $(inputs).each(function(index, obj) {
                var name = $(obj).attr("name");
                if (name) {
                    // <!--this is for popsearch only-->
                    var popSearchName = $(obj).attr("popSearchName");
                    if (popSearchName) {
                        var initPopSearch = new InitPopSearch(context.moduleName, context.mainForm, name);
                        initPopSearch.init();
                    }
                }
            });
        });
    }
}

class FieldMultiSelect {
    constructor(moduleName) {
        this.moduleName = moduleName;
    }

    init() {
        console.log("MULTI SELECT MODULE "+this.moduleName);
        var context = this;
        $(".mainId[module='"+this.moduleName+"']").change(function() {
            var recordId = $(this).val();
            console.log("RECORD ID = "+recordId);
            $(".multiSelect[module='"+context.moduleName+"'][mainmodule='"+context.moduleName+"']").each(function() {
                var fieldLabelName = $(this).attr("name");
                console.log("MULTI SELECT FIELD "+fieldLabelName);
                var url = MAIN_URL+"/api/generic/multiselect/"+context.moduleName+"/"+fieldLabelName+"/"+recordId;
                console.log("url = "+url);
                var ajaxRequestDTO = new AjaxRequestDTO(url, "");
                var successCallback = function(data) {
                    console.log(data);
                    var fieldName = $(data)[0].field;
                    console.log("fieldName = "+fieldName);
                    var myInput = $(".multiSelect[module='"+context.moduleName+"'][mainmodule='"+context.moduleName+"'][name='"+fieldName+"']");
                    $(myInput).empty();
                    $.each(data, function(i, obj) {
                        if (i > 0) {
                            var opt = new Option(obj["label"], obj["id"]);
                            $(opt).html(obj["label"]);
                            $(myInput).append(opt);
                        }
                    });
                };
                var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
                ajaxCaller.ajaxGet();
            });
        });
        $(".multiSelectDisplayAdd[module='"+this.moduleName+"']").click(function() {
            var fieldName = $(this).attr("name");
            console.log("multiSelectDisplayAdd fieldName = "+fieldName);
            var url = MAIN_URL+"/api/generic/multiselect/options/"+context.moduleName+"/"+fieldName;
            console.log("multiSelectDisplayAdd url = "+url);
            var myInput = $(".multiSelect[module='"+context.moduleName+"'][mainmodule='"+context.moduleName+"'][name='"+fieldName+"']");
            var varr = [];
            $(".multiSelect[module='"+context.moduleName+"'][mainmodule='"+context.moduleName+"'][name='"+fieldName+"'] > option").each(function(){
                varr.push(this.value);
            });
            console.log("multiSelectDisplayAdd varr = "+varr);
            var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(varr));
            var successCallback = function(data) {
                console.log(data);
                var fieldName = $(data)[0].field;
                console.log("fieldName = "+fieldName);
                var myInput = $(".multiSelectOptionList[module='"+context.moduleName+"'][mainmodule='"+context.moduleName+"'][name='"+fieldName+"']");
                $(myInput).empty();
                $.each(data, function(i, obj) {
                    if (i > 0) {
                        var opt = new Option(obj["label"], obj["id"]);
                        $(opt).html(obj["label"]);
                        $(myInput).append(opt);
                    }
                });
            };
            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
            ajaxCaller.ajaxPost();
        });
        $(".multiSelectAdd[module='"+this.moduleName+"']").click(function() {
            var fieldName = $(this).attr("name");
            console.log("fieldName = "+fieldName);
            var myInput = $(".multiSelect[module='"+context.moduleName+"'][mainmodule='"+context.moduleName+"'][name='"+fieldName+"']");
            $(".multiSelectOptionList[module='"+context.moduleName+"'][mainmodule='"+context.moduleName+"'][name='"+fieldName+"']"+" option:selected").each(function() {
                var opt = new Option($(this).text(), $(this).val());
                $(opt).html($(this).text());
                $(myInput).append(opt);

                $(this).remove();
            });
            console.log("myInput = "+$(myInput).val());
        });
        $(".multiSelectDelete[module='"+this.moduleName+"']").click(function() {
            var fieldName = $(this).attr("name");
            console.log("fieldName = "+fieldName);
            $(".multiSelect[module='"+context.moduleName+"'][mainmodule='"+context.moduleName+"'][name='"+fieldName+"']"+" option:selected").each(function() {
                $(this).remove();
            });
        });
        $(".multiSelectTextFilter[module='"+this.moduleName+"']").keyup(function() {
            var fieldName = $(this).attr("name");
            var fieldValue = $(this).val();
            console.log("multiSelectTextFilter fieldName = "+fieldName);
            var url = MAIN_URL+"/api/generic/multiselect/options/filter/"+context.moduleName+"/"+fieldName+"/"+fieldValue;
            console.log("multiSelectTextFilter url = "+url);
            var myInput = $(".multiSelect[module='"+context.moduleName+"'][mainmodule='"+context.moduleName+"'][name='"+fieldName+"']");
            var varr = [];
            $(".multiSelect[module='"+context.moduleName+"'][mainmodule='"+context.moduleName+"'][name='"+fieldName+"'] > option").each(function(){
                varr.push(this.value);
            });
            console.log("multiSelectTextFilter varr = "+varr);
            var ajaxRequestDTO = new AjaxRequestDTO(url, JSON.stringify(varr));
            var successCallback = function(data) {
                console.log(data);
                var fieldName = $(data)[0].field;
                console.log("fieldName = "+fieldName);
                var myInput = $(".multiSelectOptionList[module='"+context.moduleName+"'][mainmodule='"+context.moduleName+"'][name='"+fieldName+"']");
                $(myInput).empty();
                $.each(data, function(i, obj) {
                    if (i > 0) {
                        var opt = new Option(obj["label"], obj["id"]);
                        $(opt).html(obj["label"]);
                        $(myInput).append(opt);
                    }
                });
            };
            var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
            ajaxCaller.ajaxPost();
        });
    }
}

class FieldAutoComplete {
    constructor(moduleName) {
        this.moduleName = moduleName;
    }

    init() {
        console.log("AUTO COMPLETE MODULE "+this.moduleName);
        var context = this;
        $(".autocomplete[module='"+this.moduleName+"'][mainmodule='"+this.moduleName+"']").each(function() {
            var fieldLabelName = $(this).attr("autoName");
            console.log("AUTO COMPLETE FIELD "+fieldLabelName);
            var url = MAIN_URL+"/api/generic/autocomplete/"+context.moduleName+"/"+fieldLabelName;
            var autoCompleteDisplayField = $(this);
            var autoCompleteValueField = $("[autoNameField='"+fieldLabelName+"'][name='"+fieldLabelName+"']");
            var autoCompleteDescDivDefault = $(".DivAutoCompleteDefault[autoName='"+fieldLabelName+"'][name='"+fieldLabelName+"']");
            var autoCompleteDescDiv = $(".DivAutoComplete[autoName='"+fieldLabelName+"'][name='"+fieldLabelName+"']");
            var autoCompleteHelpTip = $("label[autoName='"+fieldLabelName+"'][name='"+fieldLabelName+"']");
            $(autoCompleteHelpTip).click(function(e) {
                console.log("Clicked Help!!!");
                var showFieldHelp = new ShowAutoCompleteFieldHelp($(autoCompleteDisplayField).attr("helpTitle"), autoCompleteDisplayField, autoCompleteDescDivDefault, autoCompleteDescDiv);
                showFieldHelp.show();
            });
            var autoCompleteField = $(this).autocomplete({
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
                    var id = ui.item.getProp("id");
                    var code = ui.item.getProp("code");
                    var name = ui.item.getProp("name");
                    var description = ui.item.getProp("description");
                    console.log( "Selected: " + name + ":" + id + ":" + description );
                    if (code) {
                        autoCompleteDisplayField.val(code+" - "+name);
                    }
                    else {
                        autoCompleteDisplayField.val(name);
                    }
                    autoCompleteValueField.val(id);
                    autoCompleteDescDiv.html(description);
                    return false;
                },
            });
            autoCompleteField.autocomplete("instance")._renderItem = function(ul, item) {
//                console.log(item);
                if (item.getProp("code")) {
                    return $( "<li class='list-group-item' style='width: 500px;'><div>" + item.getProp("code") + " - " + item.getProp("name") + "</div></li>" ).appendTo(ul);
                }
                else {
                    return $( "<li class='list-group-item' style='width: 500px;'><div>" + item.getProp("name") + "</div></li>" ).appendTo(ul);
                }
            };
        });

    }
}

class InitPopSearch {
    constructor(moduleName, mainForm, name) {
        this.moduleName = moduleName;
        this.mainForm = mainForm;
        this.name = name;

        this.popSearchDataTable;
        this.mainPopInput;
        this.labelPopInput;
        this.popButton;
        this.popFilterButton;

        this.selectedRow;
        this.tableSelectorName;
    }

    init() {
        console.log("this.init called == "+this.moduleName+":"+this.mainForm+":"+this.name);
        // <!--get all the 3 fields for popsearch-->
        var context = this;
        this.mainPopInput = $(this.mainForm + ' input[module="'+this.moduleName+'"][name="'+this.name+'"][popSearchName="'+this.name+'"]');
        this.labelPopInput = $(this.mainForm + ' input[module="'+this.moduleName+'"][tmpName="'+this.name+'"][popSearchName="'+this.name+'"]');
        this.popButton = $(this.mainForm + ' button[module="'+this.moduleName+'"][popSearchName="'+this.name+'"]');
        this.popFilterButton = $(this.mainForm + ' button[class~="filter"][module="'+this.moduleName+'"][popSearchName="'+this.name+'"]');
        this.tableSelectorName = 'table[module="'+this.moduleName+'"][popSearchName="'+this.name+'"]';
        this.popSearchDataTable = $(this.tableSelectorName).DataTable( {
            "searching": false
        } );
        $(this.tableSelectorName + ' tbody').on( 'click', 'tr', function () {
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
            }
            else {
                context.popSearchDataTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                context.selectedRow = $(this);
                context.loadToForm();
                $('.modal').modal('hide');
            }
        } );
        $(this.popButton).click(function() {
            context.reloadSearchRecords();
        });
    };

    reloadSearchRecords() {
        console.log("innerContext.popButton called");
        var context = this;

        var input = $('input[class~="filter"][module="'+this.moduleName+'"][popSearchName="'+this.name+'"]');
        var url = MAIN_URL+'/api/generic/popsearch/' + this.moduleName + '/' + this.name + '/' + input.val();
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            context.popSearchDataTable.clear();
            var keys = Object.keys(data[0]);
            $.each(data, function(i, obj) {
                var key = obj[keys[0]];
                var record = [];
                for (i=1;i<keys.length;i++) {
                    record.push(obj[keys[i]]);
                }
                context.popSearchDataTable.row.add(record).node().id = key;
                context.popSearchDataTable.draw(false);
            });
            console.log(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    };

    loadToForm() {
        console.log("this.loadToForm called");
        console.log(this.selectedRow);

        $(this.mainPopInput).val(this.selectedRow.attr("id"));
        $(this.labelPopInput).val(this.selectedRow.find('td').eq(0).text());
    };
}
