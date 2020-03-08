class GlobalEventsGovernment {
    initializeGlobalEvents() {
        
        $(document).on('click', '.btnSaveEmployeePayrollDetail', function() {
            payrollScheduleUI.saveEmployeePayrollDetail(this);
        });
        $(document).on('keyup', 'input.editEmployeePayrollDetail', function() {
            payrollScheduleUI.updateEmployeePayrolDetailAmount(this);
        });

        $(document).on('click', '.btnShowGovernmentReport', function() {
            governmentReportsUI.showGovernmentReport(this);
        });
        $(document).on('click', 'a[module="GovernmentReportsUI"]', function() {
            governmentReportsUI.autoChooseDate(this);
        });

        $(document).on('click', '.selectPrintingQueue', function() {
            governmentPrintingUI.selectPrintingQueue(this);
        });
        $(document).on('click', '.btnCashierAcceptPayment', function() {
            governmentCashierUI.acceptPayment(this);
        });
        $(document).on('click', '.selectGovernmentCashier', function() {
            governmentCashierUI.selectGovernmentCashier(this);
        });
        $(document).on('keyup', 'input.editCtc', function() {
            communityTaxCertificateUI.changeCTCValues(this);
        });
        $(document).on('click', '.btnSaveCTCForCashier', function() {
            communityTaxCertificateUI.saveCTCForCashier(this);
        });
        $(document).on('click', '.CommunityTaxCertificateUI_btnNewCommunityTaxCertificate', function() {
            communityTaxCertificateUI.newCTC(this);
        });
        
    }
}
