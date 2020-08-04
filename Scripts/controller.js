function onPageLoad() {
    // wire up all event handlers
    document.getElementById("registerBtn").onclick = onCreateBtnClicked;
    document.getElementById("cancelBtn").onclick = onCancelBtnClicked;
    document.getElementById("newBtn").onclick = onNewBtnClicked;

    //populate the table
    var items = modelGetAllBands();
    for (var i = 0; i < items.length; i++) {
        addTableItem(items[i]);
    }

    //resets input form
    clearInputForm();
}

function onCreateBtnClicked() {
    if (!validateControls()) {
        return;
    }

    var form = document.forms["editForm"];
    var newBand = modelCreateBand(
        form.bandNameEdit.value,
        form.leadSingerEdit.value,
        form.genreSelect.value,
        form.stateSelect.value,
        parseInt(form.yearsEdit.value),
        form.yesRadio.checked,
        parseInt(form.phoneNumberEdit.value),
        form.canText.value
        );

        addTableItem(newBand);

    clearInputForm();
}

function onNewBtnClicked() {
    document.getElementById("formTitle").innerText = "Create New Band";
    document.getElementById("bandEditArea").style.display = "block";
    document.getElementById("bandListArea").style.display = "none";
    document.getElementById("registerBtn").style.display = "block";
    document.getElementById("updateBtn").style.display = "none";
}

function onCancelBtnClicked() {
    clearInputForm();
}

function onEditButtonClicked(id) {
    var band = modelGetBand(id);
    if(!band)
    {
        alert("Unable to find Band ID: " + id);
    }

    document.getElementById("formTitle").innerText = "Edit Band";
    document.getElementById("bandEditArea").style.display = "block";
    document.getElementById("bandListArea").style.display = "none";
    document.getElementById("updateBtn").style.display = "block";
    document.getElementById("registerBtn").style.display = "none";

    var form = document.forms["editForm"];
    form.bandNameEdit.value = band.bandName;
    form.leadSingerEdit.value = band.leadSinger;

    for (var genre in form.genreSelect.options) {
        var option = form.genreSelect.options[genre];
        if (option.value === band.genre)
        {
            option.selected = true;
        }
    }

    for (var homeState in form.stateSelect.options) {
        var option = form.stateSelect.options[homeState];
        if (option.value === band.homeState) {
            option.selected = true;
        }
    }

    form.yearsEdit.value = band.yearsAsABand;

    if(band.yesRadio)
    {
        form.spotifyBtn[0].checked = true;
    }
    else {
        form.spotifyBtn[1].checked = true;
    }

    form.phoneNumberEdit.value = band.phoneNumber;
    form.canText.checked = band.canText;

    //document.getElementById("bandEditArea").style.display = "block";
    //document.getElementById("bandListArea").style.display = "none";
    //document.getElementById("createBtn").style.display = "none";

    var updateBtn = document.getElementById("updateBtn");
    //updateBtn.stlye.display = "block";
    updateBtn.onclick = function() {
        onUpdateBtnClicked(band.id);

    }

}

function onUpdateBtnClicked(id) {
    if (!validateControls()) {
        return;
    }

    var form = document.forms["editForm"];
    var band = modelUpdateBand(
        id,
        form.bandNameEdit.value,
        form.leadSingerEdit.value,
        form.genreSelect.value,
        form.stateSelect.value,
        parseInt(form.yearsEdit.value),
        form.yesRadio.checked,
        parseInt(form.phoneNumberEdit.value),
        form.canText.checked);
    if(!band)
    {
        alert("unable to update Band ID=" + id);
        return;
    }

    //update row in table
    var tr = document.getElementById("row" + id);
    tr.childNodes[0].innerText = band.genre;
    tr.childNodes[1].innerText = band.bandName;
    tr.childNodes[2].innerText = band.homeState;


    clearInputForm();
}

function onDeleteBtnClicked(id) {
    var band = modelGetBand(id);
    if (!band) {
        alert("unable to find Band ID=" + id);
        return;
    }

    if(!confirm("Are you sure you want to delete " +
        band.bandName + "?")) {
        return;
    }

    modelDeleteBand(id);

    var tr = document.getElementById("row" + id);
    tr.remove();
}

