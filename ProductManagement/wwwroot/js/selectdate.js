jQuery(document).ready(function()
{
    jQuery("#dtBox-iddate").DateTimePicker({

        dateTimeFormat: "dd-MMM-yyyy HH:mm:ss",
        dateFormat: "dd-MMM-yyyy",
        timeFormat: "HH:mm:ss",

        shortDayNames: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
        fullDayNames: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
        shortMonthNames: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        fullMonthNames: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],

        titleContentDate: "Chọn ngày cấp CMND / CCCD",
        titleContentTime: "Chọn giờ",
        titleContentDateTime: "Chọn ngày & giờ",

        setButtonContent: "Chọn",
        clearButtonContent: "Xóa",
        parentElement: "#iddate-parent",
        formatHumanDate: function(oDate, sMode, sFormat)
        {
            if(sMode === "date")
                return oDate.day + ", " + oDate.dd + " " + oDate.month+ ", " + oDate.yyyy;
            else if(sMode === "time")
                return oDate.HH + ":" + oDate.mm + ":" + oDate.ss;
            else if(sMode === "datetime")
                return oDate.dayShort + ", " + oDate.dd + " " + oDate.month+ ", " + oDate.yyyy + " " + oDate.HH + ":" + oDate.mm + ":" + oDate.ss;
        }
    });

    jQuery("#dtBox").DateTimePicker({
        dateTimeFormat: "dd-MMM-yyyy HH:mm:ss",
        dateFormat: "dd-MMM-yyyy",
        timeFormat: "HH:mm:ss",

        shortDayNames: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
        fullDayNames: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
        shortMonthNames: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        fullMonthNames: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],

        titleContentDate: "Chọn ngày sinh",
        titleContentTime: "Chọn giờ",
        titleContentDateTime: "Chọn ngày & giờ",

        setButtonContent: "Chọn",
        clearButtonContent: "Xóa",
        defaultDate: new Date(1980, 0, 1, 0, 0, 0, 0),
        parentElement: "#birthday-parent",
        formatHumanDate: function(oDate, sMode, sFormat)
        {
            if(sMode === "date")
                return oDate.day + ", " + oDate.dd + " " + oDate.month+ ", " + oDate.yyyy;
            else if(sMode === "time")
                return oDate.HH + ":" + oDate.mm + ":" + oDate.ss;
            else if(sMode === "datetime")
                return oDate.dayShort + ", " + oDate.dd + " " + oDate.month+ ", " + oDate.yyyy + " " + oDate.HH + ":" + oDate.mm + ":" + oDate.ss;
        },
        addEventHandlers: function()
        {
            var dtPickerObj = this;
            //dtPickerObj.setDateTimeStringInInputField(jQuery("#birthday"), new Date(1980, 0, 1, 0, 0, 0, 0));
        }
    });
    jQuery("#dtBox_edit").DateTimePicker({
        dateTimeFormat: "dd-MMM-yyyy HH:mm:ss",
        dateFormat: "dd-MMM-yyyy",
        timeFormat: "HH:mm:ss",

        shortDayNames: ["CN", "T2", "T3", "T4", "T5", "T6", "T7"],
        fullDayNames: ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"],
        shortMonthNames: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
        fullMonthNames: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6", "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"],

        titleContentDate: "Chọn ngày sinh",
        titleContentTime: "Chọn giờ",
        titleContentDateTime: "Chọn ngày & giờ",

        setButtonContent: "Chọn",
        clearButtonContent: "Xóa",
        defaultDate: new Date(1980, 0, 1, 0, 0, 0, 0),
        parentElement: "#birthday_parent_edit",
        formatHumanDate: function(oDate, sMode, sFormat)
        {
            if(sMode === "date")
                return oDate.day + ", " + oDate.dd + " " + oDate.month+ ", " + oDate.yyyy;
            else if(sMode === "time")
                return oDate.HH + ":" + oDate.mm + ":" + oDate.ss;
            else if(sMode === "datetime")
                return oDate.dayShort + ", " + oDate.dd + " " + oDate.month+ ", " + oDate.yyyy + " " + oDate.HH + ":" + oDate.mm + ":" + oDate.ss;
        },
        addEventHandlers: function()
        {
            var dtPickerObj = this;
            //dtPickerObj.setDateTimeStringInInputField(jQuery("#birthday"), new Date(1980, 0, 1, 0, 0, 0, 0));
        }
    });
});