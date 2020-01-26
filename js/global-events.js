class GlobalEvents {
    initializeGlobalEvents() {
        $(window).keydown(function(event){
            if(event.keyCode == 13) {
              event.preventDefault();
              return false;
            }
        });
        
        Object.defineProperty(Object.prototype, "getProp", {
            value: function (prop) {
                var key,self = this;
                for (key in self) {
                    if (key.toLowerCase() == prop.toLowerCase()) {
                        return self[key];
                    }
                }
            },
            //this keeps jquery happy
            enumerable: false
        });
        
        Object.defineProperty(Object.prototype, "setProp", {
            value: function (prop, val) {
                var key,self = this;
                var found = false;
                if (Object.keys(self).length > 0) {
                    for (key in self) {
                        if (key.toLowerCase() == prop.toLowerCase()) {
                            //set existing property
                            found = true;
                            self[key] = val;
                            break;
                        }
                    }
                }
        
                if (!found) {
                    //if the property was not found, create it
                    self[prop] = val;
                }
        
                return val;
            },
            //this keeps jquery happy
            enumerable: false
        });
        
        $(document).on('click', '.btnSignOut', function() {
            window.location.href = "login.html";
        });
        $(document).on('click', '.manageUserRoles', function() {
            uiService.manageUserRoles();
        });
        $(document).on('click', '.manageDepartment', function() {
            uiService.manageDepartment();
        });
        $(document).on('click', '.manageTaxCategory', function() {
            uiService.manageTaxCategory();
        });
        $(document).on('click', '.manageAccountChart', function() {
            uiService.manageAccountChart();
        });
        $(document).on('click', '.manageBenefit', function() {
            uiService.manageBenefit();
        });
        $(document).on('click', '.manageEmployee', function() {
            uiService.manageEmployee();
        });
        $(document).on('click', '.manageSupplier', function() {
            uiService.manageSupplier();
        });
        $(document).on('click', '.manageProduct', function() {
            uiService.manageProduct();
        });
        $(document).on('click', '.choiceCompany', function() {
            uiService.changeCompany($(this).attr("companyCode"), $(this).attr("companyName"));
        });

        $(document).on('keyup', '.autocomplete', function() {
            dynaAutoComplete.doAutoComplete(this);
        });
        $(document).on('click', '.autocomplete-choice', function() {
            dynaAutoComplete.putAutoComplete(this);
        });

        $(document).on('click', '.btnChildTabSave', function() {
            dynaButtonAction.saveDisplayTab(this);
        });
        $(document).on('click', '.btnAddInfoSave', function() {
            dynaButtonAction.saveAddInfoSave(this);
        });

        $(document).on('click', 'button.btnChildTabEdit', function() {
            childTabs.editChildRecord(this);
        });
        $(document).on('click', 'button.btnChildTabNew', function() {
            childTabs.newDisplayTab(this);
        });
        $(document).on('click', 'button.btnChildTabDelete', function() {
            childTabs.deleteDisplayTab(this);
        });
        $(document).on('click', 'button.btnChildTabCancel', function() {
            childTabs.cancelDisplayTab(this);
        });
        $(document).on('click', '.setFileProfile', function() {
            childTabs.setFileProfile(this);
        });               
        $(document).on('click', '.attachFileRemove', function() {
            childTabs.removeAttachedFile(this);
        });               
        $(document).on('click', '.btnImage_', function() {
            childTabs.displayLargeImageFullScreen(this);
        });

        $(document).on('click', '.btnCreateJob', function() {
            hrRequisitionUI.createJob(this);
        });
        $(document).on('click', '.btnRemoveApplicant', function() {
            hrRequisitionUI.removeApplicant(this);
        });
        $(document).on('change', mainId, function() {
            console.log("###############HrRequisitionId change#############");
            hrRequisitionUI.reArrange(this);
        });
        $(document).on('click', '.loadRecordToForm', function() {
            hrRequisitionUI.loadRecordToForm(this);
        });

    }
}

