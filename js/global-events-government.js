class GlobalEventsGovernment {
    initializeGlobalEvents() {

                
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
