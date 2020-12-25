$(function() {
    
// onShown callback
    $('#btnAdd').on('click', function() {
        $('#panelCreate').toggleClass('hide');
    });
    $('#btnCloseCreate').on('click', function() {
        $('#btnResetCreate').trigger('click');
        $('#panelCreate').addClass('hide');
    });

    $("#frmCreate").validate({
        //errorClass: 'validation-error-label',
        errorClass: 'has-error',
        //successClass: 'validation-valid-label',
        successClass: 'has-success',
        validClass: "has-success",
        highlight: function(element, errorClass, validClass) {
            $(element.form).find("label[for=" + element.id + "]").addClass('help-block');
            $(element).parent().parent().addClass(errorClass).removeClass(validClass);
            $(element).fadeOut(function() {
                $(element).fadeIn();
            });
        },
        unhighlight: function(element, errorClass, validClass) {
            $(element.form).find("label[for=" + element.id + "]").addClass('help-block');
            $(element).parent().parent().removeClass(errorClass);
        },
        success: function(label) {
            label.addClass("help-block hide").text("Hợp lệ")
        },
        errorPlacement: function(error, element) {
            error.hide();
        },
        rules: {
            //name: "required",
            code: "required",
            short_name: "required"
        },
        messages: {
            //name: "Điền tên tổng trạm",
            code: "Điền mã tổng trạm",
            short_name: "Điền tên viết tắt của tổng trạm"
        }
    });
});

