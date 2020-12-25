$(function () {
    /*Tạo DataTable danh sách vai trò*/
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
    window.tableRegis = $('#manage_role_table_1').DataTable({
        processing: true,
        serverSide: true,
        // "pageLength": pageLength,
        ajax: {
            url: roleDataURL,
            type:'POST',
            headers:{"X-CSRF-Token" : $('meta[name="csrf-token"]').attr('content')}
        },
        buttons: [
            {
                text: '<i class="icon-add-to-list text-green position-left"></i>  Thêm mới',
                className: 'btn btn-default',
                action: function ( e, dt, node, config ) {
                    $("#create_role_modal").modal('show');
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
                    return "Danh_sach_vai_tro_" + d;
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
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable:false, searchable: false},
            { data: 'id', name: 'id', visible: false},
            { data: 'name', name: 'name'},
            { data: 'display_name', name: 'display_name'},
            { data: 'note', name: 'note'},
            { data: 'updated_text', name: 'updated_at', visible: false},
            { data: 'created_text', name: 'created_at', visible: false},
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

    /*Lưu thông tin vai trò khi Thêm mới*/
    let roleCreateModal = $('#create_role_modal');
    let roleCreateForm = $('#create_role_form');
    let roleStoreURL = $('#create_role_url').val();
    let roleName = $('#create_name');
    let roleDisplayName = $('#create_display_name');
    let roleNote = $('#create_note');
    roleCreateForm.submit(function(event) {
        event.preventDefault();
        roleCreateModal.modal("hide");
        let formData = new FormData();
        formData.append('name',roleName.val());
        formData.append('display_name',roleDisplayName.val());
        formData.append('note',roleNote.val());
        jQuery.ajax({
            url: roleStoreURL,
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
                    document.getElementById("create_role_form").reset();
                    $("#manage_role_table_1").DataTable().ajax.reload(null,false);
                    swal({
                        title: "Thành công!",
                        text: data.messages,
                        confirmButtonColor: "#66BB6A",
                        type: "success"
                    });
                } else {
                    new PNotify({
                        title: 'Tạo mới vai trò',
                        text: data.messages,
                        addclass: 'bg-danger'
                    });
                }
            },
            error: function(xhr,status,error){
                console.log('Lỗi: ' + status + " - " + error);
                new PNotify({
                    title: 'Tạo mới vai trò',
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

    /*Reset modal thêm mới*/
    roleCreateModal.on('show.bs.modal', function(e) {
        roleCreateForm.trigger('reset');
    });

    /*Hiển thị thông tin vai trò trước khi Chỉnh sửa*/
    let roleEditModal = $('#edit_role_modal');
    let roleId = $('#edit_role_id');
    let roleNameEdit = $('#edit_name');
    let roleDisplayNameEdit = $('#edit_display_name');
    let roleNoteEdit = $('#edit_note');
    roleEditModal.on('show.bs.modal', function(e) {
        document.getElementById("edit_role_form").reset();
        let myDataId  = $(e.relatedTarget).data('id');
        let myRouteEdit = roleEditURL;
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
                roleId.val(result.id);
                roleNameEdit.val(result.name);
                roleDisplayNameEdit.val(result.display_name);
                roleNoteEdit.val(result.note);
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

    /*Lưu thông tin vai trò khi Chỉnh sửa*/
    let formRoleUpdate = $('#edit_role_form');
    let updateURL = $('#edit_role_url').val();
    formRoleUpdate.submit(function(event) {
        event.preventDefault();
        roleEditModal.modal("hide");
        let updateId = $('#edit_role_id').val();
        let name = $('#edit_name').val();
        let displayName = $('#edit_display_name').val();
        let note = $('#edit_note').val();
        let formData = new FormData();
        formData.append('id', updateId);
        formData.append('name', name);
        formData.append('display_name',displayName);
        formData.append('note', note);
        jQuery.ajax({
            url: updateURL,
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
                    document.getElementById("edit_role_form").reset();
                    $("#manage_role_table_1").DataTable().ajax.reload(null,false);
                    swal({
                        title: 'Thành công',
                        text: data.messages,
                        confirmButtonColor: "#66BB6A",
                        type: "success"
                    });
                } else {
                    new PNotify({
                        title: 'Thất bại',
                        text: data.messages,
                        addclass: 'bg-danger'
                    });
                }
            },
            error: function(xhr,status,error){
                console.log('Lỗi: ' + status + " - " + error);
                new PNotify({
                    title: 'Sửa vai trò',
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

    /*Xóa vai trò*/
    $('#manage_role_table_1').on('click','.role-del-btn',function(event) {
        event.preventDefault();
        let myDataId  = $(this).data('id');
        swal({
            title: "Bạn chắc chứ?",
            text: "Dữ liệu bị xóa sẽ không thể phục hồi!\n"
                + 'Vai trò chỉ bị xóa khi không còn người dùng nào giữ vai trò đó.',
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
                    url: destroyRoleURL,
                    data: formData,
                    beforeSend: function () {},
                    type: 'POST',
                    dataType: "json",
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function(data) {
                        if (data.code === 1) {
                            $('#manage_role_table_1').DataTable().ajax.reload(null,false);
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

    /*Tạo DataTable danh sách phân quyền*/
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
    window.tableRegis = $('#manage_role_table_2').DataTable({
        processing: true,
        serverSide: true,
        // "pageLength": pageLength,
        ajax: {
            url: permissionDataURL,
            type:'POST',
            headers:{"X-CSRF-Token" : $('meta[name="csrf-token"]').attr('content')}
        },
        buttons: [
            {
                text: '<i class="icon-add-to-list text-green position-left"></i>  Thêm mới',
                className: 'btn btn-default',
                action: function ( e, dt, node, config ) {
                    $("#create_role_modal").modal('show');
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
                    return "Danh_sach_phan_quyen_" + d;
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
            { data: 'action', name: 'action', orderable:false, searchable: false, visible: false },
            { data: 'DT_RowIndex', name: 'DT_RowIndex', orderable:false, searchable: false},
            { data: 'id', name: 'id', visible: false},
            { data: 'display_name', name: 'display_name'},
            { data: 'create-users', name: 'create-users'},
            { data: 'read-users', name: 'read-users'},
            { data: 'update-users', name: 'update-users'},
            { data: 'delete-users', name: 'delete-users'},
            { data: 'change-password-users', name: 'change-password-users'},
            { data: 'create-teams', name: 'create-teams'},
            { data: 'read-teams', name: 'read-teams'},
            { data: 'update-teams', name: 'update-teams'},
            { data: 'delete-teams', name: 'delete-teams'},
            { data: 'create-roles-permissions', name: 'create-roles-permissions'},
            { data: 'read-roles-permissions', name: 'read-roles-permissions'},
            { data: 'update-roles-permissions', name: 'update-roles-permissions'},
            { data: 'delete-roles-permissions', name: 'delete-roles-permissions'},
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
        },
        "fnDrawCallback": function() {
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
        },
    });

    /*Cập nhật role-permission khi bật/tắt*/
    let rolePermissionTable = $('#manage_role_table_2').DataTable();
    rolePermissionTable.on('change', '.switchery',function (event) {

        let roleId  = $(this).data('role');
        let currentPermissionsArr = [];
        let rolePermissions = $('.role-'+roleId);
        rolePermissions.each(function() {
            if($(this).is(":checked") == true){
                currentPermissionsArr.push($(this).data('permission'));
            };
        });
        currentPermissionsArr = JSON.stringify(currentPermissionsArr);
        let formData = new FormData();
        formData.append('roleId',roleId);
        formData.append('permissionsArr',currentPermissionsArr);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            }
        });
        $.ajax({
            url: syncURL,
            data: formData,
            beforeSend: function () {},
            type: 'POST',
            dataType: "json",
            contentType: false,
            cache: false,
            processData: false,
            success: function(data) {
                if (data.code === 1) {
                    new PNotify({
                        title: 'Đã cập nhật!',
                        text: data.messages,
                        addclass: 'bg-success'
                    });
                } else {
                    new PNotify({
                        title: 'Không cập nhật được!',
                        text: data.messages,
                        addclass: 'bg-danger'
                    });
                }
            },
            error: function(xhr,status,error){
                new PNotify({
                    title: 'Không thể cập nhật!',
                    text: data.messages,
                    addclass: 'bg-danger'
                });
            },
            complete: function () {
                rolePermissionTable.ajax.reload(null,false);
            }
        });
    })

})