// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict';
    function presentYesNo() {
        if (document.getElementById('present_yes').checked) {
            document.getElementById('presentation_title').setAttribute('required', true);
        } else {
            document.getElementById('presentation_title').removeAttribute('required');
        }
    }
    function sponsorYesNo() {
        if (document.getElementById('sp_company').value === 'OK') {
            document.getElementById('other_company').setAttribute('required', true);
        } else {
            document.getElementById('other_company').removeAttribute('required');
        }
    }
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        var birthday = document.getElementById('birthday');
        var iddate = document.getElementById('iddate');
        var previewButton = document.getElementById('preview_button');
        document.getElementById('present_yes').addEventListener("change", presentYesNo);
        document.getElementById('present_no').addEventListener("change", presentYesNo);
        document.getElementById('sp_company').addEventListener("change", sponsorYesNo);

        // Loop over them and prevent submission
        Array.prototype.filter.call(forms, function (form) {
            previewButton.addEventListener('click', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                if (iddate.value.trim().length < 1) {
                    event.preventDefault();
                    event.stopPropagation();
                    alert("Vui lòng chọn ngày cấp CMND / CCCD!");
                }
                if (birthday.value.trim().length < 1) {
                    event.preventDefault();
                    event.stopPropagation();
                    alert("Vui lòng chọn ngày sinh!");
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
}());