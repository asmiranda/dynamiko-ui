class UIService {
    constructor() {
    }
    
    initHome() {
        Object.defineProperty(Object.prototype, "getProp", {
            value: function (prop) {
                var key,self = this;
                for (key in self) {
                    if (key.toLowerCase() == prop.toLowerCase()) {
                        return self[key];
                    }
                }
            },
            //this keeps jquery happy
            enumerable: false
        });

        Object.defineProperty(Object.prototype, "setProp", {
            value: function (prop, val) {
                var key,self = this;
                var found = false;
                if (Object.keys(self).length > 0) {
                    for (key in self) {
                        if (key.toLowerCase() == prop.toLowerCase()) {
                            //set existing property
                            found = true;
                            self[key] = val;
                            break;
                        }
                    }
                }

                if (!found) {
                    //if the property was not found, create it
                    self[prop] = val;
                }

                return val;
            },
            //this keeps jquery happy
            enumerable: false
        });

        this.initLogo();

        var leftMenu = new LeftMenu();
        leftMenu.init();
    }
    
    initLogo() {
        var url = MAIN_URL + '/api/ui/logo';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("logo ==");
            console.log(data);
            $(".logo").html(data);
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }
}

class LeftMenu {
    constructor() {
    }

    init() {
        var context = this;
        console.log("LEFT MENU CALLED WITH DASHBOARD...");

        var url = MAIN_URL+'/api/generic/getLeftMenu';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Left Menu Extracted");
//            console.log(data);
            context.addDashboard(data);
            
            var menus = ["School", "Admin", "HR", "Accounting", "Procurement", "Production", "Supply Chain", "Marketing", "CRM", "Reference"];
            $.each(menus, function(i, obj) {
                context.addMenu(obj, data);
            });
            context.initialize();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    };

    addMenu(menu, data) {
        var counter = 0;
        $.each(data, function(i, obj) {
            if (obj.getProp("group")==menu) {
                if (counter == 0) {
                    $(".sidebar-menu").append('' +
                    '                <li class="treeview">\n' +
                    '                   <a href="#">\n' +
                    '                       <i class="fa fa-pie-chart"></i>\n' +
                    '                       <span>'+menu+'</span>\n' +
                    '                       <span class="pull-right-container">\n' +
                    '                           <i class="fa fa-angle-left pull-right"></i>\n' +
                    '                       </span>\n' +
                    '                   </a>\n' +
                    '                   <ul class="treeview-menu" id="'+menu+'Menu">\n' +
                    '                   </ul>\n' +
                    '                 </li>\n' +
                    '');
                }
                counter++;
                $("#"+menu+"Menu").append('<li><a href="#" class="leftMenuItem" data="'+obj.getProp("name")+'" report="false"><i class="'+obj.getProp("icon")+'"></i> <span>'+obj.getProp("label")+'</span></a></li>');
            }
        });
    }

    addDashboard(data) {
        $.each(data, function(i, obj) {
            if (obj.getProp("dashboard")) {
                $(".sidebar-menu").append('<li><a href="#" class="leftDashboardItem" data="'+obj.getProp("name")+'"><i class="'+obj.getProp("icon")+'"></i> <span>'+obj.getProp("label")+'</span></a></li>');
            }
        });
    }

    initialize() {
        $(".leftDashboardItem").click(function() {
            console.log("leftDashboardItem CALLED...");
            var moduleName = $(this).attr("data");
            console.log("moduleName == "+moduleName);
            var dashboard = new Dashboard();
            dashboard.load(moduleName);
        });
        $(".leftMenuItem[report='true']").click(function() {
            var moduleName = $(this).attr("data");
            var constructReport = new MainReport(moduleName);
            constructReport.construct();
        });
        $(".leftMenuItem[report='false']").click(function() {
            var registerDatatable = new RegisterDatatable();
            registerDatatable.clearRegister();

            var moduleName = $(this).attr("data");
            var constructForm = new MainForm(moduleName, '#searchTable[module="'+moduleName+'"]', '#mainForm[module="'+moduleName+'"]');
            constructForm.construct();

            var fileUpload = new FileUpload();
            fileUpload.initUpload();
        });
    }
}

class FileUpload {
    initUpload() {
        console.log("File Upload initUpload Called");
        setTimeout(
            function() {
                $('#fileUpload').change(function(){
                    console.log("File Upload Change Called");
                    //on change event
                    var formData = new FormData();
                    if($(this).prop('files').length > 0) {
                        var file = $(this).prop('files')[0];
                        console.log("Received File");
                        console.log(file);
                        formData.append("music", file);
                    }
                });
            }, 500
        );

    }
}

class ToggleForm {
    constructor() {
    }

    readOnly() {
        console.log("ToggleForm readOnly");
        setTimeout(
            function() {
                $('.displayEdit').each(function(index, obj){
                    console.log(index);
//                    $(obj).addClass("displayMode");
                    if ($(obj).is("span")) {
                        $(obj).css("display", "none")
                    }
                    else if ($(obj).is("textarea")) {
                        $(obj).css("border", "none")
                        $(obj).css("overflow", "hidden")
                    }
                    else {
                        $(obj).css("border", "none")
                    }
                });
            }, 50
        );
    }
}

var allTable = [];

class RegisterDatatable {
    constructor(datatable) {
        console.log("constructor");
        this.datatable = datatable;
    }

    register() {
        console.log("register");
        if (this.datatable) {
            console.log("register datatable");
            allTable.push(this.datatable);
            console.log("length : "+allTable.length);
        }
    }

    clearRegister() {
        console.log("clearRegister");
        $.each(allTable, function(index, obj) {
            console.log(index);
            console.log(obj);
            try {
                $(obj).destroy();
            }
            catch(err) {
                console.log(err);
            }
        });
        allTable = [];
    }
}
