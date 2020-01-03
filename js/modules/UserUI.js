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
            this.resetPassword("");
        }
        else {
            var showModalAny = new ShowModalAny("User", data);
            showModalAny.show();
        }
    }

    resetPassword(anyText) {
        var context = this;
        var str = `
          <div class="box box-info">
            <div class="box-body">
              <span class="info-box-text" style="padding: 10px;">${anyText}</span>
              <div class="form-group">
                <label for="oldPassword" class="col-sm-4 control-label">Old Password</label>
                <div class="col-sm-8">
                  <input type="password" class="form-control" id="oldPassword" placeholder="Old Password">
                </div>
              </div>

              <div class="form-group">
                <label for="newPassword" class="col-sm-4 control-label">New Password</label>
                <div class="col-sm-8">
                  <input type="password" class="form-control" id="newPassword" placeholder="New Password">
                </div>
              </div>

              <div class="form-group">
                <label for="confirmPassword" class="col-sm-4 control-label">Confirm Password</label>
                <div class="col-sm-8">
                  <input type="password" class="form-control" id="confirmPassword" placeholder="Confirm Password">
                </div>
              </div>

            </div>
          </div>        
        `;
        var recordId = $('input.mainId').val();
        if (recordId > 0) {
          var success = function() {
            console.log("testing confirm only");
            context.saveReset();
          }
          var showConfirmAny = new ShowConfirmAny("Password Reset", str, success);
          showConfirmAny.confirm();
        }
        else {
          var showModalAny = new ShowModalAny("Password Reset", "Please select a user");
          showModalAny.show();
        }
    }

    saveReset() {
      var oldPassword = $("#oldPassword").val();
      var newPassword = $("#newPassword").val();
      var confirmPassword = $("#confirmPassword").val();

      if (newPassword != confirmPassword) {
        this.resetPassword("New and Confirm password not match.");
      }
      else {
        var context = this;
        var recordId = $("input.mainId").val();
        var url = MAIN_URL+"/api/generic/"+sessionStorage.companyCode+"/specialaction/UserUI/savereset/"+recordId;
        var resetPasswordDTO = new ResetPasswordDTO(oldPassword, newPassword);
        var vdata = JSON.stringify(resetPasswordDTO);
        var ajaxRequestDTO = new AjaxRequestDTO(url, vdata);
        var successCallback = function(data) {
            console.log(data);
            var showModalAny = new ShowModalAny("Password Reset", data);
            showModalAny.show();
        };
        var ajaxCaller = new AjaxCaller(ajaxRequestDTO, successCallback);
        ajaxCaller.ajaxPost();
      }
    }
}

class ResetPasswordDTO {
  constructor(oldPassword, newPassword) {
      this.oldPassword = oldPassword;
      this.newPassword = newPassword;
  }
}
