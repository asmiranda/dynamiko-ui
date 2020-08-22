class DynamikoSchoolMobile extends SchoolMobile {
    init() {
        alert("comming from overrider!");
    }
}

$(function () {
    schoolMobile = new DynamikoSchoolMobile();
});
