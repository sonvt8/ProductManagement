window.start_stop = 'stop';
$(function() {
    function setCookie(cname, cvalue, exdays) {
        let d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }

    function getCookie(cname) {
        let name = cname + "=";
        let ca = document.cookie.split(';');
        for(let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    function playSound(soundObj, wav_url) {
        let sound = document.getElementById(soundObj);
        sound.controls = false;
        sound.loop = false;
        sound.src = wav_url;
        sound.play();
    }

    let toggleIcon = $('#panel_toggle_icon');
    let btnClosePanel = $("#btn_close_panel");
    let btnStartStopScan = $("#btn_start_stop_scan");
    let uuidInput = $('#uuid');
    const html5QrCode = new Html5Qrcode("reader");
    const supported = 'mediaDevices' in navigator;
    if (supported) {
        const constraints = {
            video: true,
        };
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => {
                $('#videoSource').find('option').remove();
                navigator.mediaDevices.enumerateDevices().then(function (devices) {
                    let camSelected = getCookie("ubm_cam_id");
                    for(let i = 0; i < devices.length; i ++){
                        let device = devices[i];
                        if (device.kind === 'videoinput') {
                            let option = document.createElement('option');
                            option.value = device.deviceId;
                            option.text = device.label || 'camera ' + (i + 1);
                            if (camSelected.length > 0 && device.deviceId === camSelected) option.selected="selected";
                            document.querySelector('select#videoSource').appendChild(option);
                        }
                    }
                });
            });
    }
    /*Ẩn panel scan*/
    btnClosePanel.on('click', function (event) {
        window.start_stop = 'stop';
        toggleIcon.trigger('click');
        html5QrCode.stop().then(ignore => {
            playSound('sound1',stopSoundUrl);
            // QR Code scanning is stopped.
        }).catch(err => {
            // Stop failed, handle it.
        });
    });

    /*Bắt đầu/ kết thúc scan*/
    btnStartStopScan.on('click', function (event) {
        let cameraId = document.querySelector('select#videoSource').value;
        setCookie('ubm_cam_id',cameraId,30);
        if (window.start_stop === 'stop') {
            window.start_stop = 'start';
            playSound('sound1',startSoundUrl);
            html5QrCode.start(
                cameraId,
                {
                    fps: 10,    // Optional frame per seconds for qr code scanning
                    qrbox: 300  // Optional if you want bounded box UI
                },
                qrCodeMessage => {
                    playSound('sound1',successSoundUrl);
                    uuidInput.val(qrCodeMessage);
                    uuidInput.trigger('change');
                    html5QrCode.stop().then(ignore => {
                    }).catch(err => {
                        // Stop failed, handle it.
                    });
                },
                errorMessage => {
                    // parse error, ignore it.
                })
                .catch(err => {
                    // Start failed, handle it.
                });
        }
        else {
            window.start_stop = 'stop';
            html5QrCode.stop().then(ignore => {
                playSound('sound1',stopSoundUrl);
            }).catch(err => {
                // Stop failed, handle it.
            });
        }
    });

    /*Chạy Ajax thay đổi nội dung panel thông tin khách mời*/
    let registrationModalConfirmScan = $('#modal_registration_confirm_scan');
    let _postRegistrationIdConfirmScan = $("#_post_registration_id_confirm_scan");
    let divEmailAddressConfirmScan = $("#email_confirm_scan");
    let divFullnameConfirmScan = $("#fullname_confirm_scan");
    let divOrganizationConfirmScan = $("#organization_confirm_scan");
    let divCurrentSponsorConfirmScan = $("#current_sponsor_confirm_scan");
    let divStatusConfirmScan = $("#confirm_scan_status");
    let divStatusConfirmPay = $("#confirm_pay_status");
    let inputRadioConfirmScan = $("#confirm_scan_radio");
    let inputCheckboxConfirmPay = $("#confirm_pay_checkbox");
    let confirmPayLabel = $("#label_confirm_pay");
    let lblConfirmScan = $("#label_confirm_scan");
    let detailDiv = $("#detailDiv");
    let errorDiv = $('#error_div');
    let modalSearchIDCode = $("#modal_input_manually");
    let reader = $("#reader");
    let scanBtnText = $("#scan_btn_text");
    let confirmPayLabelText = $("#confirm_pay_label_text");
    let feeLabelText = $("#fee_text");
    let idCodeText = $("#idcode_confirm_scan");
    let colSotien = $("#col_so_tien");
    let colXacnhanDongtien = $("#col_xac_nhan_dong_tien");
    let colSotienPrint = $("#col_so_tien_print");

    /*Kiểm tra chuỗi IdCode đầu vào có phải ký tự dạng hex không*/
    function is_hex(string) {
        for (const c of string) {
            if ("0123456789ABCDEFabcdef".indexOf(c) === -1) {
                return false;
            }
        }
        return true;
    }

    /*Reset Thông tin chi tiết khách mời*/
    function clearScreen(){
        $('.modal').modal('hide');
        errorDiv.html('');
        errorDiv.addClass('hidden');
        _postRegistrationIdConfirmScan.val(0);
        divEmailAddressConfirmScan.html('');
        divFullnameConfirmScan.html('');
        divOrganizationConfirmScan.html('');
        divCurrentSponsorConfirmScan.html('');
        divStatusConfirmScan.html('');
        divStatusConfirmPay.html('');
        idCodeText.html('');
        feeLabelText.html('');
        confirmPayLabel.removeClass('text-danger');
        confirmPayLabel.addClass('text-muted');
        lblConfirmScan.removeClass('text-success');
        lblConfirmScan.addClass('text-muted');
        inputRadioConfirmScan.uniform({
            radioClass: 'choice',
            wrapperClass: 'border-slate-600 text-slate-800'
        });
        inputCheckboxConfirmPay.uniform({
            radioClass: 'choice',
            wrapperClass: 'border-slate-600 text-slate-800'
        });
        confirmPayLabelText.html('Xác nhận đóng tiền');
        printBtn.addClass('hidden');
        conFirmBtn.addClass('hidden');
        scanBtnText.html('Xác nhận quét mã');
        detailDiv.addClass('hidden');
        if (reader.html().trim()!=''){
            btnStartStopScan.trigger('click');
        }
        inputCheckboxConfirmPay.prop("checked", false);
    }
    uuidInput.on('change', function (event){
        clearScreen();
        let uuid = uuidInput.val();
        if (uuid.length!=6 || !is_hex(uuid)) {
            new PNotify({
                title: 'IDCode không hợp lệ!',
                text: 'Vui lòng kiểm tra lại IDCode, cảm ơn!',
                addclass: 'bg-danger'
            });
        }
        else {
            let formData = new FormData();
            formData.append('uuid', uuid);
            $.ajax({
                url: qrDataURL,
                data: formData,
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                beforeSend: function () {
                    Loading.show();
                },
                type: 'POST',
                dataType: "json",
                contentType: false,
                cache: false,
                processData: false,
                success: function(data) {
                    let confirmBtn = $('#btn_scan_confirm');
                    let printBtn = $('#btn_print');
                    if (data.code === 1) {
                        //console.log(data.messages.original);
                        visitor = data.messages;
                        let result = data.messages.original;
                        _postRegistrationIdConfirmScan.val(result.id);
                        divEmailAddressConfirmScan.html(result.email);
                        divFullnameConfirmScan.html(result.lastname + " " + result.firstname);
                        divOrganizationConfirmScan.html(result.organization);
                        divStatusConfirmScan.html(result.confirm_scan_text);
                        divStatusConfirmPay.html(result.confirm_pay_text);
                        idCodeText.html(result.uuid);

                        let textSponsor = result.sponsor_text;
                        if (result.sponsor_case === 1) {
                            textSponsor = "<span class='text-info'>" + textSponsor + "</span>";
                        } else if (result.sponsor_case === 2) {
                            textSponsor = "ngoài danh sách: <span class='text-danger'>" + textSponsor + "</span>";
                        } else {
                            textSponsor = "<span class='text-success'>" + textSponsor + "</span>";
                        }
                        divCurrentSponsorConfirmScan.html(textSponsor);
                        if (result.confirm_scan_id === 1) {
                            $.uniform.restore(inputRadioConfirmScan);
                            inputRadioConfirmScan.uniform({
                                radioClass: 'choice',
                                wrapperClass: 'border-slate-600 text-slate-800'
                            });
                            lblConfirmScan.removeClass('text-success');
                            lblConfirmScan.addClass('text-muted');
                            inputRadioConfirmScan.attr('disabled', true);
                        } else {
                            $.uniform.restore(inputRadioConfirmScan);
                            inputRadioConfirmScan.uniform({
                                radioClass: 'choice',
                                wrapperClass: 'border-success-600 text-success-800'
                            });
                            lblConfirmScan.removeClass('text-muted');
                            lblConfirmScan.addClass('text-success');
                            inputRadioConfirmScan.attr('disabled', false);
                        }
                        if (result.confirm_pay_id === 1) {
                            $.uniform.restore(inputCheckboxConfirmPay);
                            confirmPayLabel.removeClass('text-success');
                            confirmPayLabel.removeClass('text-primary');
                            confirmPayLabel.addClass('text-muted');
                            inputCheckboxConfirmPay.prop("checked", true);
                            inputCheckboxConfirmPay.prop('disabled', true);
                            inputCheckboxConfirmPay.uniform({
                                radioClass: 'choice',
                                wrapperClass: 'border-slate-600 text-slate-800'
                            });
                        } else {
                            $.uniform.restore(inputCheckboxConfirmPay);
                            confirmPayLabel.removeClass('text-success');
                            confirmPayLabel.removeClass('text-muted');
                            confirmPayLabel.addClass('text-primary');
                            inputCheckboxConfirmPay.prop('disabled', false);
                            inputCheckboxConfirmPay.uniform({
                                radioClass: 'choice',
                                wrapperClass: 'border-primary-600 text-primary-800'
                            });
                        }

                        if (result.confirm_scan_id==2){
                            confirmBtn.removeClass('hidden');
                            if (result.confirm_pay_id===2) {
                                confirmPayLabelText.html('Xác nhận đóng tiền');
                            }
                        } else if (result.confirm_pay_id===2) {
                            scanBtnText.html('Xác nhận đóng tiền');
                            confirmBtn.removeClass('hidden');
                            printBtn.removeClass('hidden');
                            confirmPayLabelText.html('Xác nhận đóng tiền');
                        } else {
                            printBtn.removeClass('hidden');
                        }
                        detailDiv.removeClass('hidden');
                        if (tipsToggleCheckbox.prop("checked") == true){
                            tooltipGroup2.tooltip('show');
                        }
                        feeLabelText.html(result.fee_text);
                        //console.log('vip_visitor = ' + result.vip_visitor);
                        if (result.vip_visitor === 1) {
                            //feeLabelText.html(result.vip_text);
                            inputCheckboxConfirmPay.prop('checked', true);
                            inputCheckboxConfirmPay.prop('disabled', true);
                            //console.log('inputCheckboxConfirmPay = vip_visitor');
                        }
                        $.uniform.update(inputRadioConfirmScan);
                        $.uniform.update(inputCheckboxConfirmPay);
                    } else {
                        errorDiv.html(data.messages);
                        errorDiv.removeClass('hidden');
                    }
                },
                error: function(xhr,status,error){
                    swal({
                        title: "Đã xảy ra lỗi!",
                        text: error,
                        confirmButtonColor: "#2196F3",
                        type: "error"
                    });
                },
                complete: function () {
                    Loading.close();
                }
            });
        }

    });

    /*Ẩn modal tìm kiếm IdCode khi ấn nút Tìm kiếm*/
    let btnConfirmSearch = $('#btn_search_idcode');
    btnConfirmSearch.on('click', function (event) {
        event.preventDefault();
        uuidInput.trigger('change');
    });

    /*Reset modal nhâp tay tìm idcode*/
    modalSearchIDCode.on('show.bs.modal', function(e) {
        clearScreen();
        uuidInput.val('');
    });
    modalSearchIDCode.on('shown.bs.modal', function(e) {
        uuidInput.focus();
    });

    /*Convert time sang dạng format('Y-m-d H:i:s')*/
    function convertTime(d){
        return d.getFullYear() + "-" +
            ("00" + (d.getMonth() + 1)).slice(-2) + "-" +
            ("00" + d.getDate()).slice(-2) + " " +
            ("00" + d.getHours()).slice(-2) + ":" +
            ("00" + d.getMinutes()).slice(-2) + ":" +
            ("00" + d.getSeconds()).slice(-2)
    }
    /*Xác nhận scan / đóng tiền*/
    let conFirmBtn = $('#btn_scan_confirm');
    conFirmBtn.on('click', function (event) {
        event.preventDefault();
        if (scanBtnText.html()=='Xác nhận đóng tiền' && !inputCheckboxConfirmPay.is(':checked')) {
           return new PNotify({
               title: 'Thất bại',
               text: 'Bạn chưa tick chọn checkbox Xác nhận đóng tiền',
               addclass: 'bg-warning'
           });
        }
        var date = new Date();
        let $confirmedRs = 'no';
        if (divStatusConfirmScan.children().html()=='Chưa quét mã') {
            divStatusConfirmScan.html("<span class='text-success'>Quét mã: " + convertTime(date) + "</span>");
        }
        if (inputCheckboxConfirmPay.is(":checked") && divStatusConfirmPay.children().html()=='Chưa đóng tiền') {
            $confirmedRs = 'yes';
            divStatusConfirmPay.html("<span class='text-success'>Đóng tiền: " + convertTime(date) + "</span>");
        }
        let formData = new FormData();
        formData.append('id',_postRegistrationIdConfirmScan.val());
        formData.append('_method','PUT');
        formData.append('confirm_pay',$confirmedRs);
        jQuery.ajax({
            url: confirmScanUrl,
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
                    registrationModalConfirmScan.modal("hide");
                    swal({
                        title: "Bạn có muốn in phiếu thông tin không?",
                        text: "Việc in phiếu không ảnh hưởng đến kết quả xác nhận.",
                        type: "warning",
                        showCancelButton: true,
                        // showLoaderOnConfirm: true,
                        confirmButtonColor: "#EF5350",
                        confirmButtonText: "Có, in giúp nhé! (Y)",
                        cancelButtonText: "Không, cảm ơn! (N)",
                        closeOnConfirm: true,
                        closeOnCancel: true,
                        html: true
                    }, function(isConfirm){
                        if (isConfirm) {
                            printConfirm();
                            // clearScreen();
                            new PNotify({
                                title: 'Thành công',
                                text: 'Bạn chờ lấy phiếu in nhé',
                                addclass: 'bg-info'
                            });
                        }
                        else {
                            new PNotify({
                                title: 'Xác nhận thành công',
                                text: 'Cảm ơn bạn!',
                                addclass: 'bg-success'
                            });
                        }
                    });
                } else {
                    new PNotify({
                        title: data.title,
                        text: data.message,
                        addclass: 'bg-danger'
                    });
                }
            },
            error: function(xhr,status,error){
                //console.log('Lỗi: ' + status + " - " + error);
                new PNotify({
                    title: 'Xác nhận quét mã',
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

    /*In phiếu xác nhận*/
    let printBtn = $("#btn_print");
    printBtn.on('click', function (event){
        printConfirm();
        // clearScreen();
    });

    /*Lệnh in phiếu xác nhận*/
    let confirmName = $("#confirm_name");
    let confirmOrganization = $("#confirm_organization");
    let confirmEmail = $("#confirm_email");
    let confirmSponsor = $("#confirm_sponsor");
    let confirmQrScan = $("#confirm_qr_scan");
    let confirmPayFee = $("#confirm_pay_fee");
    let confirmFeeText = $("#print_fee_text");
    let fullnameSign = $("#fullname_sign");
    function printConfirm() {
        confirmName.html(divFullnameConfirmScan.html());
        confirmOrganization.html(divOrganizationConfirmScan.html());
        confirmEmail.html(divEmailAddressConfirmScan.html());
        confirmSponsor.html(divCurrentSponsorConfirmScan.html());
        confirmQrScan.html(divStatusConfirmScan.html());
        confirmPayFee.html(divStatusConfirmPay.html());
        confirmFeeText.html(feeLabelText.html());
        fullnameSign.html(divFullnameConfirmScan.html());
        printJS({
            printable: 'printDiv',
            type: 'html',
            css: [bootstrapUrl,printCssUrl],
            documentTitle: 'Phiếu xác nhận',
            // font_size: '10pt'
            // scanStyles: false,
            // targetStyles: ['*']
        });
        confirmName.html('');
        confirmOrganization.html('');
        confirmEmail.html('');
        confirmSponsor.html('');
        confirmQrScan.html('');
        confirmPayFee.html('');
        confirmFeeText.html('');
        fullnameSign.html('');
    }

    /*Reset modal scan bằng súng và focus vào input*/
    let modalScanner = $("#modal_scanner");
    let scannerInput = $("#scanner_input");
    modalScanner.on('show.bs.modal', function(e) {
        clearScreen();
        scannerInput.val('');
        // setTimeout(function (){
        //     scannerInput.focus();
        // }, 1000);
    });
    modalScanner.on('shown.bs.modal', function(e) {
        scannerInput.focus();
        //$("[data-toggle='tooltip']").tooltip('toggle');
        ///////////////////////
    });

    /*Chỉ cho phép quét súng, không cho phép nhập tay khi Quét SCANNER*/
    let timeTrace=0;
    scannerInput.on('keypress', function (e) {
        timeTrace==0 ? start=new Date() : end=new Date();
        timeTrace=1;
    });
    scannerInput.on('change', function(){
        if ((typeof end)!='undefined' && (typeof start)!='undefined'){
            timeGap = end.getTime() - start.getTime();
        } else {
            timeGap = 1000;
        }
        timeTrace=0;
        if (timeGap<50){
            uuidInput.val(scannerInput.val());
            modalScanner.modal('hide');
            uuidInput.trigger('change');
        } else {
            modalScanner.modal('hide');
            new PNotify({
                title: 'Dùng sai chức năng!',
                text: 'Vui lòng sử dụng chức năng Nhập IDCode để tìm kiếm.',
                addclass: 'bg-danger'
            });
        }
    });

    /*Hotkeys.js*/
    let btnSearchIDCode = $("#btn_input_manually");
    let btnScanIDCode = $("#btn_use_scanner");
    let btnScanConfirm = $("#btn_scan_confirm");
    hotkeys('ctrl+space,space,ctrl+p,a,q,x,c,y,n,h,esc', function (event, handler){
        switch (handler.key) {
            //kích hoạt quét mã bằng webcam
            case 'ctrl+space': {
                event.preventDefault();
                window.start_stop = 'stop';
                html5QrCode.stop().catch(err => {
                    // Stop failed, handle it.
                });
                if (!($('.modal').is(':visible'))){
                    if (!btnStartStopScan.is(':visible')) {
                        toggleIcon.trigger('click');
                    }
                    btnStartStopScan.trigger('click');
                };
            }
                break;
            //tắt webcam
            case 'space': {
                event.preventDefault();
                if (window.start_stop == 'start') {
                    window.start_stop = 'stop';
                    html5QrCode.stop().catch(err => {
                        // Stop failed, handle it.
                    });
                }
            }
                break;

            //in phiếu xác nhận - chỉ kích hoạt khi đang hiển thị chi tiết khách mời
            case 'ctrl+p': {
                event.preventDefault();
                if (printBtn.is(':visible')){
                    printBtn.trigger('click');
                }
            }
                break;
            //hiển thị modal nhập tay tìm idcode
            case 'a': {
                event.preventDefault();
                if (btnSearchIDCode.is(':visible') && !($('.modal').is(':visible'))){
                    btnSearchIDCode.trigger("click");
                }
            }
                break;
            //Hiển thị modal quét mã bằng súng
            case 'q': {
                event.preventDefault();
                if (btnScanIDCode.is(':visible') && !($('.modal').is(':visible'))){
                    btnScanIDCode.trigger("click");
                }
            }
                break;
            //Check/uncheck checkbox Xác nhận đóng tiền
            case 'x': {
                event.preventDefault();
                if (inputCheckboxConfirmPay.is(':visible') && !($('.modal').is(':visible'))){
                    inputCheckboxConfirmPay.trigger("click");
                }
            }
                break;
            //Check/uncheck checkbox Hiển thị thông tin phím tắt
            case 'h': {
                event.preventDefault();
                tipsToggleCheckbox.trigger("click");
            }
                break;
            //Xác nhận quét mã, đóng tiền
            case 'c': {
                event.preventDefault();
                if (btnScanConfirm.is(':visible') && !($('.modal').is(':visible'))){
                    btnScanConfirm.trigger("click");
                }
            }
                break;
            //Các nút swal cancel
            case 'n': {
                event.preventDefault();
                if ($('.cancel').is(':visible')){
                    $('.cancel').trigger("click");
                }
            }
                break;
            //Các nút swal confirm
            case 'y': {
                event.preventDefault();
                if ($('.confirm').is(':visible')){
                    $('.confirm').trigger("click");
                }
            }
                break;
            case 'esc': {
                event.preventDefault();
                if (btnStartStopScan.is(':visible')) {
                    toggleIcon.trigger('click');
                }
                if ($('.modal').is(':visible')) {
                    $('.modal').modal('hide');
                }
            }
                break;
            default: alert(event);
        }
    });
    scannerInput.on('keydown', function (e) {
        if (e.keyCode == 27){
            modalScanner.modal('hide');
        }
    });

    //Chỉ cho phép nhập ký tự hex hoặc copy, paste
    uuidInput.on('keydown', function (e) {
        //console.log(e);
        //Mảng các ký tự hex, shift, ctrl, và v để copy paste
        let hexChar = [48,49,50,51,52,53,54,55,56,57,96,97,98,99,100,101,102,103,104,105,65,66,67,68,69,70,16,8];
        if (e.keyCode == 27){
            //Ẩn khi bấm Esc
            modalSearchIDCode.modal('hide');
        }
        else if (e.keyCode == 13) {
            //Tìm kiếm khi bấm enter
            btnConfirmSearch.trigger("click");
        }
        else if (e.ctrlKey == true) {
            //cho phép copy, paste
            if (e.keyCode == 67 || e.keyCode == 86){
                return true;
            }
            return false;
        }
        else if (e.shiftKey == true) {
            //cho phép copy, paste
            if (e.keyCode<=70 && e.keyCode>=65){
                return true;
            }
            return false;
        }
        else {
            //Chỉ cho phép ký tự hex hoặc copy, paste
            return (hexChar.includes(e.keyCode));
        }
    });

    /*Toggle thông tin phím tắt*/
    let tipsToggleCheckbox = $('#tips_toggle_checkbox');
    let tooltipGroup1 = $("#panelCreate [data-toggle='tooltip'],#button_panel [data-toggle='tooltip']");
    let tooltipGroup2 = $("#detailDiv [data-toggle='tooltip']");
    let tooltipGroup3 = $(".modal [data-toggle='tooltip']");
    tipsToggleCheckbox.click(function(){
        if($(this).prop("checked") == true){
            tooltipGroup1.tooltip('show');
            if (detailDiv.is(':visible')) {
                tooltipGroup2.tooltip('show');
            }
            if ($('.modal').is(':visible')) {
                tooltipGroup3.tooltip('show');
                tooltipGroup1.tooltip('hide');
                tooltipGroup1.tooltip('hide');
            }
        }
        else {
            $("[data-toggle='tooltip']").tooltip('hide');
        }
    });

    //Xử lý ẩn hiện phím tắt cho các modal
    $('.modal').on('hide.bs.modal',function () {
        if (tipsToggleCheckbox.prop("checked") == true)  {
            tooltipGroup1.tooltip('show');
            tooltipGroup2.tooltip('show');
        }
    });
    $('.modal').on('show.bs.modal',function () {
        if (tipsToggleCheckbox.prop("checked") == true)  {
            tooltipGroup1.tooltip('hide');
            tooltipGroup2.tooltip('hide');
        }
    });
    $('.modal').on('shown.bs.modal',function () {
        if (tipsToggleCheckbox.prop("checked") == true)  {
            tooltipGroup3.tooltip('show');
        }
    });

    /*Xử lý ẩn hiện phím tắt cho pannel quét camera*/
    toggleIcon.on('click', function () {
        if (tipsToggleCheckbox.prop("checked") == true)  {
            if (btnStartStopScan.is(':visible')) {
                tooltipGroup1.tooltip('show');
            }
        }
    });
    tipsToggleCheckbox.trigger('click');
});