let curUser;


const hideForm = function (e) {
    e.preventDefault();
    document.getElementById('inputForm').style.display = ""
};

const register = function (e) {
    e.preventDefault();
    const username = document.getElementById('inputUsername').value,
        password = document.getElementById('inputPassword').value;
    console.log("regUsername:"+username);
    console.log("regPassword:"+password);
    fetch('/register', {
        method: 'GET'
    }).then(function (response) {
        return response.json()
    }).then(function (userList) {
        addUser(userList, username, password)
    })
};

function addUser(userList, username, password) {
    const json = {
            'username': username,
            'password': password
        },
        body = JSON.stringify(json);
    fetch('/register', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body
    })
}

const login = function (e) {
    e.preventDefault();
    const username = document.getElementById('usernameField').value,
        password = document.getElementById('passwordField').value;
    console.log("loginUsername:"+username);
    console.log("loginPassword:"+password);
    const user = {
            'username': username,
            'password': password
        },
        body = JSON.stringify(user);
    console.log(body);
    fetch('/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body
    }).then(function (response) {
        if (response.status === 200) {
            curUser = username;
            displayDB();
        } else {
            alert("Something bad happened!")
        }
        fetch('/register', {
            method: 'GET'
        }).then(function (response) {
            return response.json()
        }).then(function (users) {
            console.log(users)
        })
    })
}

const submit = function (e) {
    e.preventDefault()
    let dropdown = document.getElementById("categoryOptions");
    const itemName = document.querySelector('#itemName').value,
        url = document.querySelector('#link').value,
        category = dropdown.options[dropdown.selectedIndex].value,
        list = document.querySelector('input[name="listName"]:checked').value,
        retailer = document.querySelector('input[name="retailer"]:checked').value;
    let specifiedListName;
    switch (retailer) {
        case 'need':
            specifiedListName = 'need';
            break;
        case 'want':
            specifiedListName = 'want';
            break;
        default:
            if (document.getElementById('otherListName').checked) {
                specifiedListName = document.getElementById('inputListName').value
            }
            const json = {
                    'itemName': itemName,
                    'category': category,
                    'list': list,
                    'specifiedRetailerOnly': specifiedListName,
                    'URL': url,
                },
                body = JSON.stringify(json);

            fetch('/submit', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body
            }).then(function (response) {
            })

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
    document.getElementById("otherListName").value = "";
    document.getElementById("inputListName").value = "";
}

const updateRow = function (row) {
    let updateItemName = document.getElementById('itemNameInput' + row).value;
    let updateLink = document.getElementById('linkInput' + row).value;
    let updateList = document.getElementById('listInput' + row).value;
    let updateCategory = document.getElementById('categoryInput' + row).value
    let updateRetailer = document.getElementById('retailerInput' + row).value;
    const json = {
        'itemName': updateItemName,
        'category': updateCategory,
        'list': updateList,
        'specifiedRetailerOnly': updateRetailer,
        'URL': updateLink,
    }
    json.index = row
    const body = JSON.stringify(json);
    fetch('/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body
    }).then(function (response) {
        displayDB()
    })
};

const editRow = function (i) {
    fetch('/newData', {
        method: 'GET'
    }).then(function (response) {
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
        headers: {'Content-Type': 'application/json'},
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
        if(itemOfChoice.user === curUser)
        {
        let newLine = '<tr>\n';
        if (i === editRowNum) {
            newLine += ('<td align="center">' + '<input id="itemNameInput' + i + '" type="text" value="' + itemOfChoice.updatedItem + '"> </div></td>\n');
            newLine += ('<td align="center">' + '<input id="linkInput' + i + '" type="text" value="' + itemOfChoice.updatedLink + '"> </div></td>\n');
            newLine += ('<td align="center">' + '<input id="listInput' + i + '" type="text" value="' + itemOfChoice.updatedList + '"> </div></td>\n');
            newLine += ('<td align="center">' + '<input id="categoryInput' + i + '" type="text" value="' + itemOfChoice.updatedCategory + '"></div></td>\n');
            newLine += ('<td align="center">' + '<input id="retailerInput' + i + '" type="text" value="' + itemOfChoice.updatedRetailer + '"></div></td>\n');
            newLine += ('<td align="center">' + '<button id="update' + i + '" onclick="updateRow(' + i + ')"> Update </button></div></td>\n');
            newLine += ('<td align="center">' + '<button id="delete' + i + '" onclick="deleteRow(' + i + ')"> X </button></div></td>\n');
            newLine += '</tr>';
        } else {
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
        }
    }
}

const displayDB = function () {
    fetch('/newData', {
        method: 'GET'
    }).then(function (response) {
        return response.json()
    }).then(function (dataRow) {
        fillTableInfo(dataRow, -999)
    })
}

window.onload = function () {
    fetch('/test', {
        method: 'POST',
        credentials: 'include'
    }).then(console.log)
        .catch(err => console.error);
    // const submitButton = document.getElementById('homelogin')
    console.log("I am here!");
    const registerButton = document.getElementById('registerBtn');
    const loginButton = document.getElementById('loginBtn');
    const submitButton = document.getElementById('submitBtn');
    console.log("I am here yo!")
    submitButton.onclick = hideForm;
    submitButton.onclick = submit;
    registerButton.onclick = register;
    loginButton.onclick = login;
    // logoutButton.onclick = logout
}

//window.location.href="/someurl";