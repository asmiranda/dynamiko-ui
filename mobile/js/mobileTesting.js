class MobileTesting {
    init() {
        var context = this;
        $(document).on('click', `.mobileUI`, function () {
            context.doTesting(this);
        });
    }

    doTesting(obj) {
        var module = $(obj).attr('data');
        var mobileType = $("#mobileType").val();
        var version = $("#version").val();
        var user = $(obj).attr('user');

        var uri = `mobile/${mobileType}/version/${version}/${module}.html?user=${user}`;
        // alert(uri);
        $('#moduleToTest').attr("src", uri);
    }
}

$(function () {
    mobileTesting = new MobileTesting();
    mobileTesting.init();
})