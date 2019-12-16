class ReviewCenter {
    constructor() {
        var context = this;
        $(document).on('click', '.btnEditQuestions', function(){
            context.editQuestions(this);
        });
    }

    editQuestions(obj) {
        var context = this;

        var recordId = $(obj).attr("recordid");
        var title = $(obj).attr("title");
        $(".examTitle").html(title+" ["+recordId+"]");
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/widget/ReviewModuleUI/loadQuestions/'+recordId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Record Found");
            console.log(data);
            $(".questionList").empty();
            $.each(data, function(index, obj) {
                var question = obj.getProp("question");
                var answer = obj.getProp("answer");
                var qHtml = `
                    <li class="list-group-item">
                        <b>${question}</b> <a class="pull-right">${answer}</a>
                    </li>
                `;
                $(".questionList").append(qHtml);
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    loadQuestions() {

    }
}

$(function () {
    var reviewCenter = new ReviewCenter();
});
