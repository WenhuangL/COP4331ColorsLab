
const urlBase = 'http://COP4331-5.com/LAMPAPI';
const extension = 'php';

let userId = 0;
let firstName = "";
let lastName = "";

function doLogin()
{
	userId = 0;
	firstName = "";
	lastName = "";
	
	let login = document.getElementById("loginName").value;
	let password = document.getElementById("loginPassword").value;
//	var hash = md5( password );
	
	document.getElementById("loginResult").innerHTML = "";

	let tmp = {login:login,password:password};
//	var tmp = {login:login,password:hash};
	let jsonPayload = JSON.stringify( tmp );
	
	let url = urlBase + '/Login.' + extension;

	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState ===4 && this.status ===200) 
			{
				let jsonObject = JSON.parse( xhr.responseText );
				userId = jsonObject.id;
		
				if( userId < 1 )
				{		
					document.getElementById("loginResult").innerHTML = "User/Password combination incorrect";
					return;
				}
		
				firstName = jsonObject.firstName;
				lastName = jsonObject.lastName;

				saveCookie();
	
				window.location.href = "color.html";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("loginResult").innerHTML = err.message;
	}

}

function saveCookie()
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

// Pure helper: turns "firstName=Ann,lastName=Lee,userId=3" into an object.
// userId is -1 when it's missing or not a number (treated as "not logged in").
function parseCookie(cookieString)
{
	let parsed = { firstName: "", lastName: "", userId: -1 };
	let splits = (cookieString || "").split(",");
	for( let i = 0; i < splits.length; i++ )
	{
		let tokens = splits[i].trim().split("=");
		let key = tokens[0];
		let value = (tokens[1] || "").trim();
		if( key === "firstName" )
		{
			parsed.firstName = value;
		}
		else if( key === "lastName" )
		{
			parsed.lastName = value;
		}
		else if( key === "userId" )
		{
			let id = parseInt( value, 10 );
			parsed.userId = isNaN( id ) ? -1 : id;
		}
	}
	return parsed;
}

// Pure helper: form validation for the "Add Color" box.
function isValidColorName(name)
{
	if( typeof name !== "string" )
	{
		return false;
	}
	let trimmed = name.trim();
	return trimmed.length > 0 && trimmed.length <= 50;
}

// Pure helper: formats the API's results array for display.
function formatColorList(results)
{
	return results.join( "<br />\r\n" );
}

function readCookie()
{
	let parsed = parseCookie( document.cookie );
	firstName = parsed.firstName;
	lastName = parsed.lastName;
	userId = parsed.userId;

	if( userId < 0 )
	{
		window.location.href = "index.html";
	}
	else
	{
//		document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName;
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

function addColor()
{
	let newColor = document.getElementById("colorText").value;
	document.getElementById("colorAddResult").innerHTML = "";

	if( !isValidColorName( newColor ) )
	{
		document.getElementById("colorAddResult").innerHTML = "Enter a color name (1-50 characters)";
		return;
	}

	let tmp = {color:newColor.trim(),userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/AddColor.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState ===4 && this.status ===200) 
			{
				document.getElementById("colorAddResult").innerHTML = "Color has been added";
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorAddResult").innerHTML = err.message;
	}
	
}

function searchColor()
{
	let srch = document.getElementById("searchText").value;
	document.getElementById("colorSearchResult").innerHTML = "";

	let tmp = {search:srch,userId:userId};
	let jsonPayload = JSON.stringify( tmp );

	let url = urlBase + '/SearchColors.' + extension;
	
	let xhr = new XMLHttpRequest();
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
	try
	{
		xhr.onreadystatechange = function() 
		{
			if (this.readyState ===4 && this.status ===200) 
			{
				document.getElementById("colorSearchResult").innerHTML = "Color(s) has been retrieved";
				let jsonObject = JSON.parse( xhr.responseText );

				document.getElementsByTagName("p")[0].innerHTML = formatColorList( jsonObject.results || [] );
			}
		};
		xhr.send(jsonPayload);
	}
	catch(err)
	{
		document.getElementById("colorSearchResult").innerHTML = err.message;
	}
	
}

// Lets Jest require() the helpers above. Browsers skip this block because
// `module` only exists in Node, so the page works exactly as before.
/* global module */
if( typeof module !== "undefined" && module.exports )
{
	module.exports = { parseCookie, isValidColorName, formatColorList };
}
