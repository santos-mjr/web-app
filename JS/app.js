//The URIs of the REST endpoint
IUPS = "https://prod-86.eastus.logic.azure.com:443/workflows/2e4abdfd7a5d49c7a872d00f7a13670e/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=6W4elfxZtiXwtE5FhLV92Co7lVqbGUR4b9N--RIby8U";
RAI = "https://prod-77.eastus.logic.azure.com:443/workflows/2207c1cf6ac040b28a1a98c2aa546d31/triggers/manual/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=rWsllMO_1rEk88n5TTECLOzZXPSoem2u5rHei-OXkEE";
DI = "https://prod-83.eastus.logic.azure.com/workflows/4a550c63cb70476b9e1b01001da0c2c8/triggers/manual/paths/invoke/api/v1/posts/{id}/delete/{blob}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=m_DYuLuUwQbO-AEtlh2cj82KFHAqWkR5yAnQnumsx54";
BLOB_ACCOUNT = "https://b00759539.blob.core.windows.net";

//Handlers for button clicks
$(document).ready(function () {
  $("#retImages").click(function () {
    //Run the get asset list function
    getImages();
  });

  //Handler for the new asset submission button
  $("#subNewForm").click(function () {
    //Execute the submit new asset function
    submitNewAsset();
  });
});

//A function to submit a new asset to the REST endpoint 
function submitNewAsset() {

  //Create a form data object
  submitData = new FormData();
  //Get form variables and append them to the form data object
  submitData.append('FileName', $('#FileName').val());
  submitData.append('userID', $('#userID').val());
  submitData.append('userName', $('#userName').val());
  submitData.append('File', $("#UpFile")[0].files[0]);

  //Post the form data to the endpoint, note the need to set the content type header
  $.ajax({
    url: IUPS,
    data: submitData,
    cache: false,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    type: 'POST',
    success: function (data) {
      window.alert("Successfully Uploaded!")
      location.reload();
    }
  });
  this.submitData.reset();
}


//A function to get a list of all the assets and write them to the Div with the AssetList Div
function getImages() {

  //Replace the current HTML in that div with a loading message
  $('#ImageList').html('<div class="spinner-border" role="status"><span class="sr-only"> &nbsp;</span>');
  $.getJSON(RAI, function (data) {
    //Create an array to hold all the retrieved assets
    var items = [];

    //Iterate through the returned records and build HTML, incorporating the key values of the record in the data
    $.each(data, function (key, val) {
      style = "btn btn-dark";
      func = `deleteImg('${val["id"]}', '${val["filePath"].split('/')[2]}')`
      deleteBtn = `<button class="${style}" onclick="${func}">Delete</button>`

      ImageFunction = `ViewOneImage('${val["id"]}')`
      ViewImage = `<button class="btn btn-dark" onclick="${ImageFunction}">Image Details</button>`
      userImage = `getUserImages('${val["userName"]}')`
      profileButton = `<button class="btn btn-dark" onclick="${userImage}"">User Profile</button>`

      items.push("<hr />");
      items.push("<img src='" + BLOB_ACCOUNT.trim() + val["filePath"].trim() + "' width='600'/> <br />")
      items.push("<hr />");
      items.push("File : " + val["fileName"] + "<br />");
      items.push("Uploaded by: " + val["userName"] + " (user id: " + val["userID"] + ")<br />");
      items.push("<hr />");
      items.push(ViewImage + "&nbsp;")
      items.push(deleteBtn + "&nbsp;")
      items.push(profileButton)
    });
    //Clear the assetlist div
    $('#ImageList').empty();
    //Append the contents of the items array to the ImageList Div
    $("<ul/>", {
      "class": "my-new-list",
      html: items.join("")
    }).appendTo("#ImageList");
  });
}

function deleteImg(id, blob) {
  let DI = `https://prod-83.eastus.logic.azure.com/workflows/4a550c63cb70476b9e1b01001da0c2c8/triggers/manual/paths/invoke/api/v1/posts/${id}/delete/${blob}?api-version=2016-10-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=m_DYuLuUwQbO-AEtlh2cj82KFHAqWkR5yAnQnumsx54`
  $.ajax({
    url: DI,
    type: "DELETE",
    success: () => {
      window.alert("Deleted image.");
      getImages();
    }
  })
}

function ViewOneImage(id) {
  localStorage.setItem("id", id);
  window.location.replace("image.html");
}

getUserImages = userName => {
  localStorage.setItem("userName", userName);
  window.location.href = "UserImages.html"
}

