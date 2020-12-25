$(function () {
    // NHÀ TÀI TRỢ NGOÀI DANH SÁCH

    /*Tạo DataTable danh sách nhà tài trợ ngoài danh sách*/
    $.extend( $.fn.dataTable.defaults, {
        autoWidth: false,
        order: [[4, "asc"]],
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
    window.tableRegis = $('#data_processing_table_2').DataTable({
        processing: true,
        serverSide: true,
        "pageLength": pageLength,
        ajax: {
            url: otDataURL,
            type:'POST',
            headers:{"X-CSRF-Token" : $('meta[name="csrf-token"]').attr('content')}
        },
        buttons: [
            {
                text: '<i class="icon-file-spreadsheet2 text-green position-left"></i>  Export',
                className: 'btn btn-default',
                extend: 'excelHtml5',
                filename: function () {
                    let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                    let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
                    let d = localISOTime.replace('T', '-').replace(/\..*$/, '');
                    return "Danh_sach_nha_tai_tro_ot_" + d;
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
                className: 'select-checkbox',
                targets: 0,
                'checkboxes': true
            }
        ],
        select: {
            style: 'multi',
            selector: 'td:first-child'
        },
        columns: [
            {data: 'checkbox', name: 'checkbox', orderable:false, searchable: false},
            {data: 'action', name: 'action', orderable:false, searchable: false },
            {data: 'DT_RowIndex', name: 'DT_RowIndex', orderable:false, searchable: false, visible: Boolean(settingSequence)},
            {data: 'name', name: 'name', visible: Boolean(settingName)},
            {data: 'shortname', name: 'shortname', visible: Boolean(settingShortName)},
            {data: 'visitor', name: 'visitor', visible: Boolean(settingVisitor)},
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

    /*Button chọn tất cả*/
    $('#select_all_checboxes').on('click', function(){
        window.tableRegis.rows().select();
    });

    /*Button bỏ chọn tất cả*/
    $('#unselect_all_checboxes').on('click', function(){
        window.tableRegis.rows().deselect();
    });

    /*Chuyển nhà tài trợ của khách mời và xóa nhà tài trợ ngoài danh sách*/
    $('#unify_btn').on('click', function(){
        event.preventDefault();
        let formUnify = document.getElementById('unify_form');
        let unifySpId = $('#unify_sp_id').val();
        swal({
            title: "Bạn chắc chứ?",
            text: "Các nhà tài trợ ngoài danh sách sẽ bị xóa!\n"
                + 'Các khách mời sẽ được chuyển sang nhà tài trợ đã được chọn.',
            type: "warning",
            showCancelButton: true,
            showLoaderOnConfirm: true,
            confirmButtonColor: "#EF5350",
            confirmButtonText: "Vâng, cứ tiếp tục!",
            cancelButtonText: "Không, để xem lại!",
            closeOnConfirm: false,
            closeOnCancel: false
        }, function(isConfirm){
            if (isConfirm) {
                let tblData = window.tableRegis.rows('.selected').data();
                if (tblData != null) {
                    let chosenOtID = [];
                    let affectedVisitors = [];
                    $.each(tblData, function(i, val) {
                        chosenOtID.push(val.id);
                        /*if (val.form_registrations.length>0) {
                            affectedVisitors.push(val.form_registrations[0].id);
                        }
                        else affectedVisitors.push(0);*/
                    });
                    let otGroup = "";
                    let visitors = "";
                    if (chosenOtID.length > 0) {
                        otGroup = JSON.stringify(chosenOtID);
                        //visitors = JSON.stringify(affectedVisitors);
                    }
                    if (otGroup.length>0) {
                        let formData = new FormData();
                        formData.append('unifySpId',unifySpId);
                        formData.append('otGroup',otGroup);
                        //formData.append('visitors',visitors);
                        $.ajax({
                            url: mergeURL,
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
                                if (data.code === 1) {
                                    formUnify.reset();
                                    $("#unify_sp_id").val(null).trigger("change");
                                    $("#data_processing_table_1").DataTable().ajax.reload(null,false);
                                    $("#data_processing_table_2").DataTable().ajax.reload(null,false);
                                    swal({
                                        title: "Hợp nhất nhà tài trợ!",
                                        text: data.messages,
                                        confirmButtonColor: "#66BB6A",
                                        type: "success"
                                    });
                                } else {
                                    swal({
                                        title: "Hợp nhất thất bại!",
                                        text: data.messages,
                                        confirmButtonColor: "#2196F3",
                                        type: "error"
                                    });
                                }
                            },
                            error: function(xhr,status,error){
                                swal({
                                    title: "Không thành công!",
                                    text: error,
                                    confirmButtonColor: "#2196F3",
                                    type: "error"
                                });
                            },
                            complete: function () {
                                Loading.close();
                            }
                        });
                    }else{
                        swal({
                            title: "Lỗi dữ liệu!",
                            text: 'Chưa chọn nhà tài trợ cần hợp nhất!',
                            confirmButtonColor: "#2196F3",
                            type: "warning"
                        });
                    }
                }
            }
            else {
                swal({
                    title: "Hủy thao tác",
                    text: "Cảm ơn bạn đã cẩn thận!",
                    confirmButtonColor: "#2196F3",
                    type: "info"
                });
            }
        });
    });

    /*Tạo select2 chọn nhà tài trợ trong danh sách để hợp nhất*/
    $('#unify_sp_id').select2({
        ajax: {
            url : selectSpURL,
            dataType: 'json',
            delay : 250,
            data : function(params){
                return {
                    q : params.term,
                    page : params.page
                };
            },
            processResults: function (data, params) {
                var other = [];
                $.map(data.data, function (item) {
                    let str = "";
                    if (item.shortname) str += item.shortname + " - ";
                    if (item.name) str += item.name;
                    other.push ({
                        text: str,
                        id: item.id,
                    });
                });
                params.page = params.page || 1;
                return {
                    results:  other,
                    pagination: {
                        more : (params.page  * 10) < data.total
                    }
                };
            },
            cache: true
        },
        placeholder : 'Chọn nhà trợ trong danh sách để hợp nhất',
        templateResult : function (repo) {
            if(repo.loading) return repo.text;
            var markup = repo.text;
            return markup;
        },
        templateSelection : function(repo) {
            return repo.text;
        },
        // dropdownCssClass: "form-control",
        escapeMarkup : function(markup){ return markup; }
    });

    /*Hiển thị thông tin nhà tài trợ ngoài danh sách trước khi Chỉnh sửa*/
    let otsponsorModalEdit = $('#modal_otsponsor_edit');
    let otsponsorId = $('#ot_update_id');
    let otsponsorName = $('#ot_name_edit');
    let otsponsorShortname = $('#ot_shortname_edit');
    let otsponsorNote = $('#ot_note_edit');
    otsponsorModalEdit.on('show.bs.modal', function(e) {
        document.getElementById("form_ot_update").reset();
        let myDataId  = $(e.relatedTarget).data('id');
        let formData = new FormData();
        formData.append('id',myDataId);
        $.ajax({
            url: otEditURL,
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
                otsponsorId.val(result.id);
                otsponsorName.val(result.name);
                otsponsorShortname.val(result.shortname);
                otsponsorNote.val(result.note);
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

    /*Lưu thông tin nhà tài trợ ngoài danh sách khi Chỉnh sửa*/
    let formOtUpdate = $('#form_ot_update');
    let otUpdateURL = $('#ot_update_post_url').val();
    formOtUpdate.submit(function(event) {
        event.preventDefault();
        let updateId = $('#ot_update_id').val();
        let name = $('#ot_name_edit').val();
        let shortname = $('#ot_shortname_edit').val();
        let note = $('#ot_note_edit').val();
        let formData = new FormData();
        formData.append('id', updateId);
        formData.append('name', name);
        formData.append('shortname',shortname);
        formData.append('note', note);
        jQuery.ajax({
            url: otUpdateURL,
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
                    document.getElementById("form_ot_update").reset();
                    otsponsorModalEdit.modal("hide");
                    $("#data_processing_table_2").DataTable().ajax.reload(null,false);
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

    /*Xóa nhà tài trợ ngoài danh sách*/
    $('#data_processing_table_2').on('click','.ot-del-btn',function(event) {
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
                    url: destroyOtURL,
                    data: formData,
                    beforeSend: function () {},
                    type: 'POST',
                    dataType: "json",
                    contentType: false,
                    cache: false,
                    processData: false,
                    success: function(data) {
                        if (data.code === 1) {
                            $('#data_processing_table_2').DataTable().ajax.reload(null,false);
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