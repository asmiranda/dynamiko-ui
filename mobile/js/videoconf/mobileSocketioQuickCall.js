class MobileSocketIOQuickCall {
    constructor() {
        $(document).on('click', `#btnQuickCall`, function () {
            mobileSocketioquickCall.btnQuickCall(this);
        });
    }

    btnQuickCall(obj) {
    }
}

$(function () {
    mobileSocketioQuickCall = new MobileSocketioQuickCall();
});
