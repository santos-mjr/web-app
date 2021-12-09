BLOB_ACCOUNT = "https://b00759539.blob.core.windows.net";

$(document).ready(function () {
    var id = localStorage.getItem("id");

    $('.container').empty();

    let GOI = "https://prod-16.eastus.logic.azure.com/workflows/6d05d1c106ac40e9b0c66e8a386b7647/triggers/manual/paths/invoke/api/v1/posts/" + id + " ?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=zIhlIH8esgRywCHbforzixP8DInQWOlBc55HI685MPc"
    $.getJSON(GOI, function (data) {
        var items = [];

        items.push("<img src='" + BLOB_ACCOUNT.trim() + data["filePath"].trim() + "' width='600'/> <br />")

        console.log(BLOB_ACCOUNT + data["filePath"])

        items.push("<hr>")
        items.push("<h4>Comments:</h4>")
        items.push("<hr>")
        $.each(data["comment"], (key, val) => {
            items.push(`<h6>${val["userName"]}</h6>`)
            items.push(`<p>${val["comment"]}</p>`)
        })
        items.push("<hr>")

        $('.container').append(items.join(""))
        $("#comment").click(function () {
            addComment(data['id'], data);
        });
    });
});

addComment = (id, imgdata) => {
    imgComment = `https://prod-79.eastus.logic.azure.com/workflows/f6dfc31c9a8742aa83d9963bd6b26420/triggers/manual/paths/invoke/api/v1/posts/${id}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=hhz59NTH5-AvvhSd7VJerJ3KlpJEjWqwbr0V1Dng4QQ`

    formdata = new FormData();

    var username = $('#formInputUsername').val();
    var newComment = {
        "userName": username,
        "comment": $('#commentContent').val()
    }

    if (imgdata['comment']) {
        imgdata["comment"].push(newComment)
    } else {
        imgdata["comment"] = [newComment]
    }

    // Comment data
    formdata.append('userName', username);
    formdata.append('comment', JSON.stringify(imgdata["comment"]));

    // Existing data
    formdata.append('userID', imgdata['userID']);
    formdata.append('FileName', imgdata['fileName']);
    formdata.append('id', imgdata['id']);
    formdata.append('filePath', imgdata['filePath']);
    formdata.append('fileLocator', imgdata['fileLocator']);

    // PUT request
    $.ajax({
        url: imgComment,
        data: formdata,
        cache: false,
        enctype: 'multipart/form-data',
        contentType: false,
        processData: false,
        type: 'PUT',
    }).done(() => {
        document.location.reload();
    });
}