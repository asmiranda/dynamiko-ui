class UserUI {
    constructor() {
        this.init();
    }

    init() {
        var context = this;
    }

    doSpecialAction(data) {
        console.log("UserUI doSpecialAction "+data);
        if (data == "startReset") {
            this.resetPassword();
        }
        else {
            var showModalAny = new ShowModalAny("User", data);
            showModalAny.show();
        }
    }

    resetPassword() {
        var str = `
        <div class="box box-info">
          <div class="box-body">
            <div class="form-group">
              <label for="inputEmail3" class="col-sm-2 control-label">Email</label>
              <div class="col-sm-10">
                <input type="email" class="form-control" id="inputEmail3" placeholder="Email">
              </div>
            </div>
            <div class="form-group">
              <label for="inputPassword3" class="col-sm-2 control-label">Password</label>
              <div class="col-sm-10">
                <input type="password" class="form-control" id="inputPassword3" placeholder="Password">
              </div>
            </div>
          </div>
      </div>        `;
        console.log("reset called.");
        var success = function() {
            console.log("testing confirm only");
        }
        var showConfirmAny = new ShowConfirmAny("Password Reset", str, success);
        showConfirmAny.confirm();
    }
}