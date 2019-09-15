/*const dreams=[];
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
*/

let curUser;

const submit = function (e) {
    e.preventDefault()
    let dropdown = document.getElementById("categoryOptions");
    const itemName = document.querySelector('#itemName').value,
        url = document.querySelector('#link').value,
        category = dropdown.options[dropdown.selectedIndex].value,
        list= document.querySelector('input[name="listName"]:checked').value,
        retailer = document.querySelector('input[name="retailer"]:checked').value;
        let specifiedListName;
        switch (retailer) {
            case 'need':
                specifiedListName = 'need';
                break
            case 'want':
                specifiedListName='want';
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
                'URL': url,
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
    displayDB();
};

const fillTableInfo = function (shoppingData, editRowNum) {
    let wishListTable = document.querySelector('#itemTable');
    wishListTable.innerHTML =
        '<tr>\n' +
        '<th align="center">Item Name</th>\n' +
        '<th align="center">Category</th>\n' +
        '<th align="center">List</th>\n' +
        '<th align="center">Specified Retailer Only?</th>\n' +
        '<th align="center">URL</th>\n' +
        '<th align="center">Edit</th>\n' +
        '<th align="center">Delete</th>\n' +
        '</tr>';
    for (let i = 0; i < shoppingData.length; i++) {
        const itemOfChoice = shoppingData[i];
        //if(itemOfChoice.user === curUser)
        //{
            let newLine = '<tr>\n';
            if(i === editRowNum) {
                newLine += ('<td align="center">' + '<input id="itemNameInput' + i + '" type="text" value="' + itemOfChoice.updatedItem + '"> </div></td>\n');
                newLine += ('<td align="center">' + '<input id="linkInput' + i + '" type="text" value="' + itemOfChoice.updatedLink + '"> </div></td>\n');
                newLine += ('<td align="center">' + '<input id="listInput' + i + '" type="text" value="' + itemOfChoice.updatedList + '"> </div></td>\n');
                newLine += ('<td align="center">' + '<input id="categoryInput' + i + '" type="text" value="' + itemOfChoice.updatedCategory + '"></div></td>\n');
                newLine += ('<td align="center">' + '<input id="retailerInput' + i + '" type="text" value="' + itemOfChoice.updatedRetailer + '"></div></td>\n');
                newLine += ('<td align="center">' + '<button id="update' + i + '" onclick="updateRow(' + i + ')"> Update </button></div></td>\n');
                newLine += ('<td align="center">' +  '<button id="delete' + i + '" onclick="deleteRow(' + i + ')"> X </button></div></td>\n');
                newLine += '</tr>';
            }
            else {
                newLine += ('<td align="center">' + itemOfChoice.itemName + '</div></td>\n');
                newLine += ('<td align="center">' + itemOfChoice.url + '</div></td>\n');
                newLine += ('<td align="center">' + itemOfChoice.category + '</td>\n');
                newLine += ('<td align="center">' + itemOfChoice.list + '</td>\n');
                newLine += ('<td align="center">' + itemOfChoice.retailer + '</td>\n');
                newLine += ('<td align="center">' + '<button id="' + i + '" onclick="editRow(' + i + ')"> Edit </button></td>\n');
                newLine += ('<td align="center">' + '<button id="' + i + '" onclick="deleteRow(' + i + ')"> X </button></td>\n');
                newLine += '</div>' + '</tr>';
            }
            wishListTable.innerHTML += newLine
        //}
    }
}

const displayDB = function () {
    fetch('/newData', {
        method: 'GET'
    }).then(function(response) {
        return response.json()
    }).then(function (dataRow) {
        fillTableInfo(dataRow, -999)
    })
}

window.onload = function () {
    fetch( '/test', {
        method:'POST',
        credentials: 'include'
    }).then( console.log )
        .catch( err => console.error );
    // const homeLoginButton = document.getElementById('homelogin')
    // const cancelLoginButton = document.getElementById('cancelLogin')
    const submitButton = document.getElementById('submitButton');
    // const loginButton = document.getElementById('loginButton')
    // const registerButton = document.getElementById('register')
    // const cancelRegisterButton = document.getElementById('cancelRegister')
    // const confirmRegisterButton = document.getElementById('confirmRegister')
    // const logoutButton = document.getElementById('logout')
    // homeLoginButton.onclick = homeLogin
    submitButton.onclick = submit;
    // loginButton.onclick = login
    // cancelLoginButton.onclick = cancelLogin
    // registerButton.onclick = register
    // cancelRegisterButton.onclick = cancelRegister
    // confirmRegisterButton.onclick = confirmRegister
    // logoutButton.onclick = logout
}