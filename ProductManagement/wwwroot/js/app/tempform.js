$(function() {
    // Setting datatable defaults
    $.extend( $.fn.dataTable.defaults, {
        autoWidth: true,
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

    // Datatable 'length' options
    $('.datatable-show-all').DataTable({
        lengthMenu: [[20, 50, 150, -1], [20, 50, 150, "Tất cả"]],
        "oLanguage": {
            "sLengthMenu": "Hiển thị _MENU_ dòng mỗi trang",
            "sZeroRecords": "Không tìm thấy dữ liệu",
            "sInfo": "Hiển thị từ _START_ đến _END_ trong tổng _TOTAL_ dòng",
            "sInfoEmpty": "Hiển thị từ 0 đến 0 trong tổng 0 dòng",
            "sInfoFiltered": "(lọc từ tổng số _MAX_ dòng)"
        }
    });

    $('.select-size-xs').select2({
        containerCssClass: 'select-xs'
    });

});

