$(function () {
    /*Tạo DataTable danh sách nhà tài trợ trong danh sách*/
    $.extend( $.fn.dataTable.defaults, {
        autoWidth: false,
        order: [[3, "asc"]],
        columnDefs: [],
        dom: '<"datatable-header"fBl><"datatable-scroll-wrap"t><"datatable-footer"ip>',
        language: {
            search: '<span>Tìm trong bảng:</span> _INPUT_',
            searchPlaceholder: 'gõ từ khóa để tìm...',
            lengthMenu: '<span>Hiển thị:</span> _MENU_',
            paginate: {'first': 'Đầu', 'last': 'Cuối', 'next': '&rarr;', 'previous': '&larr;' }
        },
        drawCallback: function () {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').addClass('dropup');
        },
        preDrawCallback: function() {
            $(this).find('tbody tr').slice(-3).find('.dropdown, .btn-group').removeClass('dropup');
        }
    });
    window.tableRegis = $('#data_processing_table_1').DataTable({
        processing: true,
        serverSide: true,
        "pageLength": pageLength,
        ajax: {
            url: spDataURL,
            type:'POST',
            headers:{"X-CSRF-Token" : $('meta[name="csrf-token"]').attr('content')}
        },
        buttons: [
            {
                text: '<i class="icon-add-to-list text-green position-left"></i>  Thêm mới',
                className: 'btn btn-default',
                action: function ( e, dt, node, config ) {
                    $("#modal_sponsor_create").modal('show');
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
                    return "Danh_sach_nha_tai_tro_sp_" + d;
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
        columns: [
            {data: 'action', name: 'action', orderable:false, searchable: false },
            {data: 'DT_RowIndex', name: 'DT_RowIndex', orderable:false, searchable: false, visible: Boolean(settingSequence)},
            {data: 'name', name: 'name', visible: Boolean(settingName)},
            {data: 'shortname', name: 'shortname', visible: Boolean(settingShortName)},
            {data: 'note', name: 'note', visible: Boolean(settingNote)},
            {data: 'updated_text', name: 'updated_at', visible: Boolean(settingUpdatedAt)},
            {data: 'created_text', name: 'created_at', visible: Boolean(settingCreatedAt)},
        ],
        // settingRowOptListStr
        "oLanguage": {
            "sLengthMenu": "Hiển thị _MENU_ dòng mỗi trang",
            "sZeroRecords": "Không tìm thấy dữ liệu",
            "sInfo": "Hiển thị từ _START_ đến _END_ trong tổng _TOTAL_ dòng",
            "sInfoEmpty": "Hiển thị từ 0 đến 0 trong tổng 0 dòng",
            "sInfoFiltered": "(lọc từ tổng số _MAX_ dòng)"
        }
    });

    /*Lưu thông tin nhà tài trợ khi Thêm mới*/
    let spCreateModal = $('#modal_sponsor_create');
    let spCreate = $('#form_sp_create');
    let spStoreURL = $('#sp_create_post_url').val();
    let spName = $('#sp_name');
    let spShortname = $('#sp_shortname');
    let spNote = $('#sp_note');
    spCreate.submit(function(event) {
        event.preventDefault();
        let formData = new FormData();
        formData.append('name',spName.val());
        formData.append('shortname',spShortname.val());
        formData.append('note',spNote.val());
        jQuery.ajax({
            url: spStoreURL,
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
                    document.getElementById("form_sp_create").reset();
                    spCreateModal.modal("hide");
                    $("#data_processing_table_1").DataTable().ajax.reload(null,false);
                    swal({
                        title: "Thành công!",
                        text: data.messages,
                        confirmButtonColor: "#66BB6A",
                        type: "success"
                    });
                } else if (data.code === 3) {
                    new PNotify({
                        title: 'Tạo mới nhà tài trợ',
                        text: data.messages,
                        addclass: 'bg-warning'
                    });
                } else {
                    new PNotify({
                        title: 'Tạo mới nhà tài trợ',
                        text: data.messages,
                        addclass: 'bg-danger'
                    });
                }
            },
            error: function(xhr,status,error){
                console.log('Lỗi: ' + status + " - " + error);
                new PNotify({
                    title: 'Tạo mới nhà tài trợ',
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

    /*Hiển thị thông tin nhà tài trợ trước khi Chỉnh sửa*/
    let sponsorModalEdit = $('#modal_sponsor_edit');
    let sponsorId = $('#_post_sponsor_id_edit');
    let sponsorName = $('#sp_name_edit');
    let sponsorShortname = $('#sp_shortname_edit');
    let sponsorNote = $('#sp_note_edit');
    sponsorModalEdit.on('show.bs.modal', function(e) {
        document.getElementById("formSpUpdate").reset();
        let myDataId  = $(e.relatedTarget).data('id');
        let myRouteEdit = sponsorEditURL;
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
                sponsorId.val(result.id);
                sponsorName.val(result.name);
                sponsorShortname.val(result.shortname);
                sponsorNote.val(result.note);
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

    /*Lưu thông tin nhà tài trợ khi Chỉnh sửa*/
    let formSpUpdate = $('#formSpUpdate');
    let updateURL = $('#_postSpUpdateUrl').val();
    formSpUpdate.submit(function(event) {
        event.preventDefault();
        let updateId = $('#_post_sponsor_id_edit').val();
        let name = $('#sp_name_edit').val();
        let shortname = $('#sp_shortname_edit').val();
        let note = $('#sp_note_edit').val();
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
                    document.getElementById("formSpUpdate").reset();
                    sponsorModalEdit.modal("hide");
                    $("#data_processing_table_1").DataTable().ajax.reload(null,false);
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
                    title: 'Sửa nhà tài trợ',
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

    /*Xóa nhà tài trợ trong danh sách*/
    $('#data_processing_table_1').on('click','.sp-del-btn',function(event) {
        event.preventDefault();
        let myDataId  = $(this).data('id');
        swal({
            title: "Bạn chắc chứ?",
            text: "Dữ liệu bị xóa sẽ không thể phục hồi!\n"
                + 'Nhà tài trợ chỉ bị xóa khi chưa tài trợ cho bất cứ khách mời nào.',
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
                    url: destroySpURL,
                    data: formData,
                    beforeSend: function () {},
                    type: 'POST',
                    dataType: "json",
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function(data) {
                        if (data.code === 1) {
                            $('#data_processing_table_1').DataTable().ajax.reload(null,false);
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
});