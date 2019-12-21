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
        $(document).on('keyup', '.txtSearchQuestion', function(){
            context.searchQuestion(this);
        });
    }

    searchQuestion(obj) {
        var context = this;

        var examId = $(obj).attr("examId");
        var value = $(obj).val();
        console.log(value);
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/widget/ReviewProgramModuleUI/searchQuestions/'+examId+"/"+value;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Record Found");
            console.log(data);
            $(".addQuestionList").empty();
            $.each(data, function(index, obj) {
                var question = obj.getProp("question");
                var answer = obj.getProp("answer");
                var choiceA = obj.getProp("choiceA");
                var choiceB = obj.getProp("choiceB");
                var choiceC = obj.getProp("choiceC");
                var choiceD = obj.getProp("choiceD");
                var examQuestionId = obj.getProp("ReviewQuestionAnswerId");
                var qHtml = `
                    <li class="list-group-item">
                        <b>${question}</b> <a class="pull-right btnAddQuestion" examId="${examId}" examQuestionId="${examQuestionId}" title="${examId} - ${examQuestionId}"><i class="fa fa-fw fa-plus-square"></i> Add</a>
                    </li>
                `;
                $(".addQuestionList").append(qHtml);
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    showQuestions(obj) {
        var context = this;

        var examId = $(obj).attr("examId");
        $("input.txtSearchQuestion").attr("examId", examId);

        var title = $(obj).attr("title");
        $(".examTitle").html(title+" ["+examId+"]");
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/widget/ReviewProgramModuleUI/loadQuestions/'+examId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Record Found");
            console.log(data);
            $(".questionList").empty();
            $.each(data, function(index, obj) {
                var question = obj.getProp("question");
                var answer = obj.getProp("answer");
                var examQuestionId = obj.getProp("ReviewProgramModuleExamQuestionId");
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
        var context = this;

        var examId = $(obj).attr("examId");
        var examQuestionId = $(obj).attr("examQuestionId");
        var txtSearch = $(".txtSearchQuestion").val();

        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/widget/ReviewProgramModuleUI/addQuestion/'+examId+"/"+examQuestionId+"/"+txtSearch;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Record Found");
            console.log(data);
            $(".addQuestionList").empty();
            $.each(data, function(index, obj) {
                var question = obj.getProp("question");
                var answer = obj.getProp("answer");
                var choiceA = obj.getProp("choiceA");
                var choiceB = obj.getProp("choiceB");
                var choiceC = obj.getProp("choiceC");
                var choiceD = obj.getProp("choiceD");
                var examQuestionId = obj.getProp("ReviewQuestionAnswerId");
                var qHtml = `
                    <li class="list-group-item">
                        <b>${question}</b> <a class="pull-right btnAddQuestion" examId="${examId}" examQuestionId="${examQuestionId}" title="${examId} - ${examQuestionId}"><i class="fa fa-fw fa-plus-square"></i> Add</a>
                    </li>
                `;
                $(".addQuestionList").append(qHtml);
            });
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxGet();
    }

    deleteQuestion(obj) {
        var context = this;

        var examId = $(obj).attr("examId");
        var examQuestionId = $(obj).attr("examQuestionId");
        var url = MAIN_URL+'/api/generic/'+localStorage.companyCode+'/widget/ReviewProgramModuleUI/deleteQuestion/'+examId+"/"+examQuestionId;
        var ajaxRequestDTO = new AjaxRequestDTO(url, "");
        var successCallback = function(data) {
            console.log("Record Found");
            console.log(data);
            $(".questionList").empty();
            $.each(data, function(index, obj) {
                var question = obj.getProp("question");
                var answer = obj.getProp("answer");
                examQuestionId = obj.getProp("ReviewProgramModuleExamQuestionId");
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
