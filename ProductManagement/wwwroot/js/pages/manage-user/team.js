$(function () {
    /*Tạo DataTable danh sách ban*/
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
    window.tableRegis = $('#manage_team_table_1').DataTable({
        processing: true,
        serverSide: true,
        // "pageLength": pageLength,
        ajax: {
            url: teamDataURL,
            type:'POST',
            headers:{"X-CSRF-Token" : $('meta[name="csrf-token"]').attr('content')}
        },
        buttons: [
            {
                text: '<i class="icon-add-to-list text-green position-left"></i>  Thêm mới',
                className: 'btn btn-default',
                action: function ( e, dt, node, config ) {
                    $("#create_team_modal").modal('show');
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
                    return "Danh_sach_ban_" + d;
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
            { data: 'shortname', name: 'shortname'},
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

    /*Lưu thông tin Ban khi Thêm mới*/
    let teamCreateModal = $('#create_team_modal');
    let teamCreateForm = $('#create_team_form');
    let teamStoreURL = $('#create_team_url').val();
    let teamName = $('#create_name');
    let teamShortname = $('#create_shortname');
    let teamNote = $('#create_note');
    teamCreateForm.submit(function(event) {
        event.preventDefault();
        teamCreateModal.modal("hide");
        let formData = new FormData();
        formData.append('name',teamName.val());
        formData.append('shortname',teamShortname.val());
        formData.append('note',teamNote.val());
        jQuery.ajax({
            url: teamStoreURL,
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
                    document.getElementById("create_team_form").reset();
                    $("#manage_team_table_1").DataTable().ajax.reload(null,false);
                    swal({
                        title: "Thành công!",
                        text: data.messages,
                        confirmButtonColor: "#66BB6A",
                        type: "success"
                    });
                } else {
                    new PNotify({
                        title: 'Tạo mới ban',
                        text: data.messages,
                        addclass: 'bg-danger'
                    });
                }
            },
            error: function(xhr,status,error){
                console.log('Lỗi: ' + status + " - " + error);
                new PNotify({
                    title: 'Tạo mới ban',
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
    teamCreateModal.on('show.bs.modal', function(e) {
        teamCreateForm.trigger('reset');
    });

    /*Hiển thị thông tin ban trước khi Chỉnh sửa*/
    let teamEditModal = $('#edit_team_modal');
    let teamId = $('#edit_team_id');
    let teamNameEdit = $('#edit_name');
    let teamShortnameEdit = $('#edit_shortname');
    let teamNoteEdit = $('#edit_note');
    teamEditModal.on('show.bs.modal', function(e) {
        document.getElementById("edit_team_form").reset();
        let myDataId  = $(e.relatedTarget).data('id');
        let myRouteEdit = teamEditURL;
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
                teamId.val(result.id);
                teamNameEdit.val(result.name);
                teamShortnameEdit.val(result.shortname);
                teamNoteEdit.val(result.note);
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

    /*Lưu thông tin ban khi Chỉnh sửa*/
    let formTeamUpdate = $('#edit_team_form');
    let updateURL = $('#edit_team_url').val();
    formTeamUpdate.submit(function(event) {
        event.preventDefault();
        teamEditModal.modal("hide");
        let updateId = $('#edit_team_id').val();
        let name = $('#edit_name').val();
        let shortname = $('#edit_shortname').val();
        let note = $('#edit_note').val();
        let formData = new FormData();
        formData.append('id', updateId);
        formData.append('name', name);
        formData.append('shortname',shortname);
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
                    document.getElementById("edit_team_form").reset();
                    $("#manage_team_table_1").DataTable().ajax.reload(null,false);
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
                    title: 'Sửa ban',
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

    /*Xóa ban*/
    $('#manage_team_table_1').on('click','.del-btn',function(event) {
        event.preventDefault();
        let myDataId  = $(this).data('id');
        swal({
            title: "Bạn chắc chứ?",
            text: "Dữ liệu bị xóa sẽ không thể phục hồi!\n"
                + 'Ban chỉ bị xóa khi không còn người dùng trong ban.',
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
                    url: destroyTeamURL,
                    data: formData,
                    beforeSend: function () {},
                    type: 'POST',
                    dataType: "json",
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function(data) {
                        if (data.code === 1) {
                            $('#manage_team_table_1').DataTable().ajax.reload(null,false);
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
})