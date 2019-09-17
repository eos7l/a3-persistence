let curUser;

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
        window.location=('/');
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
            window.location='main';
            //displayDB();
        } else {
            console.log("curUser="+curUser);
            console.log("username="+username);
            console.log(response);
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
}