function addTableItem(band) {
    var table = document.getElementById("bandTable");

    var row = table.insertRow(table.rows.length);
    row.id = 'row' + band.id;

    var cell = row.insertCell(0);
    cell.innerText = band.genre;

    var cell = row.insertCell(1);
    cell.innerText = band.bandName;

    var cell = row.insertCell(2);
    cell.innerText = band.homeState;

    var editBtn = document.createElement("button");
    editBtn.type = "button";
    editBtn.innerText = "Edit";
    editBtn.onclick = function () {
        onEditButtonClicked(band.id);
    }

    cell = row.insertCell(3);
    cell.appendChild(editBtn);

    var deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.innerText = "Delete";
    deleteBtn.onclick = function () {
        onDeleteBtnClicked(band.id);
    }

    cell = row.insertCell(4);
    cell.appendChild(deleteBtn);
}

function validateControls() {
    var form = document.forms["editForm"];
    var isValidated = true;

    if (form.bandNameEdit.value == "") {
        document.getElementById("bandNameError").innerText = "Band name is required.";
        isValidated = false;
    }
    else {
        document.getElementById("bandNameError").innerText = "";
    }
    if (form.leadSingerEdit.value === "") {
        document.getElementById("leadSingerError").innerText = "Lead Singer is required.";
        isValidated = false;
    }
    else {
        document.getElementById("leadSingerError").innerText = "";
    }

    if (form.genreSelect.selectedIndex === -1) {
        document.getElementById("genreError").innerText = "*Genre is required.";
        isValidated = false;
    }
    else {
        document.getElementById("genreError").innerText = "";
    }

    if (form.stateSelect.selectedIndex === -1) {
        document.getElementById("stateError").innerText = "*State is required.";
        isValidated = false;
    }
    else {
        document.getElementById("stateError").innerText = "";
    }

    if (form.yearsEdit.value === "") {
        document.getElementById("yearsError").innerText = "*Years as a band is required.";
        isValidated = false;
    }
    else if (isNaN(parseInt(form.yearsEdit.value))) {
        document.getElementById("yearsError").innerText = "*Must an input a number.";
        isValidated = false;
    }
    else {
        document.getElementById("yearsError").innerText = "";
    }

    if (!form.yesRadio.checked && !form.noRadio.checked) {
        document.getElementById("spotifyError").innerText = "*Answer in this field is required.";
        isValidated = false;
    }
    else {
        document.getElementById("spotifyError").innerText = "";
    }

    if (form.phoneNumberEdit.value === "") {
        document.getElementById("phoneNumberError").innerText = "*Phone number is required.";
        isValidated = false;
    }
    else if (isNaN(parseInt(form.phoneNumberEdit.value))) {
        document.getElementById("phoneNumberError").innerText = "*Must be a number.";
        isValidated = false;
    }
    else if (form.phoneNumberEdit.value.length !== 10) {
        document.getElementById("phoneNumberError").innerText = "*Phone number must be 10 digits long.";
        isValidated = false;
    }
    else {
        document.getElementById("phoneNumberError").innerText = "";
    }

    return isValidated;
}

function clearInputForm() {
    //hide the form, show the contact list
    document.getElementById("bandEditArea").style.display = "none";
    document.getElementById("bandListArea").style.display = "block";

    //Clear out all the contols on the form.
    var form = document.forms["editForm"];

    form.bandNameEdit.value = "";
    document.getElementById("bandNameError").innerText = "";

    form.leadSingerEdit.value = "";
    document.getElementById("leadSingerError").innerText = "";

    form.genreSelect.selectedIndex = -1;
    document.getElementById("genreError").innerText = "";

    form.stateSelect.selectedIndex = -1;
    document.getElementById("stateError").innerText = "";

    form.yearsEdit.value = "";
    document.getElementById("yearsError").innerText = "";

    form.yesRadio.checked = false;
    form.noRadio.checked = false;
    document.getElementById("spotifyError").innerText = "";

    form.phoneNumberEdit.value = "";
    document.getElementById("phoneNumberError").innerText = "";

    form.canText.checked = false;
}