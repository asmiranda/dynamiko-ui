class GlobalEventsGovernment {
    initializeGlobalEvents() {
        
        $(document).on('click', '.selectRealEstateTax', function() {
            realEstateTaxUI.loadRealEstateTaxProfile(this);
        });

        $(document).on('click', '.btnSaveBusinessPermitForCashier', function() {
            businessPermitUI.saveBusinessPermitForCashier(this);
        });
        $(document).on('keyup', 'input.editBusinessPermit', function() {
            businessPermitUI.changeBusinessPermitTValues(this);
        });
        $(document).on('click', '.BusinessPermitSelect', function() {
            businessPermitUI.loadBusinessPermitProfile(this);
        });

        $(document).on('click', '.CommunityTaxCertificateSelect', function() {
            communityTaxCertificateUI.selectCommunityTaxCertificate(this);
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
