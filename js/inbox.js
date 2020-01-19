class MyInbox {
    init() {
        var context = this;
        console.log("Testing Inbox");
        
        $(".workStarted").click(function() {
            context.loadWorkStarted();
        });
        $(".taskForMe").click(function() {
            context.loadTask('me');
        });
        $(".taskForOpen").click(function() {
            context.loadTask('open');
        });
        $(".taskForCompleted").click(function() {
            context.loadTask('completed');
        });
        $(".taskForRejected").click(function() {
            context.loadTask('rejected');
        });
        $(".taskForCancelled").click(function() {
            context.loadTask('cancelled');
        });

        this.initFavorite();
        this.loadWorkStarted();
    }

    loadTask(action) {
        var context = this;
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/widget/InboxWidget/task/'+action;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            context.clearInbox();
            console.log(data);
            $(data).each(function(index, obj) {
                console.log(obj);
                var approvalMapId = obj.getProp("WfApprovalMapId");
                var processInstanceId = obj.getProp("processInstanceId");
                var employeeName = obj.getProp("fromAssignee");
                var subject = obj.getProp("subject");
                var description = obj.getProp("description");
                var entity = obj.getProp("entity");
                var entityId = obj.getProp("entityId");
                var startedBy = obj.getProp("assignee");
                var createdDate = obj.getProp("createdDate");
                var status = obj.getProp("actionStr");

                var str = "<tr>";
                str += '<td class="mailbox-star"><a href="#"><i class="fa fa-star text-yellow"></i></a></td>';
                str += '<td class="mailbox-star">'+employeeName+'</td>';
                str += '<td class="mailbox-star"><a href="#" class="inboxRecord" mapId="'+approvalMapId+'"><b>'+subject+'</b></a><br>'+description+'</td>';
                str += '<td class="mailbox-star">'+createdDate+'</td>';
                str += '<td class="mailbox-star">'+status+'</td>';
                str += '<td class="mailbox-star">';
                str += '<div class="btn-group pull-right">';
                str += '<button class="btn btn-primary btn-sm" type="button" title="Approve request"><i class="fa fa-thumbs-o-up"></i></button>';
                str += '<button class="btn btn-default btn-sm" type="button" title="Return to sender"><i class="fa fa-reply"></i></button>';
                str += '<button class="btn btn-default btn-sm" type="button" title="Reassign this task"><i class="fa fa-fw fa-mail-forward"></i></button>';
                str += '<button class="btn btn-danger btn-sm" type="button" title="Reject request"><i class="fa fa-thumbs-o-down"></i></button>';
                str += '</div>';
                str += '</td>';
                str += "</tr>";
                $("table#myInbox").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    loadWorkStarted() {
        var context = this;
        var url = MAIN_URL+'/api/generic/'+sessionStorage.companyCode+'/widget/InboxWidget/work/';
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            context.clearInbox();
            console.log(data);
            $(data).each(function(index, obj) {
                console.log(obj);
                var approvalMapId = obj.getProp("WfApprovalMapId");
                var processInstanceId = obj.getProp("processInstanceId");
                var employeeName = obj.getProp("employeeName");
                var subject = obj.getProp("subject");
                var description = obj.getProp("description");
                var entity = obj.getProp("entity");
                var entityId = obj.getProp("entityId");
                var startedBy = obj.getProp("assignee");
                var createdDate = obj.getProp("createdDate");
                var status = obj.getProp("actionStr");
                
                var str = "<tr>";
                str += '<td class="mailbox-star"><a href="#"><i class="fa fa-star text-yellow"></i></a></td>';
                str += '<td class="mailbox-star">'+employeeName+'</td>';
                str += '<td class="mailbox-star"><a href="#" class="inboxRecord" mapId="'+approvalMapId+'"><b>'+subject+'</b></a><br>'+description+'</td>';
                str += '<td class="mailbox-star">'+createdDate+'</td>';
                str += '<td class="mailbox-star">'+status+'</td>';
                str += '<td class="mailbox-star">';
                str += '<div class="btn-group pull-right">';
                str += '<button class="btn btn-primary btn-sm" type="button" title="Approve request"><i class="fa fa-thumbs-o-up"></i></button>';
                str += '<button class="btn btn-default btn-sm" type="button" title="Return to sender"><i class="fa fa-reply"></i></button>';
                str += '<button class="btn btn-default btn-sm" type="button" title="Reassign this task"><i class="fa fa-fw fa-mail-forward"></i></button>';
                str += '<button class="btn btn-danger btn-sm" type="button" title="Reject request"><i class="fa fa-thumbs-o-down"></i></button>';
                str += '</div>';
                str += '</td>';
                str += "</tr>";
                $("table#myInbox").append(str);
            });
        };
        ajaxCaller.ajaxGet(ajaxRequestDTO, successCallback);
    }

    clearInbox() {
        $("table#myInbox").find("tr:gt(0)").remove();
    }

    initFavorite() {
        //Handle starring for glyphicon and font awesome
        $(".mailbox-star").click(function (e) {
            e.preventDefault();
            //detect type
            var $this = $(this).find("a > i");
            var glyph = $this.hasClass("glyphicon");
            var fa = $this.hasClass("fa");

            //Switch states
            if (glyph) {
                $this.toggleClass("glyphicon-star");
                $this.toggleClass("glyphicon-star-empty");
            }

            if (fa) {
                $this.toggleClass("fa-star");
                $this.toggleClass("fa-star-o");
            }
        });
    }
}

$(function () {
    myInbox = new MyInbox();
});
