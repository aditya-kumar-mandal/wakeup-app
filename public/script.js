$('.submit').on('click', function (e) {
    if ($("#url").val() == "") return $("#url").attr("placeholder", "Required");
    e.preventDefault();
    var appname = $('#url').val();
    var day = $('#day').val();
    var hour = $('#hour').val();
    var min = $('#min').val();

    $.ajax({
        type: "POST",
        url: "/submit",
        data: {
            "url": appname,
            "day": day === "" ?"0": day ,
            "hour": hour === "" ? "0" :hour,
            "min": min ==="" ?"0": min  
        },
        success: function (data) {
            console.log(data);
            if (data === "ok") {
                $("#submit").text("Success");
                $("#submit").css("background", "#20d34d");
                setTimeout(function () {
                    $("#submit").css("background", "#6365f1");
                    $("#url").val("");
                    $("#day").val("");
                    $("#hour").val("");
                    $("#min").val("");
                    $("#submit").text("Submit");
                },4000)

            } else if (data === "error") {
                $("#submit").text("Unknown Error");
                $("#submit").css("background", "red");
                setTimeout(function () {
                    $("#submit").css("background", "#6365f1");
                    $("#url").val("");
                    $("#day").val("");
                    $("#hour").val("");
                    $("#min").val("");
                    $("#submit").text("Submit");
                }, 4000)
            }
            else if (data === 'duplicate') {
                $("#submit").text("Already present");
                $("#submit").css("background", "#eea812");
                setTimeout(function () {
                    $("#submit").css("background", "#6365f1");
                    $("#url").val("");
                    $("#day").val("");
                    $("#hour").val("");
                    $("#min").val("");
                    $("#submit").text("Submit");
                }, 4000)
            }
        }
    });

})