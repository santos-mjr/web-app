BLOB_ACCOUNT = "https://b00759539.blob.core.windows.net";

//A function to get a list of all the assets and write them to the Div with the AssetList Div
$(document).ready(() => {
    var userName = localStorage.getItem("userName");

    var userImages = "https://prod-68.eastus.logic.azure.com/workflows/a78050318fad40a9b40630fc8627169f/triggers/manual/paths/invoke/api/v1/posts/" + userName + "?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=-bauj6Faqqq4xMfdvM4N83PQ4yqD3gzWFNh7QS5Fc_M"

    //Replace the current HTML in that div with a loading message
    $.getJSON(userImages, function (data) {
        //Create an array to hold all the retrieved assets
        var items = [];

        //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
        $.each(data, function (key, val) {
            var splitPath = val["filePath"].split('/')[2]

            buttonClass = "btn btn-danger rounded-pill";
            viewFunction = `viewImage('${val["id"]}')`

            viewButton = `<button class="btn btn-dark" onclick=${viewFunction}>View image</button>`

            items.push("<hr />");
            items.push("<img src='" + BLOB_ACCOUNT + val["filePath"] + "' width='400'/> <br />");
            items.push("File : " + val["fileName"] + "<br />");
            items.push("Uploaded by: " + val["userName"] + " (user id: " + val["userID"] + ")<br />");
            items.push(viewButton + "<br/>");
            items.push("<hr />");
        });
        //Clear the assetlist div
        $('#ImageList').empty();
        //Append the contents of the items array to the ImageList Div
        $("<ul/>", {
            "class": "my-new-list",
            html: items.join("")
        }).appendTo("#ImageList");
    });
});

viewImage = id => {
    localStorage.setItem("id", id);
    window.location.href = "image.html";
}