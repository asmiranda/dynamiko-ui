class ReviewCenter {
    constructor() {
        var context = this;
        $(document).on('click', '.btnShowQuestions', function(){
            context.showQuestions(this);
        });
        $(document).on('click', '.btnAddQuestion', function(){
            context.addQuestion(this);
        });
        $(document).on('click', '.btnDeleteQuestion', function(){
            context.deleteQuestion(this);
        });
    }

    showQuestions(obj) {
        var context = this;

        var examId = $(obj).attr("examId");
        var title = $(obj).attr("title");
        $(".examTitle").html(title+" ["+examId+"]");
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/widget/ReviewModuleUI/loadQuestions/'+examId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Record Found");
            console.log(data);
            $(".questionList").empty();
            $.each(data, function(index, obj) {
                var question = obj.getProp("question");
                var answer = obj.getProp("answer");
                var examQuestionId = obj.getProp("ReviewModuleExamQuestionId");
                var qHtml = `
                    <li class="list-group-item">
                        <b>${question}</b> <a class="pull-right btnDeleteQuestion" examId="${examId}" examQuestionId="${examQuestionId}" title="${examId+" - "+examQuestionId}"><i class="fa fa-fw fa-trash-o"></i></a><a class="pull-right">${answer}</a>
                    </li>
                `;
                $(".questionList").append(qHtml);
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    addQuestion(obj) {
    }

    deleteQuestion(obj) {
        var context = this;

        var examId = $(obj).attr("examId");
        var examQuestionId = $(obj).attr("examQuestionId");
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/widget/ReviewModuleUI/deleteQuestion/'+examId+"/"+examQuestionId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Record Found");
            console.log(data);
            $(".questionList").empty();
            $.each(data, function(index, obj) {
                var question = obj.getProp("question");
                var answer = obj.getProp("answer");
                examQuestionId = obj.getProp("ReviewModuleExamQuestionId");
                var qHtml = `
                    <li class="list-group-item">
                        <b>${question}</b> <a class="pull-right btnDeleteQuestion" examId="${examId}" examQuestionId="${examQuestionId}" title="${examId+" - "+examQuestionId}"><i class="fa fa-fw fa-trash-o"></i></a><a class="pull-right">${answer}</a>
                    </li>
                `;
                $(".questionList").append(qHtml);
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }
}

$(function () {
    var reviewCenter = new ReviewCenter();
});
