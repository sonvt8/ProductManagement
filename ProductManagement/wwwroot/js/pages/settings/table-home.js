$(function() {
    let switchery;
    if (Array.prototype.forEach) {
        let elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
        elems.forEach(function(html) {
            switchery = new Switchery(html);
        });
    }
    else {
        let elems = document.querySelectorAll('.switchery');
        for (let i = 0; i < elems.length; i++) {
            switchery = new Switchery(elems[i]);
        }
    }
    //===================================
    let frmHomePageSettings = $('#frm_home_page_settings');
    let _postSettingsUrlHome = $("#_post_settings_url_home").val();
    let _postSettingsIdHome = $("#_post_settings_id_home").val();
    frmHomePageSettings.submit(function(event) {
        event.preventDefault();
        let inputRowsOptionVal = $("#rows_option").val();
        let inputSequenceVal = ($("input[name='sequence']:checked").val())?'1':'0';
        let inputIdCodeVal = ($("input[name='id_code']:checked").val())?'1':'0';
        let inputEmailVal = ($("input[name='email']:checked").val())?'1':'0';
        let inputFullnameVal = ($("input[name='fullname']:checked").val())?'1':'0';
        let inputDegreeTitleVal = ($("input[name='degree_title']:checked").val())?'1':'0';
        let inputJobTitleVal = ($("input[name='job_title']:checked").val())?'1':'0';
        let inputGenderVal = ($("input[name='gender']:checked").val())?'1':'0';
        let inputBirthdayVal = ($("input[name='birthday']:checked").val())?'1':'0';
        let inputBirthplaceVal = ($("input[name='birthplace']:checked").val())?'1':'0';
        let inputOrganizationVal = ($("input[name='organization']:checked").val())?'1':'0';
        let inputPhoneNumberVal = ($("input[name='phone_number']:checked").val())?'1':'0';
        let inputSponsorVal = ($("input[name='sponsor']:checked").val())?'1':'0';
        let inputPostmailCaseVal = ($("input[name='postmail_case']:checked").val())?'1':'0';
        let inputAddressVal = ($("input[name='address']:checked").val())?'1':'0';
        let inputCreatedAtVal = ($("input[name='created_at']:checked").val())?'1':'0';
        let inputUpdateAtVal = ($("input[name='update_at']:checked").val())?'1':'0';
        let inputPersonalVal = ($("input[name='personal']:checked").val())?'1':'0';
        let inputSpCompanyVal = ($("input[name='sp_company']:checked").val())?'1':'0';
        let inputOtCompanyVal = ($("input[name='ot_company']:checked").val())?'1':'0';
        let formData = new FormData();
        formData.append('id',_postSettingsIdHome);
        formData.append('_method','PUT');
        formData.append('rows_option',inputRowsOptionVal);
        formData.append('sequence',inputSequenceVal);
        formData.append('id_code',inputIdCodeVal);
        formData.append('email',inputEmailVal);
        formData.append('fullname',inputFullnameVal);
        formData.append('degree_title',inputDegreeTitleVal);
        formData.append('job_title',inputJobTitleVal);
        formData.append('gender',inputGenderVal);
        formData.append('birthday',inputBirthdayVal);
        formData.append('birthplace',inputBirthplaceVal);
        formData.append('organization',inputOrganizationVal);
        formData.append('phone_number',inputPhoneNumberVal);
        formData.append('sponsor',inputSponsorVal);
        formData.append('postmail_case',inputPostmailCaseVal);
        formData.append('address',inputAddressVal);
        formData.append('created_at',inputCreatedAtVal);
        formData.append('update_at',inputUpdateAtVal);
        formData.append('personal',inputPersonalVal);
        formData.append('sp_company',inputSpCompanyVal);
        formData.append('ot_company',inputOtCompanyVal);
        jQuery.ajax({
            url: _postSettingsUrlHome,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: formData,
            beforeSend: function () {
                Loading.show();
            },
            type: 'POST',
            dataType: "json",
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                if (data.code === 1) {
                    swal({
                        title: data.title,
                        text: data.message,
                        confirmButtonColor: "#66BB6A",
                        type: "success"
                    });
                } else {
                    new PNotify({
                        title: data.title,
                        text: data.message,
                        addclass: 'bg-danger'
                    });
                }
            },
            error: function(xhr,status,error) {
                console.log('Lỗi: ' + status + " - " + error);
                new PNotify({
                    title: 'Lưu thiết lập',
                    text: status + ": " + error,
                    addclass: 'bg-danger'
                });
                Loading.close();
            },
            complete: function(xhr, textStatus) {
                Loading.close();
            }
        });
    });
});