var logedIn = false
var accountMenu = false
var accountMenuLogedIn = false

var monthShorts = ["Jan", "Feb", "März", "Apr", "Mai", "Jun", "Jul", "Aug", "Sept", "Okt", "Nov", "Dez"]
var dayShorts = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"]

function loadFunctions()
{
    console.log("Client is working")

    if(document.getElementById("errorOutput") !== null)
    {
        var error = document.getElementById("errorOutput").innerHTML

        if(error !== "")
        {
            console.log("Error: " + parseInt(error))
            errorDetected(parseInt(error))
        }
    }

    if(document.getElementById("userOutput") !== null)
    {
        loadUser()
    }

    if(document.getElementById("eventsOutput") !== null)
    {
        loadEvents()
        loadMonth() 
    }
}

function errorDetected(p_error)
{
    if(p_error === 0)
    {
        document.getElementById("signInError").innerHTML = "Die E-Mail oder der Username werden bereits verwendet!"
        openRegistration()
    }else if(p_error === 1)
    {
        document.getElementById("loginError").innerHTML = "Das Passwort passt nicht zu dem angegebenen Username!"
        openLogin()
    }
}

function loadMonth()
{
    var month = new Date().getMonth()

    document.getElementById("calendarDay").src = "img/calendar/" + month + ".png"
}

function loadUser()
{
    var user = document.getElementById("userOutput").innerHTML

    if(user !== "")
    {
        if(document.getElementById("usernameSpan") !== null)
        {
            loadUserData(user)
            document.getElementById("loginButton").style.display = "none"
            document.getElementById("logoutButton").style.display = ""
        }
    }else if(document.getElementById("accountHr1") !== null){
        document.getElementById("accountHr1").remove()
        document.getElementById("accountHr2").remove()

        document.getElementById("accountTable1").remove()
        document.getElementById("accountTable2").remove()
    }
}

function loadUserData(p_data)
{
    var data = JSON.parse(p_data)

    logedIn = true
    console.log(data)

    document.getElementById("usernameSpan").innerHTML = " " + data.username
}

function loadEvents()
{
    var events = document.getElementById("eventsOutput").innerHTML

    if(events !== "")
    {
        loadEventData(events)
    }
}

function loadEventData(p_events)
{
    var eventArray = JSON.parse(p_events)
    
    for(var i = 0; i < eventArray.length; i++)
    {
        createEventDiv(eventArray[i])       
    }

    console.log(eventArray)
}

function createEventDiv(p_event)
{
    var title = p_event.title
    var date = p_event.date
    var time = p_event.time
    var age = p_event.minimum_age
    var location = p_event.location

    var day = new Date(date).getDate()
    var dayOfWeek = dayShorts[new Date(date).getDay()] 
    var month = monthShorts[new Date(date).getMonth()]

    var div = document.createElement("div")
    div.className = "event-container"

    var leftDiv = document.createElement("div")
    leftDiv.className = "left-section"

    var dateDiv = document.createElement("div")
    dateDiv.className = "date"
    dateDiv.innerHTML = day

    var monthDiv = document.createElement("div")
    monthDiv.className = "month"
    monthDiv.innerHTML = month

    var ageDiv = document.createElement("div")
    ageDiv.className = "age-restriction"
    ageDiv.innerHTML = age + "+"

    leftDiv.append(dateDiv)
    leftDiv.append(monthDiv)
    leftDiv.append(ageDiv)

    div.append(leftDiv)

    var hr = document.createElement("hr")
    hr.className = "vertical-line"

    div.append(hr)

    var rightDiv = document.createElement("div")
    rightDiv.className = "right-section"

    var titleDiv = document.createElement("h2")
    titleDiv.className = "title"
    titleDiv.innerHTML = title

    var timeDiv = document.createElement("div")
    timeDiv.className = "time"
    timeDiv.innerHTML = dayOfWeek + ", " + time

    var locationDiv = document.createElement("div")
    locationDiv.className = "location"
    locationDiv.innerHTML = location

    var interactionDiv = document.createElement("div")
    interactionDiv.className = "interactionDiv"

    var like = document.createElement("img")
    like.src = "img/little_heart.png"
    like.alt = "Like"
    like.style.width = "30px"
    like.onclick = function()
    {
        likeEvent(this)
    }

    var comment = document.createElement("img")
    comment.src = "img/little_comment.png"
    comment.alt = "Comment"
    comment.style.width = "30px"

    var share = document.createElement("img")
    share.src = "img/little_share.png"
    share.alt = "Share"
    share.style.width = "30px"

    interactionDiv.append(like)
    interactionDiv.append(comment)
    interactionDiv.append(share)

    rightDiv.append(titleDiv)
    rightDiv.append(timeDiv)
    rightDiv.append(locationDiv)
    rightDiv.append(interactionDiv)

    div.append(rightDiv)

    document.getElementById("browseDiv").append(div)
}

function openLogin()
{
    document.getElementById("login").style.display = ""
    document.getElementById("userNameInputLogIn").focus()

    closeRegistration()

    document.getElementById("accountFooter").style.display = "none"
    document.getElementById("accountMain").style.display = "none"
    document.getElementById("accountHeader").style.display = "none"
}

function closeRegistration()
{
    document.getElementById("registration").style.display = "none"

    document.getElementById("accountFooter").style.display = ""
    document.getElementById("accountMain").style.display = ""
    document.getElementById("accountHeader").style.display = ""
}

function closeLogin()
{
    document.getElementById("login").style.display = "none"

    document.getElementById("accountFooter").style.display = ""
    document.getElementById("accountMain").style.display = ""
    document.getElementById("accountHeader").style.display = ""
}

function openRegistration()
{
    document.getElementById("registration").style.display = ""
    document.getElementById("firstnameInput").focus()

    closeLogin()

    document.getElementById("accountFooter").style.display = "none"
    document.getElementById("accountMain").style.display = "none"
    document.getElementById("accountHeader").style.display = "none"
}

function likeEvent(element)
{
    if(element.alt == "Like")
    {
        element.src = "img/little_heart_red.png"
        element.alt = "Liked"
    }else if(element.alt == "Liked")
    {
        element.src = "img/little_heart.png"
        element.alt = "Like"
    }
}