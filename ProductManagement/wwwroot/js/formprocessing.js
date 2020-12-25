jQuery.ajax({
    url: param_route_get_csrf,
    method: 'get',
    beforeSend: function () {
    },
    success: function(result) {
        jQuery("#_token_csrf").val(result.csrf);
    },
    error: function(jqxhr, status, exception) {
        console.log('Exception:'+ exception);
    }
});
jQuery.validator.addMethod("checkOtherCompany", function (value, element, param) {
    var returnValue = true;
    if (jQuery(param).val() === 'OK' && value.trim().length < 2) {
        returnValue = false;
    }
    return returnValue;
}, "Vui lòng nhập tên công ty tài trợ không có trong danh sách");
jQuery.validator.addMethod("checkPhoneNumber", function (value, element) {
    var returnValue = false;
    var phoneno = /^\+?([0-9]+)$/;
    if(value.match(phoneno)) {
        return true;
    }
    return returnValue;
}, "Vui lòng nhập nhập số điện thoại đúng định dạng");
jQuery(document).ready(function() {
    jQuery("#preview_button") .click(function(){
        var validator = jQuery("#myform").validate({
            onfocusout: false,
            onkeyup: false,
            onclick: false,
            rules: {
                "emailaddress": {
                    required: true,
                    maxlength: 190,
                    email: true
                },
                "degree_title": {
                    required: true,
                    minlength: 2
                },
                "job_title": {
                    required: true,
                    minlength: 2
                },
                "lastname": {
                    required: true,
                    minlength: 2
                },
                "firstname": {
                    required: true,
                    minlength: 2
                },
                "gender": {
                    required: true
                },
                "birthday": {
                    required: true
                },
                "birthplace": {
                    required: true,
                    minlength: 2
                },
                "phone_number": {
                    required: true,
                    checkPhoneNumber: true,
                    minlength: 6
                },
                "organization": {
                    required: true,
                    minlength: 2
                },
                "postmail_yes_no": {
                    required: true
                },
                "address": {
                    required: true
                },
                "other_company": {
                    checkOtherCompany: '#sp_company'
                }
            },
            messages: {
                "emailaddress": {
                    required: "Vui lòng nhập địa chỉ email",
                    maxlength: "Hãy nhập tối đa 15 ký tự",
                    email: "Vui lòng nhập địa chỉ email đúng định dạng"
                },
                "degree_title": {
                    required: "Vui lòng nhập Học hàm - Học vị",
                    minlength: "Hãy nhập ít nhất 2 ký tự"
                },
                "job_title": {
                    required: "Vui lòng nhập Chức danh",
                    minlength: "Hãy nhập ít nhất 2 ký tự"
                },
                "lastname": {
                    required: "Vui lòng nhập Họ và chữ đệm",
                    minlength: "Hãy nhập ít nhất 2 ký tự"
                },
                "firstname": {
                    required: "Vui lòng nhập Tên",
                    minlength: "Hãy nhập ít nhất 2 ký tự"
                },
                "gender": {
                    required: "Vui lòng chọn Giới tính"
                },
                "birthday": {
                    required: "Vui lòng chọn Ngày sinh"
                },
                "birthplace": {
                    required: "Vui lòng nhập Nơi sinh",
                    minlength: "Hãy nhập ít nhất 2 ký tự"
                },
                "phone_number": {
                    required: "Vui lòng nhập số điện thoại liên hệ",
                    digits: "Vui lòng nhập chữ số",
                    minlength: "Hãy nhập ít nhất 6 số"
                },
                "organization": {
                    required: "Vui lòng nhập Đơn vị công tác",
                    minlength: "Hãy nhập ít nhất 2 ký tự"
                },
                "postmail_yes_no": {
                    required: "Vui lòng chọn hình thức nhận thư mời"
                },
                "address": {
                    required: "Vui lòng nhập địa chỉ liên hệ",
                    minlength: "Hãy nhập ít nhất 2 ký tự"
                },
                "other_company": {
                    checkOtherCompany: "Vui lòng nhập tên công ty tài trợ không có trong danh sách"
                }
            }
        });
        var validateResult = validator.form();
        if (validateResult) {
            jQuery('#previewOverlay').fadeIn(function(){
                jQuery('#preview_emailaddress').html(jQuery('#emailaddress').val());
                jQuery('#preview_degree_title').html(jQuery('#degree_title').val());
                jQuery('#preview_job_title').html(jQuery('#job_title').val());
                jQuery('#preview_lastname').html(jQuery('#lastname').val());
                jQuery('#preview_firstname').html(jQuery('#firstname').val());
                var genderValue = jQuery("input[name='gender']:checked").val();
                var gender = '';
                if (genderValue === 'female') {
                    gender = 'Nữ';
                }
                if (genderValue === 'male') {
                    gender = 'Nam';
                }
                jQuery('#preview_gender').html(gender);
                jQuery('#preview_idnumber').html(jQuery('#idnumber').val());
                jQuery('#preview_idplace').html(jQuery('#idplace').val());
                jQuery('#preview_iddate').html(jQuery('#iddate').val());
                jQuery('#preview_birthday').html(jQuery('#birthday').val());
                jQuery('#preview_birthplace').html(jQuery('#birthplace').val());
                jQuery('#preview_organization').html(jQuery('#organization').val());
                var postmailValue = jQuery("input[name='postmail_yes_no']:checked").val();
                var postmailValueTxt = '';
                if (postmailValue === 'postmail_yes') {
                    postmailValueTxt = 'Bưu điện (bản giấy)';
                }
                if (postmailValue === 'postmail_no') {
                    postmailValueTxt = 'Email (file scan)';
                }
                jQuery('#preview_postmail_yes_no').html(postmailValueTxt);

                var cmeValue = jQuery("input[name='cme_yes_no']:checked").val();
                var cmeValueTxt = '';
                if (cmeValue === 'cme_yes') {
                    cmeValueTxt = 'Có';
                }
                if (cmeValue === 'cme_no') {
                    cmeValueTxt = 'Không';
                }
                jQuery('#preview_cme_yes_no').html(cmeValueTxt);
                jQuery('#preview_address').html(jQuery('#address').val());
                jQuery('#preview_phone_number').html(jQuery('#phone_number').val());
                var presentValue = jQuery("input[name='present_yes_no']:checked").val();
                var presentValueTxt = '';
                if (presentValue === 'present_yes') {
                    presentValueTxt = 'Có';
                    jQuery('#preview_presentation_title_row').show();
                }
                if (presentValue === 'present_no') {
                    presentValueTxt = 'Không';
                    jQuery('#preview_presentation_title_row').hide();
                }
                jQuery('#preview_present_yes_no').html(presentValueTxt);
                jQuery('#preview_presentation_title').html(jQuery('#presentation_title').val());
                var sponsorValue = jQuery('#sp_company').val();
                var sponsorValueTxt = '';
                if (sponsorValue === 'OK') {
                    sponsorValueTxt = jQuery('#other_company').val();
                } else {
                    sponsorValueTxt = jQuery( "#sp_company option:selected" ).text();
                }
                jQuery('#preview_sponsor').html(sponsorValueTxt);

                var previewOverlay = jQuery('#previewOverlay');
                previewOverlay.removeClass('hidden-block');
                previewOverlay.addClass('visible-block');
                jQuery("#preview_submit").click(function(){
                    jQuery('#preview_submit').prop('disabled', true);
                    jQuery('#show_qrcode').html('');
                    jQuery('#block-regis-normal').removeClass('hidden-block');
                    jQuery('#block-regis-normal').addClass('visible-block');
                    jQuery('#block-regis-error').addClass('hidden-block');
                    jQuery('#block-regis-error').removeClass('visible-block');
                    jQuery('#block-regis-success').addClass('hidden-block');
                    jQuery('#block-regis-success').removeClass('visible-block');
                    window.scrollTo(0,0);
                    event.preventDefault();
                    var csrfToken = jQuery('#_token_csrf').val();
                    if (csrfToken.trim().length < 1) {
                        alert("Có lỗi khi tương tác với máy chủ");
                        return false;
                    }
                    let formData = new FormData();
                    formData.append('emailaddress',jQuery('#emailaddress').val());
                    formData.append('degree_title',jQuery('#degree_title').val());
                    formData.append('job_title',jQuery('#job_title').val());
                    formData.append('lastname',jQuery('#lastname').val());
                    formData.append('firstname',jQuery('#firstname').val());
                    formData.append('gender',jQuery("input[name='gender']:checked").val());
                    formData.append('birthday',jQuery('#birthday').val());
                    formData.append('birthplace',jQuery('#birthplace').val());
                    formData.append('organization',jQuery('#organization').val());
                    formData.append('postmail_case',jQuery("input[name='postmail_yes_no']:checked").val());
                    formData.append('address',jQuery('#address').val());
                    formData.append('phone_number',jQuery('#phone_number').val());
                    formData.append('sp_company',jQuery('#sp_company').val());
                    formData.append('other_company',jQuery('#other_company').val());
                    jQuery.ajax({
                        url: param_route_form_json_store,
                        headers: {
                            'X-CSRF-TOKEN': csrfToken
                        },
                        data: formData,
                        beforeSend: function () {
                            jQuery('#previewOverlay').fadeOut(function(){
                                var previewOverlay = jQuery('#previewOverlay');
                                previewOverlay.removeClass('visible-block');
                                previewOverlay.addClass('hidden-block');
                            });
                            jQuery.LoadingOverlay("show");
                        },
                        type: 'POST',
                        dataType: "json",
                        contentType: false,
                        cache: false,
                        processData: false,
                        success: function(data) {
                            var blockRegisNormal = jQuery('#block-regis-normal');
                            var blockRegisError = jQuery('#block-regis-error');
                            var blockRegisSuccess = jQuery('#block-regis-success');
                            blockRegisNormal.removeClass('visible-block');
                            blockRegisNormal.addClass('hidden-block');
                            var pdfUrl = param_route_get_pdf + data.message;
                            var txtDownload = "<a href='" + pdfUrl + "'>Download</a>";
                            if (data.code === 1 || data.code === 3) {
                                document.getElementById("show_qrcode").innerHTML = "";
                                new QRCode(document.getElementById("show_qrcode"), data.message);
                                blockRegisError.removeClass('visible-block');
                                blockRegisError.addClass('hidden-block');
                                blockRegisSuccess.removeClass('hidden-block');
                                blockRegisSuccess.addClass('visible-block');
                                jQuery('#link-download-pdf').html(txtDownload);
                                document.getElementById("myform").reset();
                                jQuery('#other_company_row').hide();
                            }
                            if (data.code === 1) {
                                jQuery('#show_result_email').html("<div class='text-success'><h6 class='my-0'>Email đã gửi</h6><small>01 email đã gửi về cho quý khách</small></div>");
                                jQuery('#small-text-qrcode').html("<small>Đây cũng là mã QR đã gửi trong email</small>");
                                jQuery('#small-text-download').html("<small class='text-muted'>Đây là phiếu đăng ký đã gửi kèm email</small>");

                            } else if (data.code === 2) {
                                blockRegisError.removeClass('hidden-block');
                                blockRegisError.addClass('visible-block');
                                blockRegisSuccess.removeClass('visible-block');
                                blockRegisSuccess.addClass('hidden-block');
                            } else if (data.code === 3) {
                                jQuery('#show_result_email').html("<div class='text-danger'><h6 class='my-0'>Email gửi bị lỗi</h6><small>Email gửi cho quý khách gặp lỗi</small></div>");
                                jQuery('#small-text-qrcode').html("<small class='text-danger'>Không gửi được mail, vui lòng lưu ảnh này</small>");
                                jQuery('#small-text-download').html("<small class='text-danger'>Không gửi được mail, vui lòng lưu file này</small>");
                            } else {
                                blockRegisError.removeClass('hidden-block');
                                blockRegisError.addClass('visible-block');
                                blockRegisSuccess.removeClass('visible-block');
                                blockRegisSuccess.addClass('hidden-block');
                            }
                        },
                        error: function(xhr,status,error){
                            console.log('Lỗi: ' + status + " - " + error);
                        },
                        complete: function(xhr, textStatus) {
                            jQuery.LoadingOverlay("hide");
                        }
                    });
                });
            });
        }
    });
    jQuery("#button_x").click(function(){
        jQuery('#previewOverlay').fadeOut(function(){
            var previewOverlay = jQuery('#previewOverlay');
            previewOverlay.removeClass('visible-block');
            previewOverlay.addClass('hidden-block');
        });
    });
    jQuery("#preview_return").click(function(){
        jQuery('#previewOverlay').fadeOut(function(){
            var previewOverlay = jQuery('#previewOverlay');
            previewOverlay.removeClass('visible-block');
            previewOverlay.addClass('hidden-block');
        });
    });
});
