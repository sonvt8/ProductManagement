$(function () {
    // Default file input style
    $(".file-styled").uniform({
        fileButtonClass: 'action btn btn-default'
    });

    /*Tạo DataTable danh sách người dùng*/
    $.extend( $.fn.dataTable.defaults, {
        autoWidth: false,
        order: [[3, "asc"]],
        columnDefs: [],
        dom: '<"datatable-header"fBl><"datatable-scroll-wrap"t><"datatable-footer"ip>',
        language: {
            search: '<span>Tìm trong bảng:</span> _INPUT_',
            searchPlaceholder: 'gõ từ khóa để tìm...',
            lengthMenu: '<span>Hiển thị:</span> _MENU_',
            paginate: { 'first': 'Đầu', 'last': 'Cuối', 'next': '&rarr;', 'previous': '&larr;' }
        },
        drawCallback: function () {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
        },
        preDrawCallback: function() {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
        }
    });
    window.tableRegis = $('#manage_user_table_1').DataTable({
        processing: true,
        serverSide: true,
        "pageLength": pageLength,
        ajax: {
            url: userDataURL,
            type:'POST',
            headers:{"X-CSRF-Token" : $('meta[name="csrf-token"]').attr('content')}
        },
        buttons: [
            {
                text: '<i class="icon-add-to-list text-green position-left"></i>  Thêm mới',
                className: 'btn btn-default',
                action: function ( e, dt, node, config ) {
                    $("#create_user_modal").modal('show');
                }
            },
            {
                text: '<i class="icon-file-spreadsheet2 text-green position-left"></i>  Export',
                className: 'btn btn-default',
                extend: 'excelHtml5',
                filename: function () {
                    let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                    let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
                    let d = localISOTime.replace('T', '-').replace(/\..*$/, '');
                    return "Danh_sach_nguoi_dung_" + d;
                },
                exportOptions: {
                    columns: ':visible:not(.not-export-col)'
                }
            },
            {
                extend: 'colvis',
                text: '<i class="icon-three-bars"></i> <span class="caret"></span>',
                className: 'btn bg-teal btn-icon'
            }
        ],
        columnDefs: [
            {
                orderable: false,
                targets: 0,
            }
        ],
        select: {
            style: 'multi',
            selector: 'td:first-child'
        },
        columns: [
            { data: 'action', name: 'action', orderable:false, searchable: false },
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable:false, searchable: false, visible: Boolean(settingSequence)},
            { data: 'id', name: 'id', visible: false},
            { data: 'name', name: 'name', visible: Boolean(settingName)},
            { data: 'username', name: 'username', visible: true},
            { data: 'email', name: 'email', visible: false},
            { data: 'gender_text', name: 'gender', visible: Boolean(settingGender)},
            { data: 'title', name: 'title', visible: true},
            { data: 'phone_number', name: 'phone_number', visible: false},
            { data: 'birthday', name: 'birthday', visible: false},
            { data: 'active_text', name: 'active_text', visible: true},
            { data: 'role_text', name: 'role_text', visible: true},
            { data: 'team_text', name: 'team_text', visible: true},
            { data: 'manager_text', name: 'manager_text', visible: false},
            { data: 'email_verified_text', name: 'email_verified_text', visible: false},
            { data: 'updated_text', name: 'updated_at', visible: false},
            { data: 'created_text', name: 'created_at', visible: false},
            { data: 'editor', name: 'editor', visible: false},
            { data: 'note', name: 'note', visible: Boolean(settingNote)},
        ],
        // settingRowOptListStr
        "oLanguage": {
            "sLengthMenu": "Hiển thị _MENU_ dòng mỗi trang",
            "sZeroRecords": "Không tìm thấy dữ liệu",
            "sInfo": "Hiển thị từ _START_ đến _END_ trong tổng _TOTAL_ dòng",
            "sInfoEmpty": "Hiển thị từ 0 đến 0 trong tổng 0 dòng",
            "sInfoFiltered": "(lọc từ tổng số _MAX_ dòng)",
            "select": {
                rows: {
                    _: "%d dòng được chọn",
                    0: "",
                    // 1: "Selected 1 row"
                },
            }
        }
    });

    /*Validate confirm password*/
    function validatePassword(pw, cpw){
        if(pw.value != cpw.value) {
            cpw.setCustomValidity("Mật khẩu không khớp!");
        } else {
            cpw.setCustomValidity('');
        }
    }
    // Khi tạo người dùng mới
    let password = document.getElementById("create_password");
    let confirmPassword = document.getElementById("create_confirm_password");
    password.onchange = function (){validatePassword(password, confirmPassword)};
    confirmPassword.onkeyup = function (){validatePassword(password, confirmPassword)};

    //Khi đổi mật khẩu người dùng khác
    let newPassword = document.getElementById("pw_user_new");
    let newConfirmPassword = document.getElementById("pw_user_new_confirm");
    newPassword.onchange = function (){validatePassword(newPassword, newConfirmPassword)};
    newConfirmPassword.onkeyup = function (){validatePassword(newPassword, newConfirmPassword)};

    /*Lấy thông tin cho select2 chọn ban*/
    $('#create_team, #edit_user_team, #team_select').select2({
        ajax: {
            url: allTeamUrl,
            dataType: 'json',
            method: "post",
            delay: 250,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: function(params){
                return {
                    q: params.term,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                let rArray = [];
                rArray.push({
                    text: 'Khác',
                    children: [{
                        id: '0',
                        text: 'Chưa có ban'
                    }]
                });
                rArray.push({
                    text: 'Ban',
                    children: $.map(data.data, function (item) {
                        let str = "";
                        if (item.shortname) str += item.shortname + " - ";
                        if (item.name) str += item.name;
                        return {
                            text: str,
                            id: item.id,
                        }
                    })
                });
                params.page = params.page || 1;
                return {
                    results: rArray,
                    pagination: {
                        more: (params.page * 20) < data.total
                    }
                };
            },
            cache: true
        },
        placeholder: 'Chọn ban...',
        templateResult: function (repo) {
            if(repo.loading) return repo.text;
            let markup = repo.text;
            return markup;
        },
        templateSelection: function(repo) {
            return repo.text;
        },
        escapeMarkup: function(markup){ return markup; }
    });

    /*Lấy thông tin cho select2 chọn vai trò*/
    $('#create_role, #role_user_new').select2({
        ajax: {
            url: allRoleUrl,
            dataType: 'json',
            method: "post",
            delay: 250,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: function(params){
                return {
                    q: params.term,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                let rArray = [];
                $.map(data.data, function (item) {
                    let str = "";
                    if (item.display_name) {
                        str = item.display_name
                    } else {
                        if (item.name) {
                            str = item.name
                        } else str = item.id;
                    }
                    return rArray.push( {
                        text: str,
                        id: item.id,
                    })
                });
                params.page = params.page || 1;
                return {
                    results: rArray,
                    pagination: {
                        more: (params.page * 20) < data.total
                    }
                };
            },
            cache: true
        },
        placeholder: 'Chọn vai trò...',
        templateResult: function (repo) {
            if(repo.loading) return repo.text;
            let markup = repo.text;
            return markup;
        },
        templateSelection: function(repo) {
            return repo.text;
        },
        escapeMarkup: function(markup){ return markup; }
    });

    /*Lấy thông tin cho select2 chọn Người quản lý*/
    $('#create_manager, #edit_user_manager').select2({
        ajax: {
            url: allManagerUrl,
            dataType: 'json',
            method: "post",
            delay: 250,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            data: function(params){
                return {
                    q: params.term,
                    page: params.page
                };
            },
            processResults: function (data, params) {
                let rArray = [];
                rArray.push({
                    text: 'Khác',
                    children: [{
                        id: '0',
                        text: 'Chưa có người quản lý'
                    }]
                });
                rArray.push({
                    text: 'Người quản lý',
                    children: $.map(data.data, function (item) {
                        let str = "";
                        if (item.name) {
                            str = item.name
                        } else {
                            if (item.username) {
                                str = item.username
                            } else str = item.email;
                        }
                        return {
                            text: str,
                            id: item.id,
                        }
                    })
                });
                params.page = params.page || 1;
                return {
                    results: rArray,
                    pagination: {
                        more: (params.page * 20) < data.total
                    }
                };
            },
            cache: true
        },
        placeholder: 'Chọn người quản lý...',
        templateResult: function (repo) {
            if(repo.loading) return repo.text;
            let markup = repo.text;
            return markup;
        },
        templateSelection: function(repo) {
            return repo.text;
        },
        escapeMarkup: function(markup){ return markup; }
    });

    /*Lưu thông tin user khi thêm mới*/
    let userCreateModal = $('#create_user_modal');
    let userCreateForm = $('#create_user_form');
    let userStoreURL = $('#create_user_url').val();
    userCreateForm.submit(function(event) {
        event.preventDefault();
        // console.log(imgInput.val());
        // console.log(cropper.getCroppedCanvas().toDataURL());
        // let userImgData = cropper.getCroppedCanvas().toDataURL();
        let userFullName = $('#create_name').val();
        // let userName = $('#create_username').val();
        let userPassword = $('#create_password').val();
        let confirmPassword = $('#create_confirm_password').val();
        let userEmail = $('#create_email').val();
        let userPhone = $('#create_phone_number').val();
        let userTeam = $('#create_team').val();
        let userRole = $('#create_role').val();
        // let userManager = $('#create_manager').val();
        let userTitle = $('#create_title').val();
        let userNote = $('#user_note').val();
        let userBirthday = $('#user_birthday').val();
        // let activeMethod = $('#activation_method_1').is(':checked')? $('#activation_method_1').val() : $('#activation_method_2').val();
        let gender = 0;
        if ($('#gender_male').is(':checked')) $('#gender_male').val();
        if ($('#gender_female').is(':checked')) $('#gender_female').val();
        let formData = new FormData();
        formData.append('name',userFullName);
        // formData.append('username',userName);
        formData.append('password',userPassword);
        formData.append('confirmPassword',confirmPassword);
        formData.append('email',userEmail);
        formData.append('phone_number',userPhone);
        // formData.append('active',activeMethod);
        formData.append('gender',gender);
        formData.append('team_id',userTeam);
        formData.append('role_id',userRole);
        // formData.append('parent_id',userManager);
        formData.append('title',userTitle);
        formData.append('note',userNote);
        formData.append('birthday',userBirthday);
        // formData.append('avatar',userImgData);
        jQuery.ajax({
            url: userStoreURL,
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
                    $("#manage_user_table_1").DataTable().ajax.reload(null,false);
                    swal({
                        title: "Thành công!",
                        text: data.messages,
                        confirmButtonColor: "#66BB6A",
                        type: "success"
                    });
                } else if (data.code === 3) {
                    new PNotify({
                        title: 'Tạo mới người dùng',
                        text: data.messages,
                        addclass: 'bg-warning'
                    });
                } else {
                    new PNotify({
                        title: 'Tạo mới người dùng',
                        text: data.messages,
                        addclass: 'bg-danger'
                    });
                }
            },
            error: function(xhr,status,error){
                console.log('Lỗi: ' + status + " - " + error);
                new PNotify({
                    title: 'Tạo mới người dùng',
                    text: status + ": " + error,
                    addclass: 'bg-danger'
                });
                Loading.close();
            },
            complete: function(xhr, textStatus) {
                userCreateModal.modal("hide");
                Loading.close();
            }
        });
    });

    /*Reset modal thêm mới*/
    userCreateModal.on('hide.bs.modal', function(e) {
        resetUserCreateModal.trigger('click');
    });

    /*Clear modal Thêm mới khi ấn nút reset*/
    let resetUserCreateModal = $('#create_user_modal button[type="reset"]');
    resetUserCreateModal.click(function () {
        userCreateForm.trigger('reset');
        // previewDiv.addClass('hidden');
        // image.attr("src", defaultAvatarUrl);
        // if (cropper) {
        //     cropper.replace(defaultAvatarUrl);
        // }
        // $(".file-styled").uniform({
        //     fileButtonClass: 'action btn btn-default'
        // });
        // imgInput.val(null);
        $("#create_team").val("").trigger("change");
        $("#create_role").val("").trigger("change");
        $("#create_manager").val("").trigger("change");
    });

    /*Xóa người dùng*/
    $('#manage_user_table_1').on('click','.user-del-btn',function(event) {
        event.preventDefault();
        let myDataId  = $(this).data('id');
        swal({
            title: "Bạn chắc chứ?",
            text: "Dữ liệu bị xóa sẽ không thể phục hồi!\n"
                + 'Người dùng chỉ bị xóa khi không quản lý người dùng nào khác.',
            type: "warning",
            showCancelButton: true,
            showLoaderOnConfirm: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: "Vâng, xóa nhé!",
            cancelButtonText: "Không, để xem lại!",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function(isConfirm){
            if (isConfirm) {
                let formData = new FormData();
                formData.append('id',myDataId);
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                $.ajax({
                    url: destroyUserURL,
                    data: formData,
                    beforeSend: function () {},
                    type: 'POST',
                    dataType: "json",
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function(data) {
                        if (data.code === 1) {
                            $('#manage_user_table_1').DataTable().ajax.reload(null,false);
                            swal({
                                title: "Đã xóa!",
                                text: data.messages,
                                confirmButtonColor: "#66BB6A",
                                type: "success"
                            });
                        } else {
                            swal({
                                title: "Không xóa được!",
                                text: data.messages,
                                confirmButtonColor: "#2196F3",
                                type: "error"
                            });
                        }
                    },
                    error: function(xhr,status,error){
                        swal({
                            title: "Không thể xóa!",
                            text: error,
                            confirmButtonColor: "#2196F3",
                            type: "error"
                        });
                    }
                });
            }
            else {
                swal({
                    title: "Hủy xóa",
                    text: "Cẩn thận là trên hết. Cảm ơn!",
                    confirmButtonColor: "#2196F3",
                    type: "info"
                });
            }
        });
    });

    /*Hiển thị thông tin người dùng trước khi Thay đổi tình trạng*/
    let activeUserModal = $('#active_user_modal');
    let activeUserId = $('#active_user_id');
    let activeUserName = $('#active_user_name');
    // let activeUserUsername = $('#active_user_username');
    let activeUserEmail = $('#active_user_email');
    let activeUserCurrent = $('#active_user_current');
    activeUserModal.on('show.bs.modal', function(e) {
        document.getElementById("active_user_form").reset();
        let myDataId  = $(e.relatedTarget).data('id');
        let myRouteEdit = editUserURL;
        let formData = new FormData();
        formData.append('id',myDataId);
        $.ajax({
            url: myRouteEdit,
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
            success: function(result) {
                activeUserId.val(result.id);
                activeUserName.html(result.name);
                // activeUserUsername.val(result.username);
                activeUserEmail.html(result.email);
                (result.active==1)? activeUserCurrent.html('Active') : activeUserCurrent.html('Inactive');
                (result.active==1)? $('#active_user_2').prop( "selected", true ) : $('#active_user_1').prop( "selected", true );
                activeUserId.prop( "disabled", true );
            },
            error: function(jqxhr, status, exception) {
                console.log('Exception: '+ exception);
                Loading.close();
            },
            complete: function(xhr, textStatus) {
                Loading.close();
            }
        });
    });

    /*Reset modal thay đổi tình trạng*/
    activeUserModal.on('hidden.bs.modal', function(e) {
        activeUserId.val('');
        activeUserName.val('');
        // activeUserUsername.val('');
        activeUserEmail.val('');
        $('#active_user_2').prop( "selected", false );
        $('#active_user_1').prop( "selected", false );
        activeUserId.prop( "disabled", false );
    });

    /*Thay đổi tình trạng người dùng*/
    let activeUserForm = $('#active_user_form');
    let newActive = $('#active_user_new');
    function doActivate(id, active) {
        let formData = new FormData();
        formData.append('id', id);
        formData.append('active',active);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            url: activeUserURL,
            data: formData,
            beforeSend: function () {},
            type: 'POST',
            dataType: "json",
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                if (data.code === 1) {
                    $('#manage_user_table_1').DataTable().ajax.reload(null,false);
                    new PNotify({
                        title: 'Thành công',
                        text: data.messages,
                        addclass: 'bg-success'
                    });
                } else {
                    new PNotify({
                        title: 'Thất bại',
                        text: data.messages,
                        addclass: 'bg-warning'
                    });
                }
            },
            error: function(xhr,status,error){
                new PNotify({
                    title: 'Đã có lỗi xảy ra',
                    text: data.messages,
                    addclass: 'bg-error'
                });
            }
        });
    }
    activeUserForm.submit(function(event) {
        event.preventDefault();
        activeUserModal.modal('hide');

        let myDataId  = $('#active_user_id').val();
        let active = newActive.val();
        if (active == 2){
            swal({
                title: "Bạn chắc chứ?",
                text: 'Người dùng chỉ bị tạm ngưng khi không quản lý người dùng nào khác!',
                type: "warning",
                showCancelButton: true,
                showLoaderOnConfirm: true,
                confirmButtonColor: "#EF5350",
                confirmButtonText: "Vâng, tạm ngưng nhé!",
                cancelButtonText: "Không, để xem lại!",
                closeOnConfirm: true,
                closeOnCancel: false
            }, function(isConfirm){
                if (isConfirm) {
                    doActivate(myDataId,active);
                }
                else {
                    swal({
                        title: "Đã hủy!",
                        text: "Cẩn thận là trên hết. Cảm ơn!",
                        confirmButtonColor: "#2196F3",
                        type: "info"
                    });
                }
            });
        } else {
            doActivate(myDataId,active);
        }

    });

    /*Hiển thị thông tin người dùng trước khi Thay đổi mật khẩu*/
    let pwUserModal = $('#pw_user_modal');
    let pwUserId = $('#pw_user_id');
    let pwUserName = $('#pw_user_name');
    // let pwUserUsername = $('#pw_user_username');
    let pwUserEmail = $('#pw_user_email');
    pwUserModal.on('show.bs.modal', function(e) {
        document.getElementById("pw_user_form").reset();
        let myDataId  = $(e.relatedTarget).data('id');
        let myRouteEdit = editUserURL;
        let formData = new FormData();
        formData.append('id',myDataId);
        $.ajax({
            url: myRouteEdit,
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
            success: function(result) {
                pwUserId.val(result.id);
                pwUserName.html(result.name);
                // pwUserUsername.val(result.username);
                pwUserEmail.html(result.email);
                pwUserId.prop( "disabled", true );
            },
            error: function(jqxhr, status, exception) {
                console.log('Exception: '+ exception);
                Loading.close();
            },
            complete: function(xhr, textStatus) {
                Loading.close();
            }
        });
    });

    /*Reset modal thay đổi mật khẩu*/
    pwUserModal.on('hidden.bs.modal', function(e) {
        pwUserId.val('');
        pwUserName.html('');
        // pwUserUsername.val('');
        pwUserEmail.html('');
        pwUserId.prop( "disabled", false );
    });

    /*Thay đổi mật khẩu người dùng*/
    let pwUserForm = $('#pw_user_form');
    pwUserForm.submit(function(event) {
        event.preventDefault();
        pwUserModal.modal('hide');
        let myDataId  = $('#pw_user_id').val();
        let userPw  = $('#pw_user_new').val();
        swal({
            title: "Bạn chắc chứ?",
            text: 'Mật khẩu đã thay đổi sẽ không thể phục hồi lại!',
            type: "warning",
            showCancelButton: true,
            showLoaderOnConfirm: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: "Vâng, thay đổi nhé!",
            cancelButtonText: "Không, để xem lại!",
            closeOnConfirm: true,
            closeOnCancel: false
        }, function(isConfirm){
            if (isConfirm) {
                let formData = new FormData();
                formData.append('id', myDataId);
                formData.append('pw', userPw);
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                $.ajax({
                    url: changePwUrl,
                    data: formData,
                    beforeSend: function () {},
                    type: 'POST',
                    dataType: "json",
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function(data) {
                        if (data.code === 1) {
                            $('#manage_user_table_1').DataTable().ajax.reload(null,false);
                            new PNotify({
                                title: 'Thành công',
                                text: data.messages,
                                addclass: 'bg-success'
                            });
                        } else {
                            new PNotify({
                                title: 'Thất bại',
                                text: data.messages,
                                addclass: 'bg-warning'
                            });
                        }
                    },
                    error: function(xhr,status,error){
                        new PNotify({
                            title: 'Đã có lỗi xảy ra',
                            text: data.messages,
                            addclass: 'bg-error'
                        });
                    }
                });
            }
            else {
                swal({
                    title: "Đã hủy!",
                    text: "Cẩn thận là trên hết. Cảm ơn!",
                    confirmButtonColor: "#2196F3",
                    type: "info"
                });
            }
        });
    });

    /*Hiển thị thông tin người dùng trước khi Thay đổi Vai trò*/
    let roleUserModal = $('#role_user_modal');
    let roleUserId = $('#role_user_id');
    let roleUserName = $('#role_user_name');
    // let roleUserUsername = $('#role_user_username');
    let roleUserEmail = $('#role_user_email');
    let roleUserCurrentRole = $('#role_user_current_role');
    let roleUserNewRole = $('#role_user_new');
    roleUserModal.on('show.bs.modal', function(e) {
        document.getElementById("role_user_form").reset();
        let myDataId  = $(e.relatedTarget).data('id');
        let myRouteEdit = editUserURL;
        let formData = new FormData();
        formData.append('id',myDataId);
        $.ajax({
            url: myRouteEdit,
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
            success: function(result) {
                roleUserId.val(result.id);
                roleUserName.html(result.name);
                // roleUserUsername.val(result.username);
                roleUserEmail.html(result.email);
                roleUserCurrentRole.html(result.role_text);
                roleUserNewRole.append(new Option(result.role_text, result.role_id, false, true));
                roleUserId.prop( "disabled", true );
            },
            error: function(jqxhr, status, exception) {
                console.log('Exception: '+ exception);
                Loading.close();
            },
            complete: function(xhr, textStatus) {
                Loading.close();
            }
        });
    });

    /*Reset modal thay đổi Vai trò*/
    roleUserModal.on('hidden.bs.modal', function(e) {
        roleUserId.val('');
        roleUserName.html('');
        // roleUserUsername.val('');
        roleUserEmail.html('');
        roleUserCurrentRole.html('');
        roleUserId.prop( "disabled", false );
    });

    /*Thay đổi vai trò người dùng*/
    let roleUserForm = $('#role_user_form');
    let newRole = $('#role_user_new');
    roleUserForm.submit(function(event) {
        event.preventDefault();
        roleUserModal.modal('hide');
        let myDataId  = $('#role_user_id').val();
        let roleId = newRole.val();
        let roleUserURL = $('#role_user_url').val();
        swal({
            title: "Bạn chắc chứ?",
            text: 'Khi vai trò thay đổi thì phân quyền cũng thay đổi theo!',
            type: "warning",
            showCancelButton: true,
            showLoaderOnConfirm: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: "Vâng, thay đổi nhé!",
            cancelButtonText: "Không, để xem lại!",
            closeOnConfirm: true,
            closeOnCancel: false
        }, function(isConfirm){
            if (isConfirm) {
                let formData = new FormData();
                formData.append('id', myDataId);
                formData.append('role',roleId);
                $.ajaxSetup({
                    headers: {
                        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                    }
                });
                $.ajax({
                    url: roleUserURL,
                    data: formData,
                    beforeSend: function () {},
                    type: 'POST',
                    dataType: "json",
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function(data) {
                        if (data.code === 1) {
                            $('#manage_user_table_1').DataTable().ajax.reload(null,false);
                            new PNotify({
                                title: 'Thành công',
                                text: data.messages,
                                addclass: 'bg-success'
                            });
                        } else {
                            new PNotify({
                                title: 'Thất bại',
                                text: data.messages,
                                addclass: 'bg-warning'
                            });
                        }
                    },
                    error: function(xhr,status,error){
                        new PNotify({
                            title: 'Đã có lỗi xảy ra',
                            text: data.messages,
                            addclass: 'bg-error'
                        });
                    }
                });
            }
            else {
                swal({
                    title: "Đã hủy!",
                    text: "Cẩn thận là trên hết. Cảm ơn!",
                    confirmButtonColor: "#2196F3",
                    type: "info"
                });
            }
        });
    });

    /*Hiển thị thông tin người dùng trước khi Chỉnh sửa*/
    let editUserModal = $('#edit_user_modal');
    let editUserId = $('#edit_user_id');
    let editUserName = $('#edit_user_name');
    // let editUserUsername = $('#edit_user_username');
    let editUserEmail = $('#edit_user_email');
    let editUserPhone = $('#edit_user_phone');
    let editUserBirthday = $('#edit_user_birthday');
    let editUserTitle = $('#edit_user_title');
    let editUserTeam = $('#edit_user_team');
    let editUserManager = $('#edit_user_manager');
    let editUserNote = $('#edit_user_note');
    editUserModal.on('show.bs.modal', function(e) {
        document.getElementById("edit_user_form").reset();
        let myDataId  = $(e.relatedTarget).data('id');
        let myRouteEdit = editUserURL;
        let formData = new FormData();
        formData.append('id',myDataId);
        $.ajax({
            url: myRouteEdit,
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
            success: function(result) {
                editUserId.val(result.id);
                editUserName.val(result.name);
                // editUserUsername.val(result.username);
                editUserEmail.html(result.email);
                editUserPhone.val(result.phone_number);
                editUserBirthday.val(result.birthday);
                editUserTitle.val(result.title);
                editUserNote.val(result.note);
                if (result.gender == 1) $('#edit_user_gender_male').prop( "checked", true );
                if (result.gender == 2) $('#edit_user_gender_female').prop( "checked", true );
                if (result.team_id !='')  {
                    editUserTeam.append(new Option(result.team_text, result.team_id, false, true));
                } else {
                    editUserTeam.append(new Option('Chưa phân ban', 0, false, true));
                };
                if (result.parent_id !='')  {
                    editUserManager.append(new Option(result.parent_text, result.parent_id, false, true));
                } else {
                    editUserManager.append(new Option('Chưa có người quản lý', 0, false, true));
                }
            },
            error: function(jqxhr, status, exception) {
                console.log('Exception: '+ exception);
                Loading.close();
            },
            complete: function(xhr, textStatus) {
                Loading.close();
            }
        });
    });

    /*Reset modal Chỉnh sửa*/
    editUserModal.on('hidden.bs.modal', function(e) {
        editUserId.val('');
        editUserName.val('');
        // editUserUsername.val('');
        editUserEmail.html('');
        editUserPhone.val('');
        editUserBirthday.val('');
        editUserTitle.val('');
        editUserNote.val('');
        $('#edit_user_gender_male').prop( "checked", false );
        $('#edit_user_gender_female').prop( "checked", false );
        editUserTeam.empty();
        editUserManager.empty();
    });

    /*Lưu thông tin user khi Chỉnh sửa*/
    let userUpdateURL = $('#update_user_url').val();
    let userUpdateForm = $('#edit_user_form');
    userUpdateForm.submit(function(event) {
        event.preventDefault();
        let gender = 0;
        if($('#edit_user_gender_male').is(':checked')) gender = $('#edit_user_gender_male').val();
        if($('#edit_user_gender_female').is(':checked')) gender = $('#edit_user_gender_female').val();
        let formData = new FormData();
        formData.append('id', editUserId.val());
        formData.append('name',editUserName.val());
        // formData.append('username',editUserUsername.val());
        formData.append('email',editUserEmail.html());
        formData.append('phone_number',editUserPhone.val());
        formData.append('birthday',editUserBirthday.val());
        formData.append('gender',gender);
        formData.append('title',editUserTitle.val());
        formData.append('team_id',editUserTeam.val());
        formData.append('parent_id',editUserManager.val());
        formData.append('note',editUserNote.val());
        jQuery.ajax({
            url: userUpdateURL,
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
                    $("#manage_user_table_1").DataTable().ajax.reload(null,false);
                    swal({
                        title: "Thành công!",
                        text: data.messages,
                        confirmButtonColor: "#66BB6A",
                        type: "success"
                    });
                } else if (data.code === 3) {
                    new PNotify({
                        title: 'Chỉnh sửa thông tin người dùng',
                        text: data.messages,
                        addclass: 'bg-warning'
                    });
                } else {
                    new PNotify({
                        title: 'Chỉnh sửa thông tin người dùng',
                        text: data.messages,
                        addclass: 'bg-danger'
                    });
                }
                Loading.close();
            },
            error: function(xhr,status,error){
                console.log('Lỗi: ' + status + " - " + error);
                new PNotify({
                    title: 'Chỉnh sửa thông tin người dùng',
                    text: status + ": " + error,
                    addclass: 'bg-danger'
                });
                Loading.close();
            },
            complete: function(xhr, textStatus) {
                editUserModal.modal("hide");
                // document.getElementById("edit_user_form").reset();
                userUpdateForm.trigger('reset');
                $(".file-styled").uniform({
                    fileButtonClass: 'action btn btn-default'
                });
                Loading.close();
            }
        });
    });

    /*Hiển thị thông tin người dùng trước khi Thay đổi Avatar*/
    let avatarUserModal = $('#avatar_user_modal');
    let avatarUserId = $('#avatar_user_id');
    let avatarUserName = $('#avatar_user_name');
    // let avatarUserUsername = $('#avatar_user_username');
    let avatarUserEmail = $('#avatar_user_email');
    let avatarUserCurrent = $('#avatar_user_current');
    let avatarUserNew = $('#avatar_user_new');
    avatarUserModal.on('show.bs.modal', function(e) {
        document.getElementById("avatar_user_form").reset();
        let myDataId  = $(e.relatedTarget).data('id');
        let myRouteEdit = editUserURL;
        let formData = new FormData();
        formData.append('id',myDataId);
        $.ajax({
            url: myRouteEdit,
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
            success: function(result) {
                avatarUserId.val(result.id);
                avatarUserName.html(result.name);
                // avatarUserUsername.val(result.username);
                avatarUserEmail.html(result.email);
                avatarUserCurrent.attr("src", publicDr +'/' +result.avatar);
                avatarUserId.prop( "disabled", true );
            },
            error: function(jqxhr, status, exception) {
                console.log('Exception: '+ exception);
                Loading.close();
            },
            complete: function(xhr, textStatus) {
                Loading.close();
            }
        });
    });

    /*Reset modal thay đổi Avatar*/
    avatarUserModal.on('hidden.bs.modal', function(e) {
        avatarUserId.val('');
        avatarUserName.html('');
        // avatarUserUsername.val('');
        avatarUserEmail.html('');
        avatarUserCurrent.attr("src", '');
        avatarUserId.prop( "disabled", false );
        imgUpdatePreviewDiv.addClass('hidden');
        newAvatar.attr("src", defaultAvatarUrl);
        if (newCropper) {
            newCropper.replace(defaultAvatarUrl);
        }
        $(".file-styled").uniform({
            fileButtonClass: 'action btn btn-default'
        });
        newImgInput.val(null);
    });

    /*Tạo khung cắt avatar khi thay đổi Avatar người dùng*/
    let newAvatar = $('#update_avatar_cropper');
    newAvatar.cropper({
        aspectRatio: 1 / 1,
        crop: function(event) {
            // console.log(event.detail.x);
            // console.log(event.detail.y);
            // console.log(event.detail.width);
            // console.log(event.detail.height);
            // console.log(event.detail.rotate);
            // console.log(event.detail.scaleX);
            // console.log(event.detail.scaleY);
        }
    });
    // Get the Cropper.js instance after initialized
    let newCropper = newAvatar.data('cropper');

    let imgUpdatePreviewDiv = $('#imgUpdatePreview');
    var newImgInput = $("#update_avatar");
    var uploadedImageURL = '';
    newImgInput.change(function(event){
        event.preventDefault();
        let files = this.files;
        let file;
        if (files && files.length){
            file = files[0];
            let image = $('#update_avatar_cropper');
            if (/^image\/\w+/.test(file.type)) {
                uploadedImageType = file.type;
                uploadedImageName = file.name;
                if (uploadedImageURL) {
                    URL.revokeObjectURL(uploadedImageURL);
                }
                uploadedImageURL = URL.createObjectURL(file);
                image.attr("src", uploadedImageURL);
                if (newCropper) {
                    newCropper.replace(uploadedImageURL);
                }
                // cropper = image.data('cropper');
                // newImgInput.val(null);
                imgUpdatePreviewDiv.removeClass('hidden');
            } else {
                new PNotify({
                    title: 'File không phù hợp',
                    text: 'Vui lòng chọn file ảnh!',
                    addclass: 'bg-warning'
                });
            }
        }
    });

    let newCropBtn = $('#new_crop_btn');
    let newNotCropBtn = $('#new_not_crop_btn');
    newCropBtn.click(function (event) {
        event.preventDefault();
        // var files = $('#create_avatar')[0].files;
        // let userImgExtension = files[0].type;
        // console.log(userImgExtension);
        // console.log(newCropper.getCroppedCanvas().toDataURL());
        newCropper.getCroppedCanvas().toBlob(function(blob){
            uploadedImageURL = URL.createObjectURL(blob);
            image.attr("src", uploadedImageURL);
            newCropper.replace(uploadedImageURL);
            setTimeout(function () {
                newCropper.clear()
            }, 100);
            // console.log(newCropper.getCroppedCanvas().toDataURL());
            // console.log(image.attr('src'));
        });
    });
    newNotCropBtn.click(function () {
        newCropper.clear();
        // console.log(newCropper.getCroppedCanvas().toDataURL());
        // console.log(newCropper.getCroppedCanvas().toBlob((blob)));
    });

    /*Lưu Avatar người dùng khi chỉnh sửa*/
    let avatarUserForm = $('#avatar_user_form');
    let avatarUserUrl = $('#avatar_user_url').val();
    avatarUserForm.submit(function(event) {
        event.preventDefault();
        // console.log(newImgInput.val());
        // console.log(newCropper.getCroppedCanvas().toDataURL());
        let userImgData = newCropper.getCroppedCanvas().toDataURL();
        let userId = avatarUserId.val();
        let formData = new FormData();
        formData.append('id',userId);
        formData.append('avatar',userImgData);
        jQuery.ajax({
            url: avatarUserUrl,
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
                    $("#manage_user_table_1").DataTable().ajax.reload(null,false);
                    swal({
                        title: "Thành công!",
                        text: data.messages,
                        confirmButtonColor: "#66BB6A",
                        type: "success"
                    });
                } else if (data.code === 3) {
                    new PNotify({
                        title: 'Cập nhật ảnh người dùng',
                        text: data.messages,
                        addclass: 'bg-warning'
                    });
                } else {
                    new PNotify({
                        title: 'Cập nhật ảnh người dùng',
                        text: data.messages,
                        addclass: 'bg-danger'
                    });
                }
            },
            error: function(xhr,status,error){
                console.log('Lỗi: ' + status + " - " + error);
                new PNotify({
                    title: 'Cập nhật ảnh người dùng',
                    text: status + ": " + error,
                    addclass: 'bg-danger'
                });
                Loading.close();
            },
            complete: function(xhr, textStatus) {
                avatarUserModal.modal("hide");
                document.getElementById("avatar_user_form").reset();
                Loading.close();
            }
        });
    });

    /*Tạo Datatable user theo team*/
    $.extend( $.fn.dataTable.defaults, {
        autoWidth: false,
        order: [[3, "asc"]],
        columnDefs: [],
        dom: '<"datatable-header"fBl><"datatable-scroll-wrap"t><"datatable-footer"ip>',
        language: {
            search: '<span>Tìm trong bảng:</span> _INPUT_',
            searchPlaceholder: 'gõ từ khóa để tìm...',
            lengthMenu: '<span>Hiển thị:</span> _MENU_',
            paginate: { 'first': 'Đầu', 'last': 'Cuối', 'next': '&rarr;', 'previous': '&larr;' }
        },
        drawCallback: function () {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
        },
        preDrawCallback: function() {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
        }
    });
    window.tableRegis = $('#manage_user_table_2').DataTable({
        processing: true,
        serverSide: true,
        "pageLength": pageLength,
        ajax: {
            url: userDataURL,
            type:'POST',
            data: function (d) {
                d.teamId = $('#team_select').val();
            },
            headers:{"X-CSRF-Token" : $('meta[name="csrf-token"]').attr('content')}
        },
        buttons: [
            {
                text: '<i class="icon-add-to-list text-green position-left"></i>  Thêm mới',
                className: 'btn btn-default',
                action: function ( e, dt, node, config ) {
                    $("#create_user_modal").modal('show');
                }
            },
            {
                text: '<i class="icon-file-spreadsheet2 text-green position-left"></i>  Export',
                className: 'btn btn-default',
                extend: 'excelHtml5',
                filename: function () {
                    let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                    let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
                    let d = localISOTime.replace('T', '-').replace(/\..*$/, '');
                    return "Danh_sach_nguoi_dung_" + d;
                },
                exportOptions: {
                    columns: ':visible:not(.not-export-col)'
                }
            },
            {
                extend: 'colvis',
                text: '<i class="icon-three-bars"></i> <span class="caret"></span>',
                className: 'btn bg-teal btn-icon'
            }
        ],
        columnDefs: [
            {
                orderable: false,
                targets: 0,
            }
        ],
        select: {
            style: 'multi',
            selector: 'td:first-child'
        },
        columns: [
            { data: 'action', name: 'action', orderable:false, searchable: false },
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable:false, searchable: false, visible: Boolean(settingSequence)},
            { data: 'id', name: 'id', visible: false},
            { data: 'name', name: 'name', visible: Boolean(settingName)},
            { data: 'username', name: 'username', visible: true},
            { data: 'email', name: 'email', visible: false},
            { data: 'gender_text', name: 'gender', visible: Boolean(settingGender)},
            { data: 'title', name: 'title', visible: true},
            { data: 'phone_number', name: 'phone_number', visible: false},
            { data: 'birthday', name: 'birthday', visible: false},
            { data: 'active_text', name: 'active_text', visible: true},
            { data: 'role_text', name: 'role_text', visible: true},
            { data: 'team_text', name: 'team_text', visible: true},
            { data: 'manager_text', name: 'manager_text', visible: false},
            { data: 'email_verified_text', name: 'email_verified_text', visible: false},
            { data: 'updated_text', name: 'updated_at', visible: false},
            { data: 'created_text', name: 'created_at', visible: false},
            { data: 'editor', name: 'editor', visible: false},
            { data: 'note', name: 'note', visible: Boolean(settingNote)},
        ],
        // settingRowOptListStr
        "oLanguage": {
            "sLengthMenu": "Hiển thị _MENU_ dòng mỗi trang",
            "sZeroRecords": "Không tìm thấy dữ liệu",
            "sInfo": "Hiển thị từ _START_ đến _END_ trong tổng _TOTAL_ dòng",
            "sInfoEmpty": "Hiển thị từ 0 đến 0 trong tổng 0 dòng",
            "sInfoFiltered": "(lọc từ tổng số _MAX_ dòng)",
            "select": {
                rows: {
                    _: "%d dòng được chọn",
                    0: "",
                    // 1: "Selected 1 row"
                },
            }
        }
    });
    let btnViewList = $('#btnViewList');
    let table2Div = $('#table_2_div');
    btnViewList.click(function () {
        let teamId = $('#team_select').val();
        if (teamId!==null) {
            $("#manage_user_table_2").DataTable().ajax.reload(null,false);
            setTimeout(function () {
                table2Div.removeClass('hidden');
            }, 200);
        }
    });

    /*Ẩn hiện Table người dùng theo team*/
    let tab2 = $('#tab2');
    $('body').click(function () {
        if (!tab2.hasClass('active')){
            table2Div.addClass('hidden');
            $('#team_select').val('').trigger('change');
        }
    });
})