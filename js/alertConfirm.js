class ShowModalAny {
    constructor(title, helpHtml) {
        this.title = title;
        this.helpHtml = helpHtml;
    }

    show() {
        var context = this;
        $.alert({
            title: context.title,
            content: context.helpHtml,
        });
    }
}

class ShowModuleHelp {
    constructor(title, helpHtml) {
        this.title = title;
        this.helpHtml = helpHtml;
    }

    show() {
        var context = this;
        if(context.helpHtml.indexOf('Expired') != -1) {
            window.location.href = "login.html";
        }
        else {
            $.alert({
                title: context.title,
                content: context.helpHtml,
            });
        }
    }
}

class ShowAutoCompleteFieldHelp {
    constructor(title, field, objDefault, obj) {
        this.title = title;
        this.field = field;
        this.objDefault = objDefault;
        this.obj = obj;
    }

    show() {
        var context = this;
        var defaultHtml = $(this.objDefault).html();
        var html = $(this.obj).html();
        var fieldValue = $(this.field).val();
        if (fieldValue) {
            var completeText = "<h4>"+defaultHtml+"</h4><b>["+fieldValue+"]</b><br><br>"+html;
//            var completeText = "<h4>" + fieldValue + "</h4>" + html;
            $.alert({
                title: context.title,
                content: completeText,
            });
        }
        else {
            var completeText = "<h4>"+defaultHtml+"</h4>Please choose a value for more help";
            $.alert({
                title: context.title,
                content: completeText,
            });
        }
    }
}

class ShowFieldHelp {
    constructor(title, field, obj) {
        this.title = title;
        this.field = field;
        this.obj = obj;
    }

    show() {
        var context = this;
        var fieldTitle = $(this.field).attr("title");
        var html = $(this.obj).html();
        var completeText = "<h4>" + fieldTitle + "</h4>" + html;
        $.alert({
            title: context.title,
            content: completeText,
        });
    }
}

class NoSelectedRecordEdit {
    alert() {
        $.alert({
            title: 'No Record Selected',
            content: 'Please select a record to edit',
        });
    }
}

class NoSelectedRecordDelete {
    alert() {
        $.alert({
            title: 'No Record Selected',
            content: 'Please select a record to delete',
        });
    }
}

class DeleteRecordConfirm {
    constructor(confirmFunc) {
        this.confirmFunc = confirmFunc;
    }

    confirm() {
        var context = this;
        $.confirm({
           title: 'Delete Record',
           content: 'Continue delete selected record?',
           buttons: {
               confirm: context.confirmFunc,
               cancel: function () {
//                   $.alert('Canceled!');
               }
           }
       });
    }
}
