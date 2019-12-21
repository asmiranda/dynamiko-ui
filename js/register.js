class DynaRegister {
    constructor() {
        this.dataTableMap = new Map();
        this.dropZoneMap = new Map();
        this.saasMap = new Map();
    }

    clearDataTable() {
        this.dataTableMap.clear();
    }
    getDataTable(moduleName) {
        var obj = this.dataTableMap.get(moduleName);
        return obj;
    }
    getDropZone(moduleName) {
        var obj = this.dropZoneMap.get(moduleName);
        return obj;
    }
    createChildTable(moduleName, tableSelector) {
        var readWrite = $(tableSelector).attr("readWrite");
        var childTableColFields = $(tableSelector).attr("columns");
        var childFieldId = $(tableSelector).attr("childFieldId");
        var linkableColumns = $(tableSelector).attr("linkableColumns");
        if (linkableColumns) {
            linkableColumns = linkableColumns.toUpperCase();
        }

        var childTable = null;
        if (readWrite=='true') {
            childTable = $(tableSelector).DataTable( {
                "searching": false,
                "bLengthChange": false,
    
                "autoWidth": true,
                "fixedHeader": {
                    "header": false,
                    "footer": false
                },
                "columnDefs": [
                    {
                        "width": "70px",
                        "targets": 0,
                        'orderable': false,
                    },
                ],
            } );
        }
        else {
            childTable = $(tableSelector).DataTable( {
                "searching": false,
                "bLengthChange": false,
    
                "autoWidth": true,
                "fixedHeader": {
                    "header": false,
                    "footer": false
                },
                "columnDefs": [
                    {
                        'orderable': false,
                    },
                ],
            } );
        }

        childTable.childTableColFields = childTableColFields;
        childTable.childFieldId = childFieldId;
        childTable.readWrite = readWrite;
        childTable.linkableColumns = linkableColumns;
        childTable.selectedId = null;

        this.dataTableMap.set(moduleName, childTable);
        return childTable;
    }
    createMainTable(moduleName, tableSelector, myForm) {
        var mainDataTable = $(tableSelector).DataTable( {
            searching:      false,
            scrollX:        true,
            scrollCollapse: true,
        } );
        mainDataTable.selectedId = null;
  
        $(tableSelector + ' tbody').on('click', 'tr', function () {
            if ( $(this).hasClass('selected') ) {
                $(this).removeClass('selected');
            }
            else {
                mainDataTable.$('tr.selected').removeClass('selected');
                $(this).addClass('selected');
                console.log($(this).attr("id"));
                mainDataTable.selectedId = $(this).attr("id");
                myForm.loadToForm();
            }
        } );
        this.dataTableMap.set(moduleName, mainDataTable);
        return mainDataTable;
    }
    createDropZone(moduleName, selector, myForm, mainDataTable) {
        Dropzone.autoDiscover = false;
        var dropZone = new Dropzone(selector, { 
            url: `${MAIN_URL}/api/generic/${localStorage.companyCode}/attachment/upload/any/${moduleName}/${mainDataTable.selectedId}`,
            maxFiles: 1, 
            clickable: true, 
            maxFilesize: 1, //MB
            headers:{"Authorization":'Bearer ' + localStorage.token},   
            init: function() {
                    this.on("addedfile", function(file) {
                        // alert("Added file.");
                    }),
                    this.on("success", function(file, response) {
                        this.removeAllFiles();
                        myForm.displayAllFiles();
                    })
            }                   
        });
        this.dropZoneMap.set(moduleName, dropZone);
        return dropZone;
    }
    clearTable(moduleName) {
        var tbl = this.getDataTable(moduleName);
        tbl.clear().draw(false);
    }
    registerSaas(saas, obj) {
        this.saasMap.set(saas, obj);
    }
}

$(function () {
    dynaRegister = new DynaRegister();
});
