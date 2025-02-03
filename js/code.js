const urlBase = 'http://litcontactmanager.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";
let ids = [];
let state = 0;


// Function for saving user cookie upon logging in
function saveCookie() 
{
    let minutes = 20;
    let date = new Date();
    date.setTime(date.getTime() + (minutes * 60 * 1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

// Function to read cookie for user logging
function readCookie()
{
    userId = -1;
    let data = document.cookie;
    let splits = data.split(",");

    for (var i = 0; i < splits.length; i++) 
	{
        let token = splits[i].trim();
        let tokens = token.split("=");

        if (tokens[0] == "firstName") 
		{
            firstName = tokens[1];
        }

        else if (tokens[0] == "lastName") 
		{
            lastName = tokens[1];
        }

        else if (tokens[0] == "userId") 
		{
            userId = parseInt(tokens[1].trim());
        }
    }
	
    if (userId < 0) 
	{
        window.location.href = "index.html";
    }

    else 
	{
		document.getElementById("userName").innerHTML = "Welcome " + firstName;
		//loadContacts(0);
    }
}


// ==========================================================================================================


// Function for toggling between form views (login / signup)
function toggleSignup() 
{
    var log = document.getElementById("login");
    var reg = document.getElementById("signup");
    var but = document.getElementById("btn");
	var fox = document.getElementsByClassName("formUI");
	let buttons = document.getElementsByClassName("submitButton");

		document.getElementById("passwordRequirements").style.display = "none";
		document.getElementById("passFullname").style.display = "none";
        document.getElementById("passUsernameRequirements").style.display = "none"; 
		
		
	if(window.innerWidth > 1000)
	{
		for (let i = 0; i < fox.length; i++) 
		{
			fox[i].style.marginLeft = "500px"; 
		}
	}
		
	for (let i = 0; i < buttons.length; i++) 
	{
        buttons[i].style.background = "#8338EC"; 
		buttons[i].innerText = "Signup";
	}
    log.style.left = "-400px";
    reg.style.left = "0px";
    but.style.left = "130px";
}

// Function for toggling between form views (login / signup)
function toggleLogin() 
{
	console.log('Function triggered on page load!');
    var log = document.getElementById("login");
    var reg = document.getElementById("signup");
    var but = document.getElementById("btn");
	var fox = document.getElementsByClassName("formUI");
	let buttons = document.getElementsByClassName("submitButton");
	
	document.getElementById("passwordRequirements").style.display = "none";
	document.getElementById("passFullname").style.display = "none";
    document.getElementById("passUsernameRequirements").style.display = "none";
	
	for (let i = 0; i < fox.length; i++) 
	{
		fox[i].style.marginLeft = "300px"; 
	}

	for (let i = 0; i < buttons.length; i++) 
	{
        buttons[i].style.background = "#8338EC"; 
		buttons[i].innerText = "Login";
	}
	
	reg.style.left = "-400px";
    log.style.left = "0px";
    but.style.left = "0px";
}

// Function(s) for loading signup form upon page load (if requested)
function funny()
{
 localStorage.setItem('triggerFunction', 'true');
}
function onPageLoad() 
{
	 const shouldTrigger = localStorage.getItem('triggerFunction');
	 if(shouldTrigger === 'true')
	 {
		 localStorage.removeItem('triggerFunction'); 
		 toggleSignup();
	 }
	 else
	 {
		 
	 }
}
document.addEventListener("DOMContentLoaded", onPageLoad);


// ==========================================================================================================


// Login to the contacts page
function doLogin() 
{
    userId = 0;
    firstName = "";
    lastName = "";

    let login = document.getElementById("loginNameInput").value;
    let password = document.getElementById("loginPasswordInput").value;
	let buttons = document.getElementsByClassName("submitButton");
	
    var hash = md5(password);
    if (!validLoginForm(login, password)) 
	{
		for (let i = 0; i < buttons.length; i++) 
		{
			buttons[i].style.background = "#4E0707"; 
			buttons[i].innerText = "❌ Invalid Login";
		}
        return;
    }

    let tmp = {
        login: login,
        password: hash
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Login.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
	{
        xhr.onreadystatechange = function () 
		{
            if (this.readyState == 4 && this.status == 200) 
			{

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;

                if (userId < 1) 
				{
                    for (let i = 0; i < buttons.length; i++) 
					{
						buttons[i].style.background = "#4E0707"; 
						buttons[i].innerText = " Invalid Login : User not found ";
					}
					return;
                }
				
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
				
                saveCookie();
                window.location.href = "contacts.html";
            }
        };

        xhr.send(jsonPayload);
    } 
	catch (err) 
	{
        document.getElementById("loginResult").innerHTML = err.message;
    }
}

// Register a new user. then login with this new account
function doSignup() 
{
    firstName = document.getElementById("firstName").value;
    lastName = document.getElementById("lastName").value;

    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
	
	let buttons = document.getElementsByClassName("submitButton");

    if (!validSignUpForm(username, password)) 
	{
        for (let i = 0; i < buttons.length; i++) 
		{
			buttons[i].style.background = "#4E0707"; 
			buttons[i].innerText = "❌ Invalid Signup";
		}
    }

    var hash = md5(password);

    
    let tmp = {
        firstName: firstName,
        lastName: lastName,
        login: username,
        password: hash
    };

    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/Registration.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try 
	{
        xhr.onreadystatechange = function () 
		{

            if (this.readyState != 4) 
			{
                return;
            }

            if (this.status == 409) 
			{
               for (let i = 0; i < buttons.length; i++) 
			   {
					buttons[i].style.background = "#4E0707"; 
					buttons[i].innerText = "This User Already Exists";
			   }
            }

            if (this.status == 200) 
			{

                let jsonObject = JSON.parse(xhr.responseText);
                userId = jsonObject.id;
                for (let i = 0; i < buttons.length; i++) 
			   {
					buttons[i].style.background = "green"; 
					buttons[i].innerText = "User Added";
			   }
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
                saveCookie();
            }
        };

        xhr.send(jsonPayload);
    } 
	catch (err) 
	{
        document.getElementById("signupResult").innerHTML = err.message;
    }
	
	 let url2 = urlBase + '/Login.' + extension;

    let xhr2 = new XMLHttpRequest();
    xhr2.open("POST", url2, true);
    xhr2.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
	{
        xhr2.onreadystatechange = function ()
		{
            if (this.readyState == 4 && this.status == 200) 
			{

                let jsonObject = JSON.parse(xhr2.responseText);
                userId = jsonObject.id;

                if (userId < 1) 
				{
                    document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
                    return;
                }
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;
				
				

                saveCookie();
                window.location.href = "contacts.html";
            }
        };

        xhr2.send(jsonPayload);
    }
	catch (err) 
	{
        document.getElementById("loginResult").innerHTML = err.message;
    }
}


function doLogout() 
{
    userId = 0;
    firstName = "";
    lastName = "";

    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}


// ==========================================================================================================


function toggleTable()
{
	var icon = document.getElementById("add");
    var contacted = document.getElementById("addContact");
    var tabled = document.getElementById("contactsTable");
	var buttonIcon = document.getElementById("adtable");
	
	
    if (contacted.style.display === "none") 
	{
		
		icon.style.boxShadow = "-1px -1px 1px 0 rgba(255, 255, 255, .2), inset -2px -2px 2px 0 rgba(255, 255, 255, .2), inset 2px 2px 3px 0 rgba(0, 0, 0, .4)";
		
		buttonIcon.innerText = "table_chart";
		icon.style.backgroundColor = "#391a7a";
        contacted.style.display = "flex";
        tabled.style.display = "none";
    } 
	
	else 
	{
		icon.style.boxShadow = "none";
		buttonIcon.innerText = "add";
		icon.style.backgroundColor = "#7338EC";
        contacted.style.display = "none";
        tabled.style.display = "block";
    }
}
 
function addContact() 
{

    let firstname = document.getElementById("contactTextFirst").value;
    let lastname = document.getElementById("contactTextLast").value;
    let phonenumber = document.getElementById("contactTextNumber").value;
    let emailaddress = document.getElementById("contactTextEmail").value;

    let tmp = {
        FirstName: firstname,
        LastName: lastname,
        Phone: phonenumber,
        Email: emailaddress,
        UserID: userId
    };
	

    let jsonPayload = JSON.stringify(tmp);
	//console.log(jsonPayload);
	
    let url = urlBase + '/contactCreate.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
	{
        xhr.onreadystatechange = function () 
		{
            if (this.readyState == 4 && this.status == 200) 
			{
                console.log("Contact has been added");
                document.getElementById("addContact").reset();
                toggleTable();
				loadContacts(0);

            }
        };
        xhr.send(jsonPayload);
    } 
	catch (err) 
	{
        console.log(err.message);
    }
}

function loadContacts(state) 
{
	if(state == undefined)
	{
		state = 0;
	}
	
	var searchInput = document.getElementById("searchText").value.trim();
	
	let id = 0;
	
    let tmp = {
        search: "",
        userId: userId
    };
	
    let jsonPayload = JSON.stringify(tmp);

    let url = urlBase + '/searchContact.' + extension;
    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try 
	{
        xhr.onreadystatechange = function () 
		{
            if (this.readyState == 4 && this.status == 200) 
			{
                let jsonObject = JSON.parse(xhr.responseText);
                if (jsonObject.error) 
				{
                    console.log(jsonObject.error);
                    return;
                }
                let text = "<table border='2'>"
                for (let i = 0; i < jsonObject.results.length; i++) 
				{
					if(state == 0)
					{	
						ids[i] = jsonObject.results[i].ID
						text += "<tr id='row" + i + "'>"
						text += "<td id='first_Name" + i + "'><span>" + jsonObject.results[i].FirstName + "</span></td>";
						text += "<td id='last_Name" + i + "'><span>" + jsonObject.results[i].LastName + "</span></td>";
						text += "<td id='email" + i + "'><span>" + jsonObject.results[i].Email + "</span></td>";
						text += "<td id='phone" + i + "'><span>" + jsonObject.results[i].Phone + "</span></td>";
						console.log("values of the array", ids[i]);
					}
					else if (state == 1)
					{
						ids[i] = jsonObject.results[i].ID
					    text += "<tr id='row" + i + "'>"
						text += "<td id='first_Name" + i + "'><span onclick='editContact(" + i + ")'>" + jsonObject.results[i].FirstName + "</span></td>";
						text += "<td id='last_Name" + i + "'><span onclick='editContact(" + i + ")'>" + jsonObject.results[i].LastName + "</span></td>";
						text += "<td id='email" + i + "'><span onclick='editContact(" + i + ")'>" + jsonObject.results[i].Email + "</span></td>";
						text += "<td id='phone" + i + "'><span onclick='editContact(" + i + ")'>" + jsonObject.results[i].Phone + "</span></td>";
						
					}
					else if (state == 2)
					{
						ids[i] = jsonObject.results[i].ID
						text += "<tr id='row" + i + "'>"
						text += "<td id='first_Name" + i + "'><span onclick='deleteContact(" + i + ")'>" + jsonObject.results[i].FirstName + "</span></td>";
						text += "<td id='last_Name" + i + "'><span onclick='deleteContact(" + i + ")'>" + jsonObject.results[i].LastName + "</span></td>";
						text += "<td id='email" + i + "'><span onclick='deleteContact(" + i + ")'>" + jsonObject.results[i].Email + "</span></td>";
						text += "<td id='phone" + i + "'><span onclick='deleteContact(" + i + ")'>" + jsonObject.results[i].Phone + "</span></td>";
						
					}
                }
                text += "</table>"
				
				if(searchInput === "")
				{
					console.log("efjiejf");
					return;
				}
                document.getElementById("tbody").innerHTML = text;
				searchContacts();
            }
        };
        xhr.send(jsonPayload);
    }
	catch (err) 
	{
        console.log(err.message);
    }
}


// ==========================================================================================================


function beginEdit()
{
	loadContacts(1);
	document.getElementById("toggle").style.backgroundColor = "#01661a";
	document.getElementById("swicon").innerText = "check";
	document.getElementById("toggle").style.boxShadow = "-1px -1px 1px 0 rgba(255, 255, 255, .2), inset -2px -2px 2px 0 rgba(255, 255, 255, .2), inset 2px 2px 3px 0 rgba(0, 0, 0, .4)";
}

function editContact(id) 
{
    var firstNameI = document.getElementById("first_Name" + id);
    var lastNameI = document.getElementById("last_Name" + id);
    var email = document.getElementById("email" + id);
    var phone = document.getElementById("phone" + id);

    var namef_data = firstNameI.innerText;
    var namel_data = lastNameI.innerText;
    var email_data = email.innerText;
    var phone_data = phone.innerText;
	

    firstNameI.innerHTML = "<input type='text' id='namef_text" + id + "' value='" + namef_data + "'>";
    lastNameI.innerHTML = "<input type='text' id='namel_text" + id + "' value='" + namel_data + "'>";
    email.innerHTML = "<input type='text' id='email_text" + id + "' value='" + email_data + "'>";
    phone.innerHTML = "<input type='text' id='phone_text" + id + "' value='" + phone_data + "'>"
	beginSave(id);
}

function beginSave(Id)
{
	document.getElementById("toggle").onclick = function() {saveContact(Id)};
}

function saveContact(no) 
{
    var namef_val = document.getElementById("namef_text" + no).value;
    var namel_val = document.getElementById("namel_text" + no).value;
    var email_val = document.getElementById("email_text" + no).value;
    var phone_val = document.getElementById("phone_text" + no).value;
	var id_val = ids[no]

    document.getElementById("first_Name" + no).innerHTML = namef_val;
    document.getElementById("last_Name" + no).innerHTML = namel_val;
    document.getElementById("email" + no).innerHTML = email_val;
    document.getElementById("phone" + no).innerHTML = phone_val;

    let contactID = id_val; 

    let tmp = {
        Id: contactID, 
        phoneNumber: phone_val,
        emailAddress: email_val,
        newFirstName: namef_val,
        newLastName: namel_val,
        UserID: userId,
    };

    let jsonPayload = JSON.stringify(tmp);
    console.log(jsonPayload);

    let url = urlBase + '/contactUpdate.' + extension;

    let xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try 
	{
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Contact has been updated");
                loadContacts(0);
            }
        };
        xhr.send(jsonPayload);
    } 
	catch (err) 
	{
        console.log(err.message);
    }
	
	document.getElementById("toggle").onclick = function() {beginEdit()};
	document.getElementById("swicon").innerText = "app_registration";
	
	document.getElementById("toggle").style.boxShadow = "none";
	document.getElementById("toggle").style.backgroundColor = "#7338EC";
	
}

function beginDelete()
{
	loadContacts(2);
	document.getElementById("delete").style.backgroundColor = "#750202";
	document.getElementById("delete").style.boxShadow = "-1px -1px 1px 0 rgba(255, 255, 255, .2), inset -2px -2px 2px 0 rgba(255, 255, 255, .2), inset 2px 2px 3px 0 rgba(0, 0, 0, .4)";
}

function deleteContact(no) 
{
    var namef_val = document.getElementById("first_Name" + no).innerText;
    var namel_val = document.getElementById("last_Name" + no).innerText;
    nameOne = namef_val.substring(0, namef_val.length);
    nameTwo = namel_val.substring(0, namel_val.length);
    let check = confirm('Are you sure you would like to delete ' + nameOne + ' ' + nameTwo + '?');
    if (check === true) 
	{
        document.getElementById("row" + no + "").outerHTML = "";
		
        let tmp = {
            FirstName: nameOne,
            LastName: nameTwo,
            UserId: userId
        };

        let jsonPayload = JSON.stringify(tmp);

        let url = urlBase + '/deleteContact.' + extension;

        let xhr = new XMLHttpRequest();
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
        try 
		{
            xhr.onreadystatechange = function () 
			{
                if (this.readyState == 4 && this.status == 200) 
				{

                    console.log("Contact has been deleted");
                    loadContacts(0);
                }
            };
            xhr.send(jsonPayload);
        } 
		catch (err) 
		{
            console.log(err.message);
        }

    };
	
	document.getElementById("delete").style.backgroundColor = "#7338EC";
	document.getElementById("delete").style.boxShadow = "none";

}

function searchContacts() 
{
	
    const content = document.getElementById("searchText");
    const selections = content.value.toUpperCase().split(' ');
    const table = document.getElementById("contacts");
    const tr = table.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) 
	{
        const td_fn = tr[i].getElementsByTagName("td")[0];
        const td_ln = tr[i].getElementsByTagName("td")[1];

        if (td_fn && td_ln)
		{
            const txtValue_fn = td_fn.textContent || td_fn.innerText;
            const txtValue_ln = td_ln.textContent || td_ln.innerText;
            tr[i].style.display = "none";

            for (selection of selections) 
			{
                if (txtValue_fn.toUpperCase().indexOf(selection) > -1) 
				{
                    tr[i].style.display = "";
                }
                if (txtValue_ln.toUpperCase().indexOf(selection) > -1) 
				{
                    tr[i].style.display = "";
                }
            }
        }
    }
}


// ==========================================================================================================


function validLoginForm(name, pass) 
{
	var regex = /(?=.*[a-zA-Z])[a-zA-Z0-9-_]{3,18}$/;
	var userNameErr = passErr = true;

    if (regex.test(name) == false) 
	{
        console.log("INVALID Username");
    }

    else 
	{
        console.log("Valid Username");
        userNameErr = false;
    }
  
	
	var regex2 = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

    if (regex2.test(pass) == false)
	{
        console.log("INVALID Password");
    }

    else 
	{

        console.log("Valid Password");
        passErr = false;
    }
	
    if ((userNameErr || passErr) == true) 
	{
        return false;
    }
    return true;
}

function validSignUpForm(user, pass) 
{
	var regex = /(?=.*[a-zA-Z])([a-zA-Z0-9-_]).{3,18}$/;
    var userNameErr = passErr = true;
	
    if (regex.test(user) == false) 
	{
        console.log("INVALID Username");
    }

    else 
	{
        console.log("Valid Username");
        userNameErr = false;
    }
  
    var regex2 = /(?=.*\d)(?=.*[A-Za-z])(?=.*[!@#$%^&*]).{8,32}/;

    if (regex2.test(pass) == false) 
	{
        console.log("INVALID Password");
    }

    else 
	{

        console.log("Valid Password");
        passErr = false;
    }
    
    if ((userNameErr || passErr) == true)
	{
        return false;
    }
    return true;
}