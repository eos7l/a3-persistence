// fetch('/loggeduser', {
//     method: 'GET',
//     headers: {'Content-Type': 'application/json'}
// })
//     .then(function (res) {
//         return res.json()
//     })
//     .then(function (res) {
//         curUser=res.username});
// let curUser;


const register = function (e) {
    e.preventDefault();
    const username = document.getElementById('inputUsername').value,
        password = document.getElementById('inputPassword').value;
    console.log("regUsername:" + username);
    console.log("regPassword:" + password);
    fetch('/register', {
        method: 'GET'
    }).then(function (response) {
        return response.json()
    }).then(function (userList) {
        addUser(userList, username, password);
        window.location = ('/');
    })
};

function addUser(userList, username, password) {
    console.log("userList:" + userList);
    let duplicateAccount = false;
    for (let i = 0; i < userList.length; i++) {
        if (userList[i].username === username) {
            duplicateAccount = true;
            i = userList.length;
        }
    }
    if (duplicateAccount === true) {
        const json = {
                'username': username,
                'password': password
            },
            body = JSON.stringify(json);
        fetch('/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body
        }).then(function (response) {
        });
        document.getElementById('inputUsername').value = "";
        document.getElementById('inputPassword').value = '';
    }
}

const login = function (e) {
    e.preventDefault();
    const username = document.getElementById('usernameField').value,
        password = document.getElementById('passwordField').value;
    console.log("loginUsername:" + username);
    console.log("loginPassword:" + password);
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
            document.cookie=curUser;
            window.location = 'main';
            displayDB();
        } else {
            console.log("curUser=" + curUser);
            console.log("username=" + username);
            console.log(response);
            alert("Authentication failed!")
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


const hideForm = function () {
    console.log("I got here");
    //e.preventDefault();
    document.getElementById('inputForm').style.display = "none"
};

const displayDB = function () {
    fetch('/newData', {
        method: 'GET'
    }).then(function (response) {
        return response.json()
    }).then(function (dataRow) {
        fillTableInfo(dataRow, -999)
    })
}

const submit = function (e) {
    e.preventDefault();
    let dropdown = document.getElementById("categoryOptions");
    const itemName = document.querySelector('#itemName').value,
        category = dropdown.options[dropdown.selectedIndex].value,
        list = document.querySelector('input[name="listName"]:checked').value,
        retailer = document.querySelector('input[name="retailer"]:checked').value;
         url = document.querySelector('#url').value;
    let specifiedListName;
    switch (list) {
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
    }
    const json = {
            'user': document.cookie,
            'itemName': itemName,
            'category': category,
            'list': specifiedListName,
            'oneRetailerOnly': retailer,
            'URL': url,
        },
        body = JSON.stringify(json);
    //console.log("before fetch");
    fetch('/submit', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body
    }).then(function (response) {
    })
    // if(curUser===username){
    displayDB();
    //hideForm();
    //}
    return false
};

function changeRadioButton() {
    var other = document.getElementById("otherListName");
    other.value = document.getElementById("inputListName").value;
    other.checked = true;
    console.log(other.value)
}

function clearChoice() {
    document.getElementById("otherListName").value = "";
    document.getElementById("inputListName").value = "";
}

const updateRow = function (row) {
    //document.getElementById("itemTable").style.width="auto";
    //document.querySelector("#itemTable").style.width=auto;
    let updateItemName = document.getElementById('itemNameInput' + row).value;
    let updateCategory = document.getElementById('categoryInput' + row).value;
    let updateList = document.getElementById('listInput' + row).value;
    let updateRetailer = document.getElementById('retailerInput' + row).value;
    let updateLink = document.getElementById('linkInput' + row).value;
    const json = {
        'itemName': updateItemName,
        'category': updateCategory,
        'list': updateList,
        'oneRetailerOnly': updateRetailer,
        'URL': updateLink,
    }
    json.index = row;
    const body = JSON.stringify(json);
    fetch('/update', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body
    }).then(function (response) {
        displayDB();
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
    console.log("I got up to here!");
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
        const userItemChoice = shoppingData[i];
        //curUser=document.cookie;
        if (userItemChoice.user === curUser) {
            let newLine = '<tr>\n';
            if (i === editRowNum) {
                newLine += ('<td align="center">' + '<input id="itemNameInput' + i + '" type="text" value="' + userItemChoice.updatedItem + '"> </div></td>\n');
                newLine += ('<td align="center">' + '<input id="categoryInput' + i + '" type="text" value="' + userItemChoice.updatedCategory + '"></div></td>\n');
                newLine += ('<td align="center">' + '<input id="listInput' + i + '" type="text" value="' + userItemChoice.updatedList + '"> </div></td>\n');
                newLine += ('<td align="center">' + '<input id="retailerInput' + i + '" type="text" value="' + userItemChoice.updatedRetailer + '"></div></td>\n');
                newLine += ('<td align="center">' + '<input id="linkInput' + i + '" type="text" value="' + userItemChoice.updatedLink + '"> </div></td>\n');
                newLine += ('<td align="center">' + '<button id="update' + i + '" onclick="updateRow(' + i + ')"> Update </button></div></td>\n');
                newLine += ('<td align="center">' + '<button id="delete' + i + '" onclick="deleteRow(' + i + ')"> X </button></div></td>\n');
                newLine += '</tr>';
            } else {
                newLine += ('<td align="center">' + userItemChoice.itemName + '</div></td>\n');
                newLine += ('<td align="center">' + userItemChoice.category + '</td>\n');
                newLine += ('<td align="center">' + userItemChoice.list + '</td>\n');
                newLine += ('<td align="center">' + userItemChoice.retailer + '</td>\n');
                newLine += ('<td align="center">' + userItemChoice.url + '</div></td>\n');
                newLine += ('<td align="center">' + '<button id="' + i + '" onclick="editRow(' + i + ')"> Edit </button></td>\n');
                newLine += ('<td align="center">' + '<button id="' + i + '" onclick="deleteRow(' + i + ')"> X </button></td>\n');
                newLine += '</div>' + '</tr>';
            }
            wishListTable.innerHTML += newLine
        }
    }
};

window.onload = function () {
    fetch('/test', {
        method: 'POST',
        credentials: 'include'
    }).then(console.log)
        .catch(err => console.error);
    const registerButton = document.getElementById('registerBtn');
    const loginButton = document.getElementById('loginBtn');
    if (registerButton !== null) {
        registerButton.onclick = register;
    }
    if (loginButton !== null) {
        loginButton.onclick = login;
    }
};
