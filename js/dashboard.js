class Dashboard {
    constructor() {
    }

    load(moduleName) {
        console.log("load "+moduleName);
        $.get( "/module/"+moduleName, function( result ) {
            console.log(result);
            $("#content-main").html(result);
        });
    }
}