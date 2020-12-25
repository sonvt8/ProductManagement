jQuery(document).ready(function() {
    jQuery('#present_yes').click(function (e) {
        jQuery('#presentation_title_row').show();
    });
    jQuery('#present_no').click(function (e) {
        jQuery('#presentation_title_row').hide();
    });
    jQuery('#sp_company').on('change', function() {
        if ('OK' === this.value) {
            jQuery('#other_company_row').show();
        } else {
            jQuery('#other_company_row').hide();
        }
    });
});