const dreams=[];
// define variables that reference elements on our page
const dreamsList = document.getElementById('dreams');
const dreamsForm = document.forms[0];
const dreamInput = dreamsForm.elements['dream'];

// a helper function that creates a list item for a given dream
const appendNewDream = function (dream) {
    const newListItem = document.createElement('li');
    newListItem.innerHTML = dream;
    dreamsList.appendChild(newListItem);
}
// iterate through every dream and add it to our page
dreams.forEach(function (dream) {
    appendNewDream(dream);
});
// listen for the form to be submitted and add a new dream when it is
dreamsForm.onsubmit = function (event) {
    // stop our form submission from refreshing the page
    event.preventDefault();
    // get dream value and add it to the list
    dreams.push(dreamInput.value);
    appendNewDream(dreamInput.value);
    // reset form
    dreamInput.value = '';
    dreamInput.focus();
};


const submit = function (e) {
    e.preventDefault()
    let dropdown = document.getElementById("categoryOptions");
    const itemName = document.querySelector('#itemName').value,
        link = document.querySelector('#link').value,
        category = dropdown.options[dropdown.selectedIndex].value,
        list= document.querySelector('input[name="listName"]:checked').value,
        retailer = document.querySelector('input[name="retailer"]:checked').value;
        let specifiedListName;
        switch (retailer) {
            case 'need':
                specifiedListName = 'need'
                break
            case 'want':
                specifiedListName='want'
                break
            default:
                if(document.getElementById('otherListName').checked) {
                    specifiedListName = document.getElementById('inputListName').value
                }

        const json = {
                'itemName': itemName,
                'category': category,
                'list': list,
                'specifiedRetailerOnly': specifiedListName,
                'URL': link,
            },

            body = JSON.stringify(json)

        fetch('/submit', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body
        }).then(function (response) {})

        displayDB();
        return false
    }
}

function changeRadioButton() {
    var other = document.getElementById("otherListName");
    other.value = document.getElementById("inputListName").value;
    other.checked = true
    console.log(other.value)
}

function clearChoice() {
    document.getElementById("otherListName").value = ""
    document.getElementById("inputListName").value = ""
}

const updateRow = function (row) {
    let updateItemName = document.getElementById('itemNameInput'+row).value;
    let updateLink = document.getElementById('linkInput' + row).value;
    let updateList = document.getElementById('listInput' + row).value;
    let updateCategory = document.getElementById('categoryInput' + row).value
    let updateRetailer = document.getElementById('retailerInput' + row).value;
    const json = {
        'itemName': updateItemName,
        'category': updateCategory,
        'list': updateLink,
        'specifiedRetailerOnly': updateList,
        'URL': updateLink,
    }
    json.index = row
    const body = JSON.stringify(json);
    fetch('/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    }).then(function(response){
        displayDB()
    })
};

const editRow = function (i) {
    fetch('/newData', {
        method: 'GET'
    }).then(function(response) {
        return response.json()
    }).then(function (itemData) {
        fillTableInfo(itemData, i)
    })
}

const deleteRow = function (row) {
    const deletedData = {deletedData: row};
    console.log(row);
    const body = JSON.stringify(deletedData);
    fetch('/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body
    });
    diplayDB();
};


const genTable = function (studentList, editIndex) {
    let studentTable = document.querySelector('#HogwartsStudents');
    studentTable.innerHTML =
        '<tr>\n' +
        '<th align="center">First Name</th>\n' +
        '<th align="center">Last Name</th>\n' +
        '<th align="center">Pronouns</th>\n' +
        '<th align="center">House</th>\n' +
        '<th align="center">Edit</th>\n' +
        '<th align="center">Delete</th>\n' +
        '</tr>';

    for (let i = 0; i < studentList.length; i++) {
        const currentStudent = studentList[i];
        if(currentStudent.user === currUser) {
            let newLine = '<tr>\n';
            var houseColor;
            if(currentStudent.house === 'Gryffindor' || currentStudent.house === 'gryffindor') {
                currentStudent.house = 'Gryffindor'
                houseColor = '<div id="gryffindorbg">'
            }
            else if(currentStudent.house === 'Hufflepuff' || currentStudent.house === 'hufflepuff') {
                currentStudent.house = 'Hufflepuff'
                houseColor = '<div id="hufflepuffbg">'
            }
            else if(currentStudent.house === 'Ravenclaw' || currentStudent.house === 'ravenclaw') {
                currentStudent.house = 'Ravenclaw'
                houseColor = '<div id="ravenclawbg">'
            }
            else if(currentStudent.house === 'Slytherin' || currentStudent.house === 'slytherin') {
                currentStudent.house = 'Slytherin'
                houseColor = '<div id="slytherinbg">'
            }
            else {
                currentStudent.house = 'Muggle'
                houseColor = '<div id="mugglebg">'
            }
            if(i === editIndex) {
                newLine += ('<td align="center">' + houseColor + '<input id="firstName' + i + '" type="text" value="' + currentStudent.firstName + '"> </div></td>\n');
                newLine += ('<td align="center">' + houseColor + '<input id="lastName' + i + '" type="text" value="' + currentStudent.lastName + '"> </div></td>\n');
                newLine += ('<td align="center">' + houseColor + '<input id="pronouns' + i + '" type="text" value="' + currentStudent.pronouns + '"> </div></td>\n');
                newLine += ('<td align="center">' + houseColor + '<input id="house' + i + '" type="text" value="' + currentStudent.house + '"></div></td>\n');
                newLine += ('<td align="center">' + houseColor + '<button id="update' + i + '" onclick="updateRow(' + i + ')"> Update </button></div></td>\n');
                newLine += ('<td align="center">' + houseColor + '<button id="delete' + i + '" onclick="deleteRow(' + i + ')"> X </button></div></td>\n');
                newLine += '</tr>';
            }
            else {
                newLine += ('<td align="center">' + houseColor + currentStudent.firstName + '</div></td>\n');
                newLine += ('<td align="center">' + houseColor + currentStudent.lastName + '</div></td>\n');
                newLine += ('<td align="center">' + houseColor + currentStudent.pronouns + '</td>\n');
                newLine += ('<td align="center">' + houseColor+ currentStudent.house + '</td>\n');
                newLine += ('<td align="center">' + houseColor + '<button id="' + i + '" onclick="editRow(' + i + ')"> Edit </button></td>\n');
                newLine += ('<td align="center">' + houseColor + '<button id="' + i + '" onclick="deleteRow(' + i + ')"> X </button></td>\n');
                newLine += '</div>' + '</tr>';
            }

            studentTable.innerHTML += newLine
        }

    }
}


const displayDB = function () {
    fetch('/newData', {
        method: 'GET'
    }).then(function(response) {
        return response.json()
    }).then(function (dataRow) {
        genTable(dataRow, -999)
    })
}