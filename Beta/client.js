var year 
var month
var logedIn = false

var user

var likes = []

var monthShorts = ["Jan", "Feb", "März", "Apr", "Mai", "Jun", "Jul", "Aug", "Sept", "Okt", "Nov", "Dez"]
var monthLongs = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"]
var dayShorts = ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"]

var filterLocation = ""
var filterDay = ""
var filterPrice = 1000
var filterCategory = [false, false, false, false]

var likePage = false

var eventId

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
    }

    if(document.getElementById("friendsPostsOutput") !== null)
    {
        loadFriendsPostsAsEvent()
    }

    if(document.getElementById("monthOutput") !== null)
    {
        loadMonthForImage() 
    }

    if(document.getElementById("filterOutput") !== null && document.getElementById("filterOutput").innerHTML === "true")
    {
        document.getElementById("returnFilter").style.display = ""

        if(document.getElementById("filterDaysOutput").innerHTML !== "false")
        {
            document.getElementsByClassName("dayOption")[document.getElementById("filterDaysOutput").innerHTML].style.background = "#3eb1be"
            
        }

        if(document.getElementById("eventTitleOutput").innerHTML !== "")
        {
            document.getElementById("eventTitleInput").value = document.getElementById("eventTitleOutput").innerHTML
        }
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
    }else if(p_error === 2)
    {
        document.getElementById("editUserError").innerHTML = "Die E-Mail oder der Username werden bereits verwendet!"
        openView('profile', 'Profil anpassen')
    }else if(p_error === 3)
    {
        document.getElementById("signInError").innerHTML = "Der eingegebene Code ist falsch!"
        openRegistration()
    }
}

function loadMonthForImage()
{
    var month = new Date().getMonth() 
    var year = new Date().getFullYear()

    document.getElementById("calendarDay").src = "img/calendar/" + month + ".png"
}

function loadUser()
{
    user = document.getElementById("userOutput").innerHTML

    if(user !== "")
    {
        loadUserData(user)

        if(document.getElementById("usernameSpan") !== null)
        {
            document.getElementById("loginButton").style.display = "none"
            document.getElementById("logoutButton").style.display = ""
        }
    }else if(document.getElementById("accountHr1") !== null){
        document.getElementById("accountHr1").remove()
        document.getElementById("accountHr2").remove()
        document.getElementById("accountHr3").remove()

        document.getElementById("accountTable1").remove()
        document.getElementById("accountTable2").remove()
        document.getElementById("accountTable3").remove()
    }
}

function loadUserData(p_data)
{
    user = JSON.parse(p_data)

    logedIn = true

    if(document.getElementById("usernameGroupsInput") !== null)
    {
        document.getElementById("usernameGroupsInput").value = user.username
    }

    if(document.getElementById("usernameText") !== null)
    {
        document.getElementById("usernameText").value = user.username
    }

    if(document.getElementById("groupUsernameText") !== null)
    {
        document.getElementById("groupUsernameText").innerHTML = user.username
    }

    if(document.getElementById("usernameFriendRequestsInput") !== null)
    {
        document.getElementById("usernameFriendRequestsInput").value = user.username
    }

    if(document.getElementById("usernameSpan") !== null)
    {
        document.getElementById("usernameSpan").innerHTML = " " + user.firstname
    }
}

function getUsers(p_value)
{
    if(p_value !== "")
    {
        var allUsers = JSON.parse(document.getElementById("usersOutput").innerHTML)

        if(document.getElementById("searchUserOutput") !== null)
        {
            document.getElementById("searchUserOutput").remove()
        }

        var area = document.createElement("div")
        area.id = "searchUserOutput"

        document.getElementById("searchUser").append(area)

        var counter = 10

        if(allUsers.length < 10)
        {
            counter = allUsers.length
        }

        for(var i = 0; i < counter; i++)
        {
            if(allUsers[i].username.includes(p_value))
            {
                displayUser(area, allUsers[i])
            }
        }
    }else{
        if(document.getElementById("searchUserOutput") !== null)
        {
            document.getElementById("searchUserOutput").remove()
        }
    }
}

function displayUser(p_area, p_user)
{
    const username = p_user.username
    const name = p_user.firstname + " " + p_user.lastname

    var form = document.createElement("form")
    form.method = "get"
    form.action = "/profile"

    var formInput = document.createElement("input")
    formInput.type = "text"
    formInput.name = "username"
    formInput.readOnly = true
    formInput.value = username

    var formButton = document.createElement("button")
    formButton.style.display = "none"

    form.append(formInput)
    form.append(formButton)

    var div = document.createElement("div")
    div.className = "searchUser"

    var hr = document.createElement("hr")
    hr.className = "boldHr"

    var table = document.createElement("table")
    var row1 = document.createElement("tr")
    var row2 = document.createElement("tr")

    var tdProfile = document.createElement("td")
    tdProfile.rowSpan = "2"
    tdProfile.style.width = "12%"

    var image = document.createElement("img")
    image.src = "img/profile.png"
    image.alt = "Profil"
    image.style.width = "30px"

    tdProfile.append(image)
    row1.append(tdProfile)

    var tdUsername = document.createElement("td")
    var usernameH4 = document.createElement("h4")
    usernameH4.innerHTML = username

    tdUsername.append(usernameH4)
    row1.append(tdUsername)

    var tdName = document.createElement("td")
    tdName.innerHTML = name

    if(p_user.is_creator === true)
    {
        var tdVerified = document.createElement("td")
        tdVerified.rowSpan = "2"
        tdVerified.style.width = "12%"

        var verifiedImg = document.createElement("img")
        verifiedImg.src = "/img/verified.png"
        verifiedImg.alt = "Verifiziert"

        tdVerified.append(verifiedImg)
        row1.append(tdVerified)
    }

    row2.append(tdName)
    table.append(row1)
    table.append(row2)

    div.append(hr)
    div.append(table)
    form.append(div)
    p_area.append(form)

    formInput.style.display = "none"

    div.onclick = function(){
        formButton.click()
    }
}

function loadFriendsPostsAsEvent()
{
    var friendsPosts = document.getElementById("friendsPostsOutput").innerHTML

    if(friendsPosts !== "")
    {
        loadFriendsPostsData(friendsPosts)
    }
}

function loadFriendsPostsData(p_events)
{
    var eventArray = JSON.parse(p_events)
    console.log(eventArray)
    eventArray.sort(function(a, b) {  
        return a.usernames.length - b.usernames.length  
    })

    console.log(eventArray)
    
    for(var i = 0; i < eventArray.length; i++)
    {
        loadFriendsPostEvent(eventArray[i])
    }
}

function loadFriendsPostEvent(p_event)
{
    var checkLike = checkIfEventIsLiked(p_event.eventId)

    if(document.getElementById("postsOutput").innerHTML !== "")
    {
        var checkPost = checkIfEventIsPosted(p_event.eventId)
    }else{
        var checkPost = false
    }

    var form = document.createElement("form")
    form.method = "get"
    form.action = "/participations"
    form.style.display = "none"

    var formInput = document.createElement("input")
    formInput.type = "text"
    formInput.name = "id"
    formInput.readOnly = true
    formInput.value = p_event.eventId

    var formButton = document.createElement("button")
    formButton.style.display = "none"

    form.append(formInput)
    form.append(formButton)

    var postedDiv = document.createElement("div")
    postedDiv.className = "postedDiv"

    var friendsText = document.createElement("p")
    friendsText.className = "miniText"

    friendsText.onclick = function()
    {
        formButton.click()
    }
    
    if(p_event.usernames.length === 1)
    {
        friendsText.innerHTML = p_event.usernames[0] + " besucht"
    }else if(p_event.usernames.length === 2){
        var random = Math.floor(Math.random() * (p_event.usernames.length))

        friendsText.innerHTML = p_event.usernames[random] + " und 1 weiterer Freund:in besuchen"
    }else{
        var random = Math.floor(Math.random() * (p_event.usernames.length))

        friendsText.innerHTML = p_event.usernames[random] + " und " + (p_event.usernames.length - 1) + " weitere Freunde:in besuchen"
    }

    postedDiv.append(form)
    postedDiv.append(friendsText)

    createEventDiv(p_event.event, checkLike, checkPost, postedDiv)  
    
    document.getElementById("homeDiv").append(postedDiv)
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
    eventArray.sort(function(a, b) {  
        a.date = new Date(a.date)
        b.date = new Date(b.date)

        return a.date - b.date  
    })

    console.log(eventArray)
    
    for(var i = 0; i < eventArray.length; i++)
    {
        var checkLike = checkIfEventIsLiked(eventArray[i]._id)

        if(document.getElementById("postsOutput").innerHTML !== "")
        {
            var checkPost = checkIfEventIsPosted(eventArray[i]._id)
            console.log(checkPost)
        }else{
            var checkPost = false
        }

        createEventDiv(eventArray[i], checkLike, checkPost, document.getElementById("browseDiv"))       
    }
}

function checkIfEventIsPosted(p_id)
{
    var postedEvents = JSON.parse(document.getElementById("postsOutput").innerHTML)

    for(var i = 0; i < postedEvents.length; i++)
    {
        if(postedEvents[i].event === p_id){
            return true
        }
    }

    return false
}

function checkIfEventIsLiked(p_id)
{
    if(localStorage.getItem("likes") === null)
    {    
        return false
    }else{
        var likedEvents = JSON.parse(localStorage.getItem("likes"))

        for(var i = 0; i < likedEvents.length; i++)
        {
            if(likedEvents[i]._id === p_id){
                return true
            }
        }
    }
}

function loadLikesData()
{
    likePage = true

    var data = JSON.parse(localStorage.getItem("likes"))
    console.log(data)
    
    for(var i = 0; i < data.length; i++)
    {
        createEventDiv(data[i], true, false, document.getElementById("browseDiv"))       
    }
}

function createEventDiv(p_event, p_liked, p_posted, p_area)
{
    var id = p_event._id
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

    if(age === 0)
    {
        hr.style.marginLeft = "6px"
    }

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

    if(p_liked === true)
    {
        like.src = "img/little_heart_red.png"
        like.alt = "Liked"
        like.onclick = function()
        {
            unlikeEvent(this, p_event)
        }
    }else{
        like.src = "img/little_heart.png"
        like.alt = "Like"
        like.onclick = function()
        {
            likeEvent(this, p_event)
        }
    }

    like.style.width = "30px"
    like.className = "likeButton"

    if(p_posted === true)
    {
        var check = document.createElement("img")
        check.src = "img/green_check.png"
        check.alt = "Green Check"
        check.style.width = "30px"

        check.onclick = function()
        {
            var deletePostForm = document.createElement("form")
            deletePostForm.action = "/deletePost"
            deletePostForm.method = "post"
            deletePostForm.style.display = "none"

            var postFormButton = document.createElement("button")

            var postFormInput = document.createElement("input")
            postFormInput.type = "text"
            postFormInput.name = "event"
            postFormInput.readOnly = true
            postFormInput.value = id

            deletePostForm.append(postFormInput)
            deletePostForm.append(postFormButton)
            rightDiv.append(deletePostForm)

            postFormButton.click()
        }
    }else
    {
        var check = document.createElement("img")
        check.src = "img/check.png"
        check.alt = "Check"
        check.style.width = "30px"

        check.onclick = function()
        {
            var createPostForm = document.createElement("form")
            createPostForm.action = "/post"
            createPostForm.method = "post"
            createPostForm.style.display = "none"

            var postFormButton = document.createElement("button")

            var postFormInput = document.createElement("input")
            postFormInput.type = "text"
            postFormInput.name = "event"
            postFormInput.readOnly = true
            postFormInput.value = id

            createPostForm.append(postFormInput)
            createPostForm.append(postFormButton)
            rightDiv.append(createPostForm)

            postFormButton.click()
        }
    }

    var share = document.createElement("img")
    share.src = "img/little_share.png"
    share.alt = "Share"
    share.style.width = "30px"

    share.onclick = function()
    {
        openShareDiv(id)
    }

    interactionDiv.append(like)
    interactionDiv.append(check)
    interactionDiv.append(share)

    var openEventViewForm = document.createElement("form")
    openEventViewForm.action = "/eventView"
    openEventViewForm.method = "get"
    openEventViewForm.style.display = "none"

    var formButton = document.createElement("button")
    formButton.style.background = "none"
    formButton.style.border = "none"

    var formInput = document.createElement("input")
    formInput.type = "text"
    formInput.name = "id"
    formInput.readOnly = true
    formInput.value = id

    openEventViewForm.append(formInput)
    openEventViewForm.append(formButton)

    var onclickDiv = document.createElement("div")
    onclickDiv.style.cursor = "pointer"
    onclickDiv.append(titleDiv)
    onclickDiv.append(timeDiv)
    onclickDiv.append(locationDiv)
    onclickDiv.append(openEventViewForm)

    onclickDiv.onclick = function(){
        formButton.click()
    }

    rightDiv.append(onclickDiv)
    rightDiv.append(interactionDiv)

    div.append(rightDiv)

    p_area.append(div)
}

function openEventView()
{
    var event = JSON.parse(document.getElementById("eventOutput").innerHTML)

    var id = event._id
    var title = event.title
    var date = event.date
    var time = event.time
    var age = event.minimum_age
    var location = event.location
    var street = event.street
    var description = event.description
    var tickets = event.tickets
    var links = event.links
    var organizer = event.organizer
    var category = event.category

    var liked = checkIfEventIsLiked(id)

    console.log(event)

    for(var i = 0; i < 4; i++)
    {
        if(category[i] === false){
            document.getElementsByClassName("eventViewCategory")[i].style.display = "none"
        }else{
            document.getElementsByClassName("eventViewCategory")[i].style.border = "2px solid #3eb1be"
            document.getElementsByClassName("eventViewCategory")[i].style.color = "#3eb1be"
            document.getElementsByClassName("eventViewCategory")[i].style.fontWeight = "bold"
        }
    }
    
    var day = new Date(date).getDate()
    var dayOfWeek = dayShorts[new Date(date).getDay()] 
    var month = monthShorts[new Date(date).getMonth()]
    var year = new Date(date).getFullYear()

    document.getElementById("eventViewTitle").innerHTML = title
    document.getElementById("eventViewDate").innerHTML = "am " + dayOfWeek + ", den " + day + ". " + month + ". " + year + " um " + time + " Uhr"
    document.getElementById("eventViewLocation").innerHTML = "in " + location + ", " + street 
    document.getElementById("eventViewAge").innerHTML = age + "+"
    document.getElementById("eventViewDescription").innerHTML = description
    document.getElementById("eventViewOrganizer").innerHTML = "Veranstalter: " + organizer
    document.getElementById("commentEventInput").value = id

    document.getElementById("interactionDivEventView").remove()

    var interactionDiv = document.createElement("div")
    interactionDiv.className = "interactionDiv"
    interactionDiv.id = "interactionDivEventView"

    var like = document.createElement("img")

    if(liked === true)
    {
        like.src = "img/little_heart_red.png"
        like.alt = "Liked"
        like.onclick = function()
        {
            unlikeEvent(this, event)
        }
    }else{
        like.src = "img/little_heart.png"
        like.alt = "Like"
        like.onclick = function()
        {
            likeEvent(this, event)
        }
    }

    like.style.width = "30px"
    like.className = "likeButton"

    if(document.getElementById("postedOutput").innerHTML === "true")
    {
        var check = document.createElement("img")
        check.src = "img/green_check.png"
        check.alt = "Green Check"
        check.style.width = "30px"

        check.onclick = function()
        {
            var deletePostForm = document.createElement("form")
            deletePostForm.action = "/deletePost"
            deletePostForm.method = "post"
            deletePostForm.style.display = "none"

            var postFormButton = document.createElement("button")

            var postFormInput = document.createElement("input")
            postFormInput.type = "text"
            postFormInput.name = "event"
            postFormInput.readOnly = true
            postFormInput.value = id

            deletePostForm.append(postFormInput)
            deletePostForm.append(postFormButton)
            interactionDiv.append(deletePostForm)

            postFormButton.click()
        }
    }else
    {
        var check = document.createElement("img")
        check.src = "img/check.png"
        check.alt = "Check"
        check.style.width = "30px"

        check.onclick = function()
        {
            var createPostForm = document.createElement("form")
            createPostForm.action = "/post"
            createPostForm.method = "post"
            createPostForm.style.display = "none"

            var postFormButton = document.createElement("button")

            var postFormInput = document.createElement("input")
            postFormInput.type = "text"
            postFormInput.name = "event"
            postFormInput.readOnly = true
            postFormInput.value = id

            createPostForm.append(postFormInput)
            createPostForm.append(postFormButton)
            interactionDiv.append(createPostForm)

            postFormButton.click()
        }
    }

    var share = document.createElement("img")
    share.src = "img/little_share.png"
    share.alt = "Share"
    share.style.width = "30px"

    share.onclick = function()
    {
        openShareDiv(id)
    }

    interactionDiv.append(like)
    interactionDiv.append(check)
    interactionDiv.append(share)

    document.getElementById("eventViewDiv").append(interactionDiv)

    if(document.getElementById("eventViewTickets") !== null)
    {
        document.getElementById("eventViewTickets").remove()
    }

    var ticketArea = document.createElement("table")
    ticketArea.id = "eventViewTickets"

    for(var i = 0; i < tickets.length; i++)
    {   
        var row = document.createElement("tr")

        var name = document.createElement("td")
        name.innerHTML = tickets[i]

        i++
        
        var price = document.createElement("td")
        price.innerHTML = tickets[i]

        row.append(name)
        row.append(price)

        ticketArea.append(row)
    }

    document.getElementById("eventViewTicketsArea").append(ticketArea)

    if(document.getElementById("eventViewLinks") !== null)
    {
        document.getElementById("eventViewLinks").remove()
    }

    var linksArea = document.createElement("table")
    linksArea.id = "eventViewLinks"

    for(var i = 0; i < links.length; i++)
    {
        var row = document.createElement("tr")

        var imageTd = document.createElement("td")
        var image = document.createElement("img")
        
        if(links[i] === "YouTube"){
            image.src = "img/youtube.png"
        }else if(links[i] === "Instagram"){
            image.src = "img/instagram.png"
        }else if(links[i] === "Website"){
            image.src = "img/website.png"
        }else if(links[i] === "X"){
            image.src = "img/x.png"
        }else if(links[i] === "Facebook"){
            image.src = "img/facebook.png"
        }

        var link = document.createElement("td")
        link.innerHTML = links[i]

        i++

        image.id = links[i]
        link.id = links[i]

        image.onclick = function(){
            window.open(this.id, "_blank").focus()
        }

        link.onclick = function(){
            window.open(this.id, "_blank").focus()
        }

        imageTd.append(image)
        row.append(imageTd)
        row.append(link)

        linksArea.append(row)
    }

    document.getElementById("eventViewLinksArea").append(linksArea)
}

function loadComments()
{
    var comments = JSON.parse(document.getElementById("commentsOutput").innerHTML)
    var replyArray = JSON.parse(document.getElementById("replyArrayOutput").innerHTML)

    if(comments.length === 0)
    {
        document.getElementById("commentCounter").innerHTML = "Noch keine Kommentare vorhanden. Sei der erste!"
    }else if(comments.length === 1)
    {
        document.getElementById("commentCounter").innerHTML = comments.length + " Kommentar"
    }else{
        document.getElementById("commentCounter").innerHTML = comments.length + " Kommentare"
    }    

    loadUser()

    for(var i = 0; i < comments.length; i++)
    {
        loadComment(comments[i], replyArray[i], JSON.parse(comments[i].username))
    }
}

function loadComment(p_comment, p_replyLength, p_user)
{
    var today = new Date().getDate()
    var todayMonth = new Date().getMonth() + 1
    var todayYear = new Date().getFullYear()

    var day = new Date(p_comment.created_at).getDate()
    var month = new Date(p_comment.created_at).getMonth() + 1
    var year = new Date(p_comment.created_at).getFullYear()

    var area = document.getElementById("commentSection")

    var commentDiv = document.createElement("div")
    commentDiv.className = "comment"

    var form = document.createElement("form")
    form.method = "get"
    form.action = "/profile"

    var formInput = document.createElement("input")
    formInput.type = "text"
    formInput.name = "username"
    formInput.readOnly = true
    formInput.value = p_user.username

    var formButton = document.createElement("button")

    form.append(formInput)
    form.append(formButton)
    form.style.display = "none"

    var userInfoDiv = document.createElement("div")
    userInfoDiv.className = "user-info"

    var nameSpan = document.createElement("span")
    nameSpan.className = "user-name"
    nameSpan.innerHTML = p_user.username
    nameSpan.onclick = function()
    {
        formButton.click()
    }

    userInfoDiv.append(nameSpan)

    if(p_user.is_creator === true)
    {
        var verifiedImg = document.createElement("img")
        verifiedImg.src = "/img/verified.png"
        verifiedImg.alt = "Verifiziert"
        verifiedImg.style.marginRight = "auto"
        verifiedImg.style.marginLeft = "5px"

        userInfoDiv.append(verifiedImg)
    }

    var dateSpan = document.createElement("span")
    dateSpan.className = "comment-date"

    if(today === day && todayMonth  === month && todayYear === year)
    {
        dateSpan.innerHTML = "Heute"
    }else{
        dateSpan.innerHTML = day + ". " + month + ". " + year
    }

    userInfoDiv.append(dateSpan)

    var textDiv = document.createElement("div")
    textDiv.className = "comment-text"
    textDiv.innerHTML = p_comment.text

    var actionDiv = document.createElement("div")
    actionDiv.className = "comment-actions"

    if(user.username === p_user.username)
    {
        var event = JSON.parse(document.getElementById("eventOutput").innerHTML)
        var eventId = event._id

        var trashForm = document.createElement("form")
        trashForm.method = "post"
        trashForm.action = "/deleteComment"

        var trashFormInput = document.createElement("input")
        trashFormInput.type = "text"
        trashFormInput.name = "id"
        trashFormInput.readOnly = true
        trashFormInput.value = p_comment._id

        var trashFormEventInput = document.createElement("input")
        trashFormEventInput.type = "text"
        trashFormEventInput.name = "event"
        trashFormEventInput.readOnly = true
        trashFormEventInput.value = eventId

        var trashFormButton = document.createElement("button")

        trashForm.append(trashFormInput)
        trashForm.append(trashFormEventInput)
        trashForm.append(trashFormButton)
        trashForm.style.display = "none"

        var trashImg = document.createElement("img")
        trashImg.src = "/img/trash.png"
        trashImg.alt = "Müll"

        actionDiv.append(trashImg)
        commentDiv.append(trashForm)

        trashImg.onclick = function()
        {
            trashFormButton.click()
        }
    }

    var profileImg = document.createElement("img")
    profileImg.src = "/img/profile.png"
    profileImg.alt = "Profil"

    profileImg.onclick = function()
    {
        formButton.click()
    }

    var commentCounter = document.createElement("a")
    commentCounter.innerHTML = p_replyLength
    commentCounter.className = "commentCounter"

    var commentForm = document.createElement("form")
    commentForm.method = "get"
    commentForm.action = "/comments"

    var commentFormInput = document.createElement("input")
    commentFormInput.type = "text"
    commentFormInput.name = "id"
    commentFormInput.readOnly = true
    commentFormInput.value = p_comment._id

    var commentFormButton = document.createElement("button")

    commentForm.append(commentFormInput)
    commentForm.append(commentFormButton)
    commentForm.style.display = "none"

    var commentImg = document.createElement("img")
    commentImg.src = "/img/little_comment.png"
    commentImg.alt = "Kommentare"
    commentImg.style.marginRight = "5px"

    commentImg.onclick = function()
    {
        commentFormButton.click()
    }

    actionDiv.append(profileImg)
    actionDiv.append(commentCounter)
    actionDiv.append(commentImg)

    commentDiv.append(form)
    commentDiv.append(commentForm)
    commentDiv.append(userInfoDiv)
    commentDiv.append(textDiv)
    commentDiv.append(actionDiv)

    area.append(commentDiv)
}

function loadCommentView()
{
    var comment = JSON.parse(document.getElementById("commentOutput").innerHTML)
    var user = JSON.parse(document.getElementById("userOutput").innerHTML)
    var profile = JSON.parse(document.getElementById("profileOutput").innerHTML)
    var replies = JSON.parse(document.getElementById("repliesOutput").innerHTML)

    document.getElementById("eventIdInput").value = document.getElementById("eventIdOutput").innerHTML

    var today = new Date().getDate()
    var todayMonth = new Date().getMonth() + 1
    var todayYear = new Date().getFullYear()

    var day = new Date(comment.created_at).getDate()
    var month = new Date(comment.created_at).getMonth() + 1
    var year = new Date(comment.created_at).getFullYear()

    var dateSpan = document.getElementById("commentTime")

    if(today === day && todayMonth  === month && todayYear === year)
    {
        dateSpan.innerHTML = "Heute"
    }else{
        dateSpan.innerHTML = day + ". " + month + ". " + year
    }

    if(profile.is_creator !== true)
    {
        document.getElementById("verifiedImg").remove()
    }

    document.getElementById("nameText").innerHTML = profile.firstname + " " + profile.lastname
    document.getElementById("tagname").innerHTML = "@" + profile.username
    document.getElementById("commentText").innerHTML = comment.text
    document.getElementById("commentCounter").innerHTML = replies.length + " Kommentare"
    document.getElementById("profileInput").value = profile.username

    for(var i = 0; i < replies.length; i++)
    {
        loadReply(replies[i], user)
    }
}

function loadReply(p_reply, p_user)
{
    var user = JSON.parse(p_reply.username)

    var today = new Date().getDate()
    var todayMonth = new Date().getMonth() + 1
    var todayYear = new Date().getFullYear()

    var day = new Date(p_reply.created_at).getDate()
    var month = new Date(p_reply.created_at).getMonth() + 1
    var year = new Date(p_reply.created_at).getFullYear()

    var commentDiv = document.createElement("div")
    commentDiv.className = "comment"

    var form = document.createElement("form")
    form.method = "get"
    form.action = "/profile"

    var formInput = document.createElement("input")
    formInput.type = "text"
    formInput.name = "username"
    formInput.readOnly = true
    formInput.value = user.username

    var formButton = document.createElement("button")

    form.append(formInput)
    form.append(formButton)
    form.style.display = "none"

    var userInfoDiv = document.createElement("div")
    userInfoDiv.className = "user-info"

    var nameSpan = document.createElement("span")
    nameSpan.className = "user-name"
    nameSpan.innerHTML = user.username
    nameSpan.onclick = function()
    {
        formButton.click()
    }

    userInfoDiv.append(nameSpan)

    if(user.is_creator === true)
    {
        var verifiedImg = document.createElement("img")
        verifiedImg.src = "/img/verified.png"
        verifiedImg.alt = "Verifiziert"
        verifiedImg.style.marginRight = "auto"
        verifiedImg.style.marginLeft = "5px"

        userInfoDiv.append(verifiedImg)
    }

    var dateSpan = document.createElement("span")
    dateSpan.className = "comment-date"

    if(today === day && todayMonth  === month && todayYear === year)
    {
        dateSpan.innerHTML = "Heute"
    }else{
        dateSpan.innerHTML = day + ". " + month + ". " + year
    }

    userInfoDiv.append(dateSpan)

    var textDiv = document.createElement("div")
    textDiv.className = "comment-text"
    textDiv.innerHTML = p_reply.text

    var actionDiv = document.createElement("div")
    actionDiv.className = "comment-actions"

    if(user.username === p_user.username)
    {
        var trashForm = document.createElement("form")
        trashForm.method = "post"
        trashForm.action = "/deleteReply"

        var trashFormInput = document.createElement("input")
        trashFormInput.type = "text"
        trashFormInput.name = "id"
        trashFormInput.readOnly = true
        trashFormInput.value = p_reply._id

        var trashFormEventInput = document.createElement("input")
        trashFormEventInput.type = "text"
        trashFormEventInput.name = "event"
        trashFormEventInput.readOnly = true
        trashFormEventInput.value = eventId

        var trashFormButton = document.createElement("button")

        trashForm.append(trashFormInput)
        trashForm.append(trashFormEventInput)
        trashForm.append(trashFormButton)
        trashForm.style.display = "none"

        var trashImg = document.createElement("img")
        trashImg.src = "/img/trash.png"
        trashImg.alt = "Müll"

        actionDiv.append(trashImg)
        commentDiv.append(trashForm)

        trashImg.onclick = function()
        {
            trashFormButton.click()
        }
    }

    var profileImg = document.createElement("img")
    profileImg.src = "/img/profile.png"
    profileImg.alt = "Profil"
    profileImg.style.marginRight = "5px"

    profileImg.onclick = function()
    {
        formButton.click()
    }

    actionDiv.append(profileImg)

    commentDiv.append(form)
    commentDiv.append(userInfoDiv)
    commentDiv.append(textDiv)
    commentDiv.append(actionDiv)

    document.getElementById("replyArea").append(commentDiv)
}

function eventMenu(p_index)
{
    if(p_index === 0)
    {
        document.getElementsByClassName("eventMenu")[1].style.background = "none"
        document.getElementsByClassName("eventMenu")[0].style.background = "#3eb1be"

        document.getElementById("commentSection").style.display = ""
        document.getElementById("participationSection").style.display = "none"
    }else
    {
        document.getElementsByClassName("eventMenu")[0].style.background = "none"
        document.getElementsByClassName("eventMenu")[1].style.background = "#3eb1be"

        document.getElementById("commentSection").style.display = "none"
        document.getElementById("participationSection").style.display = ""
    }
}

function loadParticipations()
{
    var array = JSON.parse(document.getElementById("participationsOutput").innerHTML)
    var area = document.getElementById("participationSection")

    if(array.length === 0)
    {
        document.getElementById("participationCounter").innerHTML = "Keiner deiner Freunde nimmt an diesem Event teil."
    }else if(array.length === 1)
    {
        document.getElementById("participationCounter").innerHTML = array.length + " Freund nimmt an diesem Event teil!"
    }else
    {
        document.getElementById("participationCounter").innerHTML = array.length + " Freunde nehmen an diesem Event teil!"
    }

    for(var i = 0; i < array.length; i++)
    {
        displayParticipationUser(area, array[i])
    }
}

function displayParticipationUser(p_area, p_user)
{
    const username = p_user.username
    const name = p_user.firstname + " " + p_user.lastname

    var form = document.createElement("form")
    form.method = "get"
    form.action = "/profile"

    var formInput = document.createElement("input")
    formInput.type = "text"
    formInput.name = "username"
    formInput.readOnly = true
    formInput.value = username

    var formButton = document.createElement("button")
    formButton.style.display = "none"

    form.append(formInput)
    form.append(formButton)

    var div = document.createElement("div")
    div.className = "participationUser"

    var table = document.createElement("table")
    var row1 = document.createElement("tr")
    var row2 = document.createElement("tr")

    var tdProfile = document.createElement("td")
    tdProfile.rowSpan = "2"
    tdProfile.style.width = "15%"

    var image = document.createElement("img")
    image.src = "img/profile.png"
    image.alt = "Profil"
    image.style.width = "30px"

    tdProfile.append(image)
    row1.append(tdProfile)

    var tdUsername = document.createElement("td")
    var usernameH4 = document.createElement("h4")
    usernameH4.innerHTML = username

    tdUsername.append(usernameH4)
    row1.append(tdUsername)

    var tdName = document.createElement("td")
    tdName.innerHTML = name

    row2.append(tdName)
    table.append(row1)
    table.append(row2)

    div.append(table)
    p_area.append(form)
    p_area.append(div)

    formInput.style.display = "none"

    div.onclick = function(){
        formButton.click()
    }
}

function displayParticipationUserByUsername(p_value)
{
    var array = JSON.parse(document.getElementById("participationsOutput").innerHTML)
    var area = document.getElementById("participationSection")

    if(p_value !== "")
    {
        while(document.getElementsByClassName("participationUser").length > 0)
        {
            document.getElementsByClassName("participationUser")[0].remove()
        }

        for(var i = 0; i < array.length; i++)
        {
            if(array[i].username.includes(p_value))
            {
                displayParticipationUser(area, array[i])
            }
        } 
    }else{
        while(document.getElementsByClassName("participationUser").length > 0)
        {
            document.getElementsByClassName("participationUser")[0].remove()
        }
        
        for(var i = 0; i < array.length; i++)
        {
            displayParticipationUser(area, array[i])
        }
    }
}

function triggerEventFoldOut(p_index)
{
    var display = document.getElementsByClassName("eventTableContent")[p_index].style.display 
    var trigger = document.getElementsByClassName("trigger")[p_index]

    if(display === "")
    {
        document.getElementsByClassName("eventTableContent")[p_index].style.display = "none"
        trigger.innerHTML = "+"
    }else{
        document.getElementsByClassName("eventTableContent")[p_index].style.display = ""
        trigger.innerHTML = "-"
    }
}

function openShareDiv(p_eventId)
{
    eventId = p_eventId

    document.getElementById("shareDiv").style.display = ""
    document.getElementById("footer").style.display = "none"

    var groups = JSON.parse(document.getElementById("groupsOutput").innerHTML)
    console.log(groups)

    if(document.getElementById("shareGroups")!== null)
    {
        document.getElementById("shareGroups").remove()
    }

    var div = document.createElement("div")
    div.id = "shareGroups"
    div.style.width = "90%"
    div.style.margin = "auto"

    document.getElementById("shareContent").append(div)

    for(var i = 0; i < groups.length; i++)
    {
        createGroupToShareDiv(groups, groups[i], i, p_eventId)
    }
}

function createGroupToShareDiv(p_groups, p_group, i, p_eventId)
{
    var user = JSON.parse(document.getElementById("userOutput").innerHTML)

    var groupId = p_group._id
    var name = p_group.name
    var users = p_group.users

    if(users.length === 2)
    {
        if(user.username === users[0]){
            name = users[1]
        }else{
            name = users[0]
        }
    }

    var groupDiv = document.createElement("div")
    groupDiv.className = "groupDiv"
    groupDiv.id = name

    var shareForm = document.createElement("form")
    shareForm.method = "post"
    shareForm.action = "/shareEvent"

    var shareFormGroupInput = document.createElement("input")
    shareFormGroupInput.type = "text"
    shareFormGroupInput.name = "groupId"
    shareFormGroupInput.readOnly = true
    shareFormGroupInput.value = groupId

    var shareFormEventInput = document.createElement("input")
    shareFormEventInput.type = "text"
    shareFormEventInput.name = "eventId"
    shareFormEventInput.readOnly = true
    shareFormEventInput.value = p_eventId

    var shareFormButton = document.createElement("button")

    shareForm.append(shareFormGroupInput)
    shareForm.append(shareFormEventInput)
    shareForm.append(shareFormButton)
    shareForm.style.display = "none"

    groupDiv.append(shareForm)

    var table = document.createElement("table")
    var row = document.createElement("tr")

    var groupTD = document.createElement("td")
    groupTD.style.width = "10%"
    var groupImg = document.createElement("img")
    
    if(users.length === 2){
        groupImg.src = "img/profile.png"
        groupImg.alt = "Profile"

        var form = document.createElement("form")
        form.method = "get"
        form.action = "/profile"

        var formInput = document.createElement("input")
        formInput.type = "text"
        formInput.name = "username"
        formInput.readOnly = true
        formInput.value = name

        var formButton = document.createElement("button")

        form.append(formInput)
        form.append(formButton)
        form.style.display = "none"

        groupDiv.append(form)

        groupImg.onclick = function(){
            formButton.click()
        }
    }else{
        groupImg.src = "img/group.png"
        groupImg.alt = "Group"
    }

    groupTD.append(groupImg)

    var chatTD = document.createElement("td")
    var groupHeadText = document.createElement("p")
    groupHeadText.className = "groupHeadText"
    groupHeadText.style.marginTop = "20px"

    groupHeadText.innerHTML = name

    chatTD.append(groupHeadText)

    var shareTD = document.createElement("td")
    shareTD.style.width = "10%"
    var shareImg = document.createElement("img")
    shareImg.src = "img/share.png"
    shareImg.alt = "Teilen"

    shareTD.append(shareImg)

    shareTD.onclick = function(){
        shareFormButton.click()
    }

    row.append(groupTD)
    row.append(chatTD)
    row.append(shareTD)

    table.append(row)

    var hr = document.createElement("hr")
    hr.style.width = "105%"
    hr.style.marginLeft = "-2.5%"

    groupDiv.append(table)

    if(p_groups.length > 1 && p_groups.length - 1 !== i)
    {
        groupDiv.append(hr)
    }

    document.getElementById("shareGroups").append(groupDiv)
}

function closeShareDiv()
{
    document.getElementById("shareDiv").style.display = "none"
    document.getElementById("footer").style.display = ""
}

function openLogin()
{
    document.getElementById("login").style.display = ""
    document.getElementById("userNameInputLogIn").focus()

    closeRegistration()

    document.getElementById("main").style.display = "none"
    document.getElementById("footer").style.display = "none"
}

function closeRegistration()
{
    document.getElementById("registration").style.display = "none"

    document.getElementById("main").style.display = ""
    document.getElementById("footer").style.display = ""
}

function closeLogin()
{
    document.getElementById("login").style.display = "none"

    document.getElementById("main").style.display = ""
    document.getElementById("footer").style.display = ""
}

function openRegistration()
{
    document.getElementById("registration").style.display = ""
    document.getElementById("firstnameInput").focus()

    closeLogin()

    document.getElementById("main").style.display = "none"
    document.getElementById("footer").style.display = "none"
}

function openCreator()
{
    document.getElementById("beCreator").style.display = ""

    document.getElementById("main").style.display = "none"
    document.getElementById("footer").style.display = "none"
}

function closeCreator()
{
    document.getElementById("beCreator").style.display = "none"

    document.getElementById("main").style.display = ""
    document.getElementById("footer").style.display = ""
}

function likeEvent(p_element, p_event)
{
    p_element.src = "img/little_heart_red.png"
    p_element.alt = "Liked"

    p_element.onclick = function()
    {
        unlikeEvent(p_element, p_event)
    }
    
    if(localStorage.getItem("likes") === null)
    {    
        likes.push(p_event)

        localStorage.setItem("likes", JSON.stringify(likes))
    }else{
        likes = JSON.parse(localStorage.getItem("likes"))

        likes.push(p_event)
        localStorage.setItem("likes", JSON.stringify(likes))
    }
}

function unlikeEvent(p_element, p_event)
{
    p_element.src = "img/little_heart.png"
    p_element.alt = "Like"

    p_element.onclick = function()
    {
        likeEvent(this, p_event)
    }

    likes = JSON.parse(localStorage.getItem("likes"))

    var index = getIndex(likes, p_event._id)

    likes.splice(index,1)
    localStorage.setItem("likes", JSON.stringify(likes))

    if(likePage === true)
    {
        var data = JSON.parse(localStorage.getItem("likes"))

        document.getElementById("browseDiv").remove()

        var newBrowseDiv = document.createElement("div")
        newBrowseDiv.id = "browseDiv"

        document.getElementById("main").append(newBrowseDiv)

        for(var index = 0; index < data.length; index++)
        {
            createEventDiv(data[index], true, document.getElementById("browseDiv"))       
        }
    }
}

function getIndex(array, id)
{
    for(var i = 0; i < array.length; i++)
    {
        if(array[i]._id === id)
        {
            return i
        }
    }
}

function openFilterDiv()
{
    document.getElementById("filterDiv").style.display = ""
    document.getElementById("filterFooter").style.display = ""
    document.getElementById("top").style.display = "none"
    document.getElementById("main").style.display = "none"
}

function closeFilterDiv()
{
    document.getElementById("filterDiv").style.display = "none"
    document.getElementById("filterFooter").style.display = "none"
    document.getElementById("top").style.display = ""
    document.getElementById("main").style.display = ""
}

function filterOptions(p_filternumber, p_index)
{
    if(p_filternumber !== 3)
    {
        for(var i = 0; i < document.getElementsByClassName("category" + p_filternumber).length; i++)
        {
            document.getElementsByClassName("category" + p_filternumber)[i].style.background = "none"
        }
    }
    
    document.getElementsByClassName("category" + p_filternumber)[p_index].style.background = "#3eb1be"
}

function updateDayFilter(p_index)
{
    var today = new Date()

    if(p_index === 0)
    {
        filterDay = today.getFullYear() + '-' +(today.getMonth()+1) + '-' + today.getDate()
    }else if(p_index === 1)
    {
        filterDay = today.getFullYear() + '-' +(today.getMonth()+1) + '-' + (today.getDate()+1)
    }else if(p_index === 2)
    {
        var day = today.getDay()
        var difference = day <= 5 ? 5 - day : 12 - day
        var nextFriday = new Date(today.getTime() + (difference * 24 * 60 * 60 * 1000))
        var nextSaturday = new Date(nextFriday.getTime() + (1 * 24 * 60 * 60 * 1000))
        var nextSunday = new Date(nextFriday.getTime() + (2 * 24 * 60 * 60 * 1000))
        
        filterDay = [nextFriday.getFullYear() + '-' +(nextFriday.getMonth()+1) + '-' + nextFriday.getDate(), 
                     nextSaturday.getFullYear() + '-' +(nextSaturday.getMonth()+1) + '-' + nextSaturday.getDate(),
                     nextSunday.getFullYear() + '-' +(nextSunday.getMonth()+1) + '-' + nextSunday.getDate()]
    }else if(p_index === 3)
    {
        
    }
}

function updatePriceFilter(p_price)
{
    filterPrice = p_price
}

function updateLocationFilter()
{
    filterLocation = document.getElementById("filterInput").value
    console.log(filterLocation)
}

function updateCategoryFilter(p_index)
{
    filterCategory[p_index] = true
}

function filterDone()
{
    var output = {
        location : filterLocation,
        day : filterDay,
        price : filterPrice,
        category : filterCategory
    }

    document.getElementById("filterOutputInput").value = JSON.stringify(output)
}

function removeFilter()
{
    for(var i = 0; i < document.getElementsByClassName("category1").length; i++)
    {
        document.getElementsByClassName("category1")[i].style.background = "none"
    }

    for(var i = 0; i < document.getElementsByClassName("category2").length; i++)
    {
        document.getElementsByClassName("category2")[i].style.background = "none"
    }

    for(var i = 0; i < document.getElementsByClassName("category3").length; i++)
    {
        document.getElementsByClassName("category3")[i].style.background = "none"
    }

    document.getElementById("filterInput").value = ""

    filterLocation = ""
    filterDay = ""
    filterPrice = 1000
    filterCategory = [false, false, false, false]
}

function openView(p_element, p_text)
{
    document.getElementById("viewHeadline").innerHTML = p_text

    document.getElementById("accountHeader").style.display = "none"
    document.getElementById("accountMain").style.display = "none"
    document.getElementById("loginButton").style.display = "none"
    document.getElementById("logoutButton").style.display = "none"
    document.getElementById("accountView").style.display = ""
    document.getElementById(p_element).style.display = ""

    if(document.getElementById("userOutput").innerHTML !== "")
    {
        var user = JSON.parse(document.getElementById("userOutput").innerHTML)
        console.log(user)
    }

    if(p_element === "profile")
    {
        document.getElementById("firstnameEditInput").value = user.firstname
        document.getElementById("lastnameEditInput").value = user.lastname
        document.getElementById("usernameEditInput").value = user.username
        document.getElementById("emailEditInput").value = user.email
        document.getElementById("passwordEditInput").value = user.password        
        document.getElementById("profilePictureEdit").src = user.image
    }else if(p_element === "deleteData")
    {
        document.getElementById("deleteAccountInput").value = user.username
    }else if(p_element === "friends")
    {
        document.getElementById("friendlistInput").value = user.username
        document.getElementById("friendlistButton").click()
    }
}

function closeView()
{
    document.getElementById("accountHeader").style.display = ""
    document.getElementById("accountMain").style.display = ""
    document.getElementById("accountView").style.display = "none"
    document.getElementById("language").style.display = "none"
    document.getElementById("profile").style.display = "none"
    document.getElementById("contact").style.display = "none"
    document.getElementById("info").style.display = "none"
    document.getElementById("deleteData").style.display = "none"

    if(document.getElementById("userOutput").innerHTML !== "")
    {
        document.getElementById("logoutButton").style.display = ""
    }else{
        document.getElementById("loginButton").style.display = ""
    }
}

function loadFriends()
{
    var user = JSON.parse(document.getElementById("userOutput").innerHTML)
    var friends = user.friends
    
    if(friends.length === 1){
        document.getElementById("friendsCounter").innerHTML = friends.length + " Freund"
    }else{
        document.getElementById("friendsCounter").innerHTML = friends.length + " Freunde"
    }

    while(document.getElementsByClassName("friendRow").length > 0)
    {
        document.getElementsByClassName("friendRow")[0].remove()
    }

    for(var i = 0; i < friends.length; i++)
    {
        loadFriendRow(friends[i])
    }
}

function loadFriendRow(p_friend)
{
    var row = document.createElement("tr")
    row.className = "friendRow"

    var profileForm = document.createElement("form")
    profileForm.method = "get"
    profileForm.action = "/profile"

    var profileFormInput = document.createElement("input")
    profileFormInput.type = "text"
    profileFormInput.name = "username"
    profileFormInput.readOnly = true
    profileFormInput.value = p_friend

    var profileFormButton = document.createElement("button")

    profileForm.append(profileFormInput)
    profileForm.append(profileFormButton)
    profileForm.style.display = "none"

    var profileTD = document.createElement("td")
    var profileImg = document.createElement("img")
    profileImg.src = "img/profile.png"
    profileImg.alt = "Profil"
    profileImg.className = "requestProfile"

    profileTD.append(profileImg)
    profileTD.append(profileForm)

    profileImg.onclick = function(){
        profileFormButton.click()
    }

    var usernameTD = document.createElement("td")
    var usernameText = document.createElement("h3")
    usernameText.innerHTML = p_friend
    usernameText.style.marginLeft = "10px"
    usernameText.style.marginBottom = "20px"

    usernameTD.append(usernameText)

    var removeForm = document.createElement("form")
    removeForm.method = "post"
    removeForm.action = "/removeFriend"

    var removeFormInput = document.createElement("input")
    removeFormInput.type = "text"
    removeFormInput.name = "username"
    removeFormInput.readOnly = true
    removeFormInput.value = p_friend

    var removeFormButton = document.createElement("button")

    removeForm.append(removeFormInput)
    removeForm.append(removeFormButton)
    removeForm.style.display = "none"

    var removeTD = document.createElement("td")
    var removeImg = document.createElement("img")
    removeImg.src = "img/minus_red.png"
    removeImg.alt = "Entfernen"

    removeImg.onclick = function()
    {
        removeFormButton.click()
    }

    removeTD.append(removeImg)
    removeTD.append(removeForm)

    row.append(profileTD)
    row.append(usernameTD)
    row.append(removeTD)

    document.getElementById("friendsTable").append(row)
}

function deleteData()
{
    localStorage.clear()
    closeView()
}

function dayOptions(p_index)
{
    if(document.getElementsByClassName("dayOption")[p_index].style.background === "rgb(76, 166, 255)")
    {
        document.getElementsByClassName("dayOption")[p_index].style.background = "none"
    }else{
        for(var i = 0; i < document.getElementsByClassName("dayOption").length; i++)
        {
            document.getElementsByClassName("dayOption")[i].style.background = "none"
        }

        document.getElementsByClassName("dayOption")[p_index].style.background = "#3eb1be"
    }

    var output

    var today = new Date()

    if(p_index === 0)
    {
        output = today.getFullYear() + '-' +(today.getMonth()+1) + '-' + today.getDate()
    }else if(p_index === 1)
    {
        output = today.getFullYear() + '-' +(today.getMonth()+1) + '-' + (today.getDate()+1)
    }else if(p_index === 2)
    {
        var day = today.getDay()
        var difference = day <= 5 ? 5 - day : 12 - day
        var nextFriday = new Date(today.getTime() + (difference * 24 * 60 * 60 * 1000))
        var nextSaturday = new Date(nextFriday.getTime() + (1 * 24 * 60 * 60 * 1000))
        var nextSunday = new Date(nextFriday.getTime() + (2 * 24 * 60 * 60 * 1000))
        
        output = [nextFriday.getFullYear() + '-' +(nextFriday.getMonth()+1) + '-' + nextFriday.getDate(), 
                     nextSaturday.getFullYear() + '-' +(nextSaturday.getMonth()+1) + '-' + nextSaturday.getDate(),
                     nextSunday.getFullYear() + '-' +(nextSunday.getMonth()+1) + '-' + nextSunday.getDate()]
    }

    document.getElementById("dayOptionsOutput").value = output
    document.getElementById("dayOptionsIndexOutput").value = p_index
    document.getElementById("daySubmit").click()

    document.getElementsByClassName("dayOption")[p_index].style.background = "#3eb1be"
}

function loadCalendar()
{
    year = new Date(document.getElementById("yearOutput").innerHTML).getFullYear() 
    month = document.getElementById("monthOutput").innerHTML - 1

    var monthNow = new Date().getMonth()
    var yearNow = new Date().getFullYear()
    
    if(month === monthNow && year === yearNow)
    {
        document.getElementsByClassName("rotateimg180")[0].style.display = "none"
        document.getElementsByClassName("rotateimg180")[0].onclick = ""
    }

    loadMonth()
}

function loadMonth()
{
    document.getElementById("calendarArea").remove()

    var area = document.createElement("div")
    area.id = "calendarArea"
    area.className = "flex-container"
    area.style.width = "100%"

    document.getElementById("calendar").append(area)

    document.getElementById("monthText").innerHTML = monthLongs[month]
    document.getElementById("yearText").innerHTML = year

    var events = JSON.parse(document.getElementById("eventsOutput").innerHTML) 

    var daysInMonth = new Date(year, month + 1, 0).getDate()

    var firstDayOfMonth = new Date(year, month, 1)
    var firstDayOfWeek = firstDayOfMonth.getDay()

    var today = new Date().getDate()
    var todayMonth = new Date().getMonth()
    var todayYear = new Date().getFullYear()

    if(firstDayOfWeek === 0){
        firstDayOfWeek = 7
    }

    for(var i = 1; i < firstDayOfWeek; i++)
    {
        var dayDiv = document.createElement("div")
        dayDiv.className = "dayDiv"
        area.append(dayDiv)
    }

    for(var i = 0; i < daysInMonth; i++)
    {
        var dayDiv = document.createElement("div")
        dayDiv.id = i + 1
        dayDiv.className = "realDayDiv"

        var dayText = document.createElement("p")
        dayText.innerHTML = (i + 1)
        dayText.style.fontSize = "20px"

        if(i + 1 === today && month === todayMonth && year === todayYear)
        {
            dayText.style.color = "green"
            dayText.style.fontWeight = "bold"
        }

        var infoPoint = document.createElement("p")
        infoPoint.innerHTML = "&#x2027;"
        infoPoint.className = "infoPoint"

        dayDiv.append(dayText)
        dayDiv.append(infoPoint)
        area.append(dayDiv)
    }

    for(var i = 0; i < events.length; i++)
    {
        var date = events[i].date
        var day = date.slice(7)

        document.getElementsByClassName("infoPoint")[day - 1].style.color = "#3eb1be"

        document.getElementsByClassName("realDayDiv")[day - 1].onclick = function()
        {
            showEventsByDay(this.id, events)
            this.style.background = "#3eb1be"
        }
    }
}

function showEventsByDay(p_day, p_events)
{
    closeCalendarBrowse()

    document.getElementById("browseDivHeader").innerHTML = p_day + ". " + monthLongs[month] + " " + year
    document.getElementById("browseDivHead").style.display = ""

    document.getElementById("closeCalendarBrowseButton").onclick = function()
    {
        closeCalendarBrowse()
    }

    var date = year + "-" + (month + 1) + "-" + p_day

    for(var i = 0; i < p_events.length; i++)
    {
        if(p_events[i].date === date)
        {
            var check = checkIfEventIsLiked(p_events[i]._id)

            if(document.getElementById("postsOutput").innerHTML !== "")
            {
                var checkPost = checkIfEventIsPosted(p_events[i]._id)
            }else{
                var checkPost = false
            }

            createEventDiv(p_events[i], check, checkPost, document.getElementById("browseDiv"))
        }
    }
}

function closeCalendarBrowse()
{
    for(var i = 0; i < document.getElementsByClassName("realDayDiv").length; i++)
    {
        document.getElementsByClassName("realDayDiv")[i].style.background = "transparent"
    }

    document.getElementById("browseDivHead").style.display = "none"

    for(var index = 0; index < document.getElementsByClassName("event-container").length; index)
    {
        document.getElementsByClassName("event-container")[index].remove()
    }
}

function loadProfile()
{
    loadUser()

    var profile = JSON.parse(document.getElementById("profileOutput").innerHTML)
    var followed = document.getElementById("followedOutput").innerHTML

    document.getElementById("fullname").innerHTML = profile.firstname + " " + profile.lastname
    document.getElementById("tagname").innerHTML = "@" + profile.username
    document.getElementById("timeText").innerHTML = "Beigetreten in " + profile.year
    document.getElementById("participationText").innerHTML = profile.participations + " Teilnahmen"

    document.getElementById("followChatInput").value = profile.username

    if(profile.is_creator !== true)
    {
        document.getElementById("verifiedImg").remove()
    }

    if(profile.participations >= 500)
    {
        document.getElementById("participationImg").src = "/img/ranking/gold.png"
    }else if(profile.participations >= 200)
    {
        document.getElementById("participationImg").src = "/img/ranking/silber.png"
    }else if(profile.participations >= 100)
    {
        document.getElementById("participationImg").src = "/img/ranking/bronze.png"
    }else if(profile.participations >= 50)
    {
        document.getElementById("participationImg").src = "/img/ranking/grün.png"
    }else if(profile.participations >= 10)
    {
        document.getElementById("participationImg").src = "/img/ranking/blau.png"
    }

    var form = document.createElement("form")
    form.method = "post"

    var input = document.createElement("input")
    input.type = "text"
    input.readOnly = true
    input.name = "username"
    input.style.display = "none"
    input.value = profile.username

    var button = document.createElement("button")
    button.className = "followButton"

    if(followed === "true"){
        form.action = "/unfollow"
        button.innerHTML = "Folge ich"

        button.style.background = "#121212"
        button.style.border = "1px solid #3eb1be"
        button.style.color = "#3eb1be"
    }else if(followed === "false"){
        form.action = "/follow"
        button.innerHTML = "Folgen"
    }else{
        form.action = "/undoRequest"
        button.innerHTML = "Angefragt"

        button.style.background = "gray"
        button.style.border = "1px solid gray"
    }

    form.append(input)
    form.append(button)

    document.getElementById("followButtonArea").append(form)

    if(followed === "own account")
    {
        button.innerHTML = "Dein Account"
        button.disabled = true
        followed = "true"
    }
    
    document.getElementById("profileHeadline").innerHTML = profile.username

    if(followed === "true")
    {
        document.getElementById("infoDiv").remove()

        var postsArray = JSON.parse(document.getElementById("postsProfileOutput").innerHTML)

        for(var i = 0; i < postsArray.length; i++)
        {
            var checkLike = checkIfEventIsLiked(postsArray[i]._id)

            if(document.getElementById("postsOutput").innerHTML !== "")
            {
                var checkPost = checkIfEventIsPosted(postsArray[i]._id)
            }else{
                var checkPost = false
            }

            createEventDiv(postsArray[i], checkLike, checkPost, document.getElementById("browseDiv"))       
        }
    }
}

function loadRequests()
{
    if(document.getElementById("requestsOutput").innerHTML !== "")
    {
        var requests = JSON.parse(document.getElementById("requestsOutput").innerHTML)  

        console.log(requests)

        for(var i = 0; i < requests.length; i++)
        {
            createRequestDiv(requests[i])
        }
    }
}

function createRequestDiv(p_request)
{
    var id = p_request._id
    var username = p_request.fromUser

    var row = document.createElement("tr")

    var profileForm = document.createElement("form")
    profileForm.method = "get"
    profileForm.action = "/profile"

    var profileFormInput = document.createElement("input")
    profileFormInput.type = "text"
    profileFormInput.name = "username"
    profileFormInput.readOnly = true
    profileFormInput.value = username

    var profileFormButton = document.createElement("button")

    profileForm.append(profileFormInput)
    profileForm.append(profileFormButton)
    profileForm.style.display = "none"

    var profileTD = document.createElement("td")
    var profileImg = document.createElement("img")
    profileImg.src = "img/profile.png"
    profileImg.alt = "Profil"
    profileImg.className = "requestProfile"

    profileTD.append(profileImg)
    profileTD.append(profileForm)

    profileImg.onclick = function(){
        profileFormButton.click()
    }

    var usernameTD = document.createElement("td")
    var usernameText = document.createElement("h3")
    usernameText.innerHTML = username
    usernameText.style.marginLeft = "10px"
    usernameText.style.marginBottom = "20px"

    usernameTD.append(usernameText)

    var checkForm = document.createElement("form")
    checkForm.method = "post"
    checkForm.action = "/acceptFollow"

    var checkFormInput = document.createElement("input")
    checkFormInput.type = "text"
    checkFormInput.name = "id"
    checkFormInput.readOnly = true
    checkFormInput.value = id

    var checkFormButton = document.createElement("button")

    checkForm.append(checkFormInput)
    checkForm.append(checkFormButton)
    checkForm.style.display = "none"

    var checkTD = document.createElement("td")
    var checkImg = document.createElement("img")
    checkImg.src = "img/requestCheck.png"
    checkImg.alt = "Annehmen"

    checkTD.append(checkImg)
    checkTD.append(checkForm)

    checkImg.onclick = function(){
        checkFormButton.click()
    }

    var deleteForm = document.createElement("form")
    deleteForm.method = "post"
    deleteForm.action = "/deleteFollow"

    var deleteFormInput = document.createElement("input")
    deleteFormInput.type = "text"
    deleteFormInput.name = "id"
    deleteFormInput.readOnly = true
    deleteFormInput.value = id

    var deleteFormButton = document.createElement("button")

    deleteForm.append(deleteFormInput)
    deleteForm.append(deleteFormButton)
    deleteForm.style.display = "none"

    var deleteTD = document.createElement("td")
    var deleteImg = document.createElement("img")
    deleteImg.src = "img/requestDelete.png"
    deleteImg.alt = "Ablehnen"

    deleteTD.append(deleteImg)
    deleteTD.append(deleteForm)

    deleteImg.onclick = function(){
        deleteFormButton.click()
    }

    row.append(profileTD)
    row.append(usernameTD)
    row.append(checkTD)
    row.append(deleteTD)

    document.getElementById("requestTable").append(row)
}

function createGroup()
{
    loadUser()

    document.getElementById("usernameInput").value = user.username

    var friends = JSON.parse(document.getElementById("friendsOutput").innerHTML)

    if(localStorage.getItem("notInGroup") === null)
    {
        localStorage.setItem("notInGroup", JSON.stringify(friends))
    }else{
        var friends =  JSON.parse(localStorage.getItem("notInGroup"))
    }

    if(localStorage.getItem("inGroup") === null)
    {
        localStorage.setItem("inGroup", "[]")

        var friendsInGroup = []
    }else{
        var friendsInGroup = JSON.parse(localStorage.getItem("inGroup"))

        document.getElementById("groupCreationUsernameInput").value = JSON.stringify(friendsInGroup)
        console.log(document.getElementById("groupCreationUsernameInput").value)

        for(var i = 0; i < friendsInGroup.length; i++)
        {
            addUserToGroup(friendsInGroup[i], friends, i, friendsInGroup)
        }
    }

    if(friendsInGroup.length < 2)
    {
        document.getElementById("createGroupButtonForm").style.display = "none"
        document.getElementById("createGroupButtonForm").disabled = false
    }

    document.getElementById("searchUserGroupCreation").value = ""

    friends.sort()

    for(var i = 0; i < friends.length; i++)
    {
        createUserDiv(friends[i], friends, i, friendsInGroup)
    }
}

function createUserDiv(p_username, p_friendsArray, index, p_friendsInGroupArray)
{
    var row = document.createElement("tr")
    row.className = "row"

    var profileForm = document.createElement("form")
    profileForm.method = "get"
    profileForm.action = "/profile"

    var profileFormInput = document.createElement("input")
    profileFormInput.type = "text"
    profileFormInput.name = "username"
    profileFormInput.readOnly = true
    profileFormInput.value = p_username

    var profileFormButton = document.createElement("button")

    profileForm.append(profileFormInput)
    profileForm.append(profileFormButton)
    profileForm.style.display = "none"

    var profileTD = document.createElement("td")
    var profileImg = document.createElement("img")
    profileImg.src = "img/profile.png"
    profileImg.alt = "Profil"
    profileImg.className = "requestProfile"

    profileTD.append(profileImg)
    profileTD.append(profileForm)

    profileImg.onclick = function(){
        profileFormButton.click()
    }

    var usernameTD = document.createElement("td")
    var usernameText = document.createElement("h3")
    usernameText.innerHTML = p_username
    usernameText.style.marginLeft = "10px"
    usernameText.style.marginBottom = "20px"

    usernameTD.append(usernameText)

    var addTD = document.createElement("td")
    var addImg = document.createElement("img")
    addImg.src = "img/plus_green.png"
    addImg.alt = "Hinzufügen"

    addImg.onclick = function()
    {
        row.remove()

        p_friendsArray.splice(index, 1)
        localStorage.setItem("notInGroup", JSON.stringify(p_friendsArray))

        p_friendsInGroupArray.push(p_username)
        localStorage.setItem("inGroup", JSON.stringify(p_friendsInGroupArray))

        reloadGroupCreation()
    }

    addTD.append(addImg)

    row.append(profileTD)
    row.append(usernameTD)
    row.append(addTD)

    document.getElementById("friendsTable").append(row)
}

function addUserToGroup(p_username, p_friendsArray, index, p_friendsInGroupArray)
{
    document.getElementById("createGroupButtonForm").style.display = ""

    var row = document.createElement("tr")
    row.className = "rowAdded"

    var profileForm = document.createElement("form")
    profileForm.method = "get"
    profileForm.action = "/profile"

    var profileFormInput = document.createElement("input")
    profileFormInput.type = "text"
    profileFormInput.name = "username"
    profileFormInput.readOnly = true
    profileFormInput.value = p_username

    var profileFormButton = document.createElement("button")

    profileForm.append(profileFormInput)
    profileForm.append(profileFormButton)
    profileForm.style.display = "none"

    var profileTD = document.createElement("td")
    var profileImg = document.createElement("img")
    profileImg.src = "img/profile.png"
    profileImg.alt = "Profil"
    profileImg.className = "requestProfile"

    profileTD.append(profileImg)
    profileTD.append(profileForm)

    profileImg.onclick = function(){
        profileFormButton.click()
    }

    var usernameTD = document.createElement("td")
    var usernameText = document.createElement("h3")
    usernameText.innerHTML = p_username
    usernameText.style.marginLeft = "10px"
    usernameText.style.marginBottom = "20px"

    usernameTD.append(usernameText)

    var removeTD = document.createElement("td")
    var removeImg = document.createElement("img")
    removeImg.src = "img/minus_red.png"
    removeImg.alt = "Entfernen"

    removeImg.onclick = function()
    {
        row.remove()

        p_friendsInGroupArray.splice(index, 1)
        localStorage.setItem("inGroup", JSON.stringify(p_friendsInGroupArray))

        p_friendsArray.push(p_username)
        localStorage.setItem("notInGroup", JSON.stringify(p_friendsArray))

        reloadGroupCreation()
    }

    removeTD.append(removeImg)

    row.append(profileTD)
    row.append(usernameTD)
    row.append(removeTD)

    document.getElementById("addedTable").append(row)
}

function reloadFriends()
{
    localStorage.removeItem("inGroup")
    localStorage.removeItem("notInGroup")

    location.reload()
}

function displayFriendsInListByUsername(p_value)
{
    var user = JSON.parse(document.getElementById("userOutput").innerHTML)

    var friends = user.friends

    while(document.getElementsByClassName("friendRow").length > 0)
    {
        document.getElementsByClassName("friendRow")[0].remove()
    }

    var counter = 0

    if(p_value !== "")
    {
        friends.sort()

        for(var i = 0; i < friends.length; i++)
        {
            if(friends[i].includes(p_value))
            {
                loadFriendRow(friends[i])
                counter += 1
            }
        }
    }else{
        for(var i = 0; i < friends.length; i++)
        {
            loadFriendRow(friends[i])
            counter += 1
        }
    }

    if(counter === 1){
        document.getElementById("friendsCounter").innerHTML = counter + " Freund"
    }else{
        document.getElementById("friendsCounter").innerHTML = counter + " Freunde"
    }
}

function displayFriendsByUsername(p_value)
{
    if(p_value !== "")
    {
        while(document.getElementsByClassName("row").length > 0)
        {
            document.getElementsByClassName("row")[0].remove()
        }

        var friends = JSON.parse(document.getElementById("friendsOutput").innerHTML)

        if(localStorage.getItem("notInGroup") === null)
        {
            localStorage.setItem("notInGroup", JSON.stringify(friends))
        }else{
            var friends =  JSON.parse(localStorage.getItem("notInGroup"))
        }

        if(localStorage.getItem("inGroup") === null)
        {
            localStorage.setItem("inGroup", "[]")

            var friendsInGroup = []
        }else{
            var friendsInGroup = JSON.parse(localStorage.getItem("inGroup"))
        }

        friends.sort()

        for(var i = 0; i < friends.length; i++)
        {
            if(friends[i].includes(p_value))
            {
                createUserDiv(friends[i], friends, i, friendsInGroup)
            }
        }
    }else{
        reloadGroupCreation()
    }
}

function reloadGroupCreation()
{
    while(document.getElementsByClassName("row").length > 0)
    {
        document.getElementsByClassName("row")[0].remove()
    }

    while(document.getElementsByClassName("rowAdded").length > 0)
    {
        document.getElementsByClassName("rowAdded")[0].remove()
    }

    createGroup()
}

function loadGroups()
{
    loadUser()

    var groups = JSON.parse(document.getElementById("groupsOutput").innerHTML)

    console.log(groups)

    groups.reverse()

    for(var i = 0; i < groups.length; i++)
    {
        loadGroup(groups[i], i, groups)
    }
}

function loadGroup(p_group, i, p_groups)
{
    var id = p_group._id
    var name = p_group.name
    var users = p_group.users

    var groupDiv = document.createElement("div")
    groupDiv.className = "groupDiv"

    var chatForm = document.createElement("form")
    chatForm.method = "get"
    chatForm.action = "/chat"

    var chatFormInput = document.createElement("input")
    chatFormInput.type = "text"
    chatFormInput.name = "id"
    chatFormInput.readOnly = true
    chatFormInput.value = id

    var chatFormButton = document.createElement("button")

    chatForm.append(chatFormInput)
    chatForm.append(chatFormButton)
    chatForm.style.display = "none"

    groupDiv.append(chatForm)

    var infoForm = document.createElement("form")
    infoForm.method = "get"
    infoForm.action = "/groupInfo"

    var infoFormInput = document.createElement("input")
    infoFormInput.type = "text"
    infoFormInput.name = "id"
    infoFormInput.readOnly = true
    infoFormInput.value = id

    var infoFormButton = document.createElement("button")

    infoForm.append(infoFormInput)
    infoForm.append(infoFormButton)
    infoForm.style.display = "none"

    groupDiv.append(infoForm)

    var table = document.createElement("table")
    var row = document.createElement("tr")

    var groupTD = document.createElement("td")
    groupTD.style.width = "10%"
    var groupImg = document.createElement("img")
    
    if(users.length === 2){
        groupImg.src = "img/profile.png"
        groupImg.alt = "Profile"

        var form = document.createElement("form")
        form.method = "get"
        form.action = "/profile"

        var formInput = document.createElement("input")
        formInput.type = "text"
        formInput.name = "username"
        formInput.readOnly = true

        if(document.getElementById("groupUsernameText").innerHTML === users[0]){
            formInput.value = users[1]
        }else{
            formInput.value = users[0]
        }

        var formButton = document.createElement("button")

        form.append(formInput)
        form.append(formButton)
        form.style.display = "none"

        groupDiv.append(form)

        groupImg.onclick = function(){
            formButton.click()
        }
    }else{
        groupImg.src = "img/group.png"
        groupImg.alt = "Group"
    }

    groupTD.append(groupImg)

    var chatTD = document.createElement("td")
    var groupHeadText = document.createElement("p")
    groupHeadText.className = "groupHeadText"

    if(id === name){
        if(document.getElementById("groupUsernameText").innerHTML === users[0]){
            groupHeadText.innerHTML = users[1]
        }else{
            groupHeadText.innerHTML = users[0]
        }
    }else{
        groupHeadText.innerHTML = name
    }

    var groupMiniText = document.createElement("p")
    groupMiniText.className = "groupMiniText"
    groupMiniText.innerHTML = "Du: ..."

    chatTD.append(groupHeadText)
    chatTD.append(groupMiniText)

    chatTD.onclick = function(){
        chatFormButton.click()
    }

    var infoTD = document.createElement("td")
    infoTD.style.width = "10%"
    var infoImg = document.createElement("img")
    infoImg.src = "img/information.png"
    infoImg.alt = "Info"

    infoTD.append(infoImg)

    infoTD.onclick = function(){
        infoFormButton.click()
    }

    row.append(groupTD)
    row.append(chatTD)
    row.append(infoTD)

    table.append(row)

    var hr = document.createElement("hr")

    groupDiv.append(table)

    if(p_groups.length > 1 && p_groups.length - 1 !== i)
    {
        groupDiv.append(hr)
    }

    document.getElementById("chatDiv").append(groupDiv)
}

function loadChat()
{
    loadUser()

    var user = JSON.parse(document.getElementById("userOutput").innerHTML)
    var name = document.getElementById("nameOutput").innerHTML
    var groupId = document.getElementById("idOutput").innerHTML
    var messages = JSON.parse(document.getElementById("messagesOutput").innerHTML)

    document.getElementById("groupNameText").innerHTML = name
    document.getElementById("messageGroupInput").value = groupId
    document.getElementById("chatIdInput").value = groupId

    for(var i = 0; i < messages.length; i++)
    {
        loadMessage(messages[i], user.username)
    }
}

function loadMessage(p_message, p_username)
{
    var isShare = p_message.is_share
    var text = p_message.text
    var user = p_message.user
    var time = new Date(p_message.created_at)

    var hours = time.getHours()
    var minutes = time.getMinutes()

    if(minutes < 10)
    {
        time = hours + ":0" + minutes
    }else{
        time = hours + ":" + minutes
    }

    var message = document.createElement("div")
    message.className = "message"

    var div = document.createElement("div")

    if(isShare === true)
    {
        div.className = "sharedEvent"

        var event = JSON.parse(text)
        var id = event[0]._id
        var title = event[0].title
        var location = event[0].location
        var time = event[0].time

        var day = new Date(event[0].date).getDate()
        var month = new Date(event[0].date).getMonth()
        var year = new Date(event[0].date).getFullYear()

        var userinfoMessage = document.createElement("div")
        userinfoMessage.className = "userinfoMessage"
        userinfoMessage.innerHTML = "geteilt von " + user

        var textMessage = document.createElement("div")
        textMessage.className = "textMessage"
        textMessage.innerHTML = title + " in " + location
        textMessage.style.fontSize = "20px"
        textMessage.style.fontWeight = "bold"

        var timeEventMessage = document.createElement("div")
        timeEventMessage.innerHTML = "am " + day + ". " + month + ". " + year + " um " + time + " Uhr"
        timeEventMessage.className = "timeEventMessage"

        div.append(textMessage)
        div.append(timeEventMessage)
        div.append(userinfoMessage)

        var eventViewForm = document.createElement("form")
        eventViewForm.action = "/eventView"
        eventViewForm.method = "get"
        eventViewForm.style.display = "none"

        var eventViewInput = document.createElement("input")
        eventViewInput.type = "text"
        eventViewInput.name = "id"
        eventViewInput.readOnly = true
        eventViewInput.value = id

        var eventViewButton = document.createElement("button")

        eventViewForm.append(eventViewInput)
        eventViewForm.append(eventViewButton)

        div.append(eventViewForm)

        div.onclick = function()
        {
            eventViewButton.click()
        }
    }else{
        if(user === p_username){
            div.className = "rightMessage"
        }else{
            div.className = "leftMessage"
        }

        var usernameMessage = document.createElement("div")
        usernameMessage.className = "usernameMessage"
        usernameMessage.innerHTML = user

        var textMessage = document.createElement("div")
        textMessage.className = "textMessage"
        textMessage.innerHTML = text

        var timeMessage = document.createElement("div")
        timeMessage.className = "timeMessage"
        timeMessage.innerHTML = time

        div.append(usernameMessage)
        div.append(textMessage)
        div.append(timeMessage)
    }

    message.append(div)
    document.getElementById("chatMain").append(message)
}

function loadGroupInfo()
{
    var user = JSON.parse(document.getElementById("userOutput").innerHTML)
    var group = JSON.parse(document.getElementById("groupOutput").innerHTML)
    var requests = JSON.parse(document.getElementById("requestsOutput").innerHTML)

    var day = new Date(group.created_at).getDate()
    var month = new Date(group.created_at).getMonth() + 1
    var year = new Date(group.created_at).getFullYear()

    var date = day + ". " + month + ". " + year

    document.getElementById("editGroupInput").value = group._id

    document.getElementById("usernameGroupsInfoInput").value = user.username
    document.getElementById("createdByText").innerHTML = "Erstellt von " + group.created_by + " am " + date

    if(group.users.length === 1){
        document.getElementById("usersCounter").innerHTML = group.users.length + " Mitglied"
    }else{
        document.getElementById("usersCounter").innerHTML = group.users.length + " Mitglieder"
    }

    if(group.users.length === 2)
    {
        document.getElementById("groupImage").src = "/img/profile.png"
    }

    for(var i = 0; i < group.users.length; i++)
    {
        var groupUser = group.users[i]

        var followBool = user.friends.includes(groupUser)

        if(followBool === false)
        {
            for(var index = 0; index < requests.length; index++)
            {
                if(requests[index].toUser === groupUser)
                {
                    followBool = "request"
                }
            }
        }

        loadGroupRow(groupUser, followBool)
    }

    if(group.created_by !== user.username)
    {
        while(document.getElementsByClassName("onlyAdmin").length > 0)
        {
            document.getElementsByClassName("onlyAdmin")[0].remove()
        }
    }
}

function loadGroupRow(p_groupUser, p_followBool)
{
    var row = document.createElement("tr")
    row.className = "groupRow"

    var profileForm = document.createElement("form")
    profileForm.method = "get"
    profileForm.action = "/profile"

    var profileFormInput = document.createElement("input")
    profileFormInput.type = "text"
    profileFormInput.name = "username"
    profileFormInput.readOnly = true
    profileFormInput.value = p_groupUser

    var profileFormButton = document.createElement("button")

    profileForm.append(profileFormInput)
    profileForm.append(profileFormButton)
    profileForm.style.display = "none"

    var profileTD = document.createElement("td")
    var profileImg = document.createElement("img")
    profileImg.src = "img/profile.png"
    profileImg.alt = "Profil"
    profileImg.className = "requestProfile"

    profileTD.append(profileImg)
    profileTD.append(profileForm)

    profileImg.onclick = function(){
        profileFormButton.click()
    }

    var usernameTD = document.createElement("td")
    var usernameText = document.createElement("h3")
    usernameText.innerHTML = p_groupUser
    usernameText.style.marginLeft = "10px"
    usernameText.style.marginBottom = "20px"

    usernameTD.append(usernameText)

    var followForm = document.createElement("form")
    followForm.method = "post"

    var followFormInput = document.createElement("input")
    followFormInput.type = "text"
    followFormInput.name = "username"
    followFormInput.readOnly = true
    followFormInput.value = p_groupUser

    var followFormButton = document.createElement("button")

    followForm.append(followFormInput)
    followForm.append(followFormButton)
    followForm.style.display = "none"

    var followTD = document.createElement("td")

    var user = JSON.parse(document.getElementById("userOutput").innerHTML)

    if(p_groupUser !== user.username)
    {
        var followButton = document.createElement("button")
        followButton.innerHTML = "Folgen"
        followButton.className = "followButton"
        followButton.style.marginRight = "0px"

        followButton.onclick = function()
        {
            followFormButton.click()
        }

        if(p_followBool === true)
        {
            followButton.innerHTML = "Folge ich"
            followButton.style.background = "#121212"
            followButton.style.border = "1px solid #3eb1be"
            followButton.style.color = "#3eb1be"

            followForm.action = "/unfollowInGroup"
        }else if(p_followBool === false)
        {
            followButton.innerHTML = "Folgen"

            followForm.action = "/followInGroup"
        }else if(p_followBool === "request")
        {
            followButton.innerHTML = "Angefragt"
            followButton.style.background = "gray"
            followButton.style.border = "1px solid gray"
            followButton.style.color = "#121212"

            followForm.action = "/undoRequestInGroup"
        }

        followTD.append(followButton)
        followTD.append(followForm)
        followTD.style.textAlign = "right"
    }

    row.append(profileTD)
    row.append(usernameTD)
    row.append(followTD)

    document.getElementById("userTable").append(row)
}

function displayUsersInGroupByUsername(p_value)
{
    var user = JSON.parse(document.getElementById("userOutput").innerHTML)
    var group = JSON.parse(document.getElementById("groupOutput").innerHTML)
    var requests = JSON.parse(document.getElementById("requestsOutput").innerHTML)

    var users = group.users

    while(document.getElementsByClassName("groupRow").length > 0)
    {
        document.getElementsByClassName("groupRow")[0].remove()
    }

    var counter = 0

    if(p_value !== "")
    {
        users.sort()

        for(var i = 0; i < users.length; i++)
        {
            if(users[i].includes(p_value))
            {
                var followBool = user.friends.includes(users[i])

                if(followBool === false)
                {
                    for(var index = 0; index < requests.length; index++)
                    {
                        if(requests[index].toUser === users[i])
                        {
                            followBool = "request"
                        }
                    }
                }

                loadGroupRow(users[i], followBool)
                counter += 1
            }
        }
    }else{
        for(var i = 0; i < users.length; i++)
        {
            var followBool = user.friends.includes(users[i])

            if(followBool === false)
            {
                for(var index = 0; index < requests.length; index++)
                {
                    if(requests[index].toUser === users[i])
                    {
                        followBool = "request"
                    }
                }
            } 

            loadGroupRow(users[i], followBool)
            counter += 1
        }
    }

    if(counter === 1){
        document.getElementById("usersCounter").innerHTML = counter + " Mitglied"
    }else{
        document.getElementById("usersCounter").innerHTML = counter + " Mitglieder"
    }
}

function openEditDiv(p_div)
{
    document.getElementById("profileTop").style.display = "none"
    document.getElementById("main").style.display = "none"
    document.getElementById(p_div).style.display = ""
}

function closeEditDiv(p_div)
{
    document.getElementById("profileTop").style.display = ""
    document.getElementById("main").style.display = ""
    document.getElementById(p_div).style.display = "none"

    refreshGroupEditInfoTexts()
}

function refreshGroupEditInfoTexts()
{
    if(document.getElementById("addedFriendsInput").value !== "")
    {
        var addedFriends = JSON.parse(document.getElementById("addedFriendsInput").value)
    }

    if(document.getElementById("removedUserInput").value !== "")
    {
        var removedUsers = JSON.parse(document.getElementById("removedUserInput").value)
    }

    if(addedFriends !== undefined && addedFriends.length !== 0)
    {
        document.getElementById("addedFriendsInfoTable").style.display = ""

        if(addedFriends.length === 1)
        {
            document.getElementById("addedFriendsInfo").innerHTML = addedFriends.length + " neuer Nutzer"
        }else{
            document.getElementById("addedFriendsInfo").innerHTML = addedFriends.length + " neue Nutzer"
        }
    }else{
        document.getElementById("addedFriendsInfoTable").style.display = "none"
    }
 
    if(removedUsers !== undefined && removedUsers.length !== 0)
    {
        document.getElementById("removedUsersInfoTable").style.display = ""
        document.getElementById("removedUsersInfo").innerHTML = removedUsers.length + " Nutzer entfernt"
    }else{
        document.getElementById("removedUsersInfoTable").style.display = "none"
    }

    var group = JSON.parse(document.getElementById("groupOutput").innerHTML)
    var oldAdmin = group.created_by
    var newAdmin = document.getElementById("newAdminInput").value

    if(document.getElementById("newAdminInput").value !== "" && newAdmin !== oldAdmin)
    {
        document.getElementById("newAdminInfoTable").style.display = ""
        document.getElementById("newAdminInfo").innerHTML = "Neuer Admin: " + document.getElementById("newAdminInput").value
    }else{
        document.getElementById("newAdminInfoTable").style.display = "none"
    }
}

function loadGroupEdit()
{
    var group = JSON.parse(document.getElementById("groupOutput").innerHTML)

    document.getElementById("usernameGroupsInfoInput").value = group._id
    document.getElementById("usernameGroupsInfoInput1").value = group._id

    document.getElementById("groupnameInput").value = group.name

    loadUsersInGroupEdit()
    loadFriendsInGroupEdit()
    loadAdminEdit()

    if(group.users.length === 2)
    {
        document.getElementById("groupnameDiv").remove()
        document.getElementById("main").style.marginTop = "30px"
    }
}

function loadUsersInGroupEdit()
{
    var group = JSON.parse(document.getElementById("groupOutput").innerHTML)
    var users = group.users

    users.sort()

    for(var i = 0; i < users.length; i++)
    {
        if(document.getElementById(users[i]) === null)
        {
            loadUserRowForGroup(users[i], "userInGroupRow", "userInGroupTable", "/img/minus_red.png")
        }
    }

    if(document.getElementsByClassName("redoUserInGroupRow").length > 0)
    {
        document.getElementById("removedUserDiv").style.display = ""
    }else{
        document.getElementById("removedUserDiv").style.display = "none"
    }

    document.getElementById("userCounter").innerHTML = document.getElementsByClassName("userInGroupRow").length + " Mitglieder"
}

function loadFriendsInGroupEdit()
{
    var friends = JSON.parse(document.getElementById("friendsOutput").innerHTML)

    friends.sort()

    for(var i = 0; i < friends.length; i++)
    {
        if(document.getElementById(friends[i] + "Friend") === null && document.getElementById( friends[i] + "userInGroupRow") === null)
        {
            loadUserRowForGroup(friends[i], "friendToAddRow", "friendsTable", "/img/plus_green.png")
        }
    }

    if(document.getElementsByClassName("redoFriendInGroupRow").length > 0)
    {
        document.getElementById("addedFriendsDiv").style.display = ""
    }else{
        document.getElementById("addedFriendsDiv").style.display = "none"
    }

    if(document.getElementsByClassName("friendToAddRow").length === 1)
    {
        document.getElementById("friendsCounter").innerHTML = document.getElementsByClassName("friendToAddRow").length + " Freund"
    }else{
        document.getElementById("friendsCounter").innerHTML = document.getElementsByClassName("friendToAddRow").length + " Freunde"
    }
}   

function loadUserRowForGroup(p_user, p_className, p_area, p_image)
{
    var row = document.createElement("tr")
    row.className = p_className
    row.id = p_user + p_className

    var profileTD = document.createElement("td")
    var profileImg = document.createElement("img")
    profileImg.src = "img/profile.png"
    profileImg.alt = "Profil"
    profileImg.className = "requestProfile"

    profileTD.append(profileImg)

    var usernameTD = document.createElement("td")
    var usernameText = document.createElement("h3")
    usernameText.innerHTML = p_user
    usernameText.style.marginLeft = "10px"
    usernameText.style.marginBottom = "20px"

    usernameTD.append(usernameText)

    var removeTD = document.createElement("td")
    var removeImg = document.createElement("img")
    removeImg.src = p_image

    if(p_area === "userInGroupTable")
    {
        removeImg.onclick = function()
        {
            createUndoTableRow(p_user, "redoUserInGroupRow", "removedUserTable", "/img/plus_green.png", "removeUser")
            row.remove()
            
            document.getElementById("removedUserDiv").style.display = ""
            document.getElementById("userCounter").innerHTML = document.getElementsByClassName(p_className).length + " Mitglieder"
        }
    }else if(p_area === "friendsTable")
    {
        removeImg.onclick = function()
        {
            createUndoTableRow(p_user, "redoFriendInGroupRow", "addedFriendsTable", "/img/minus_red.png", "addedFriend")
            row.remove()
            
            document.getElementById("addedFriendsDiv").style.display = ""
            document.getElementById("friendsCounter").innerHTML = document.getElementsByClassName(p_className).length + " Mitglieder"
        }
    }

    removeTD.append(removeImg)

    var user = JSON.parse(document.getElementById("userOutput").innerHTML)
    var admin = document.getElementById("newAdminInput").value

    if(p_user === user.username || p_user === admin)
    {
        removeImg.remove()
    }

    row.append(profileTD)
    row.append(usernameTD)
    row.append(removeTD)

    document.getElementById(p_area).append(row)
}

function createUndoTableRow(p_user, p_className, p_area, p_image, p_undoClassName)
{
    var row = document.createElement("tr")
    row.className = p_className

    var profileTD = document.createElement("td")
    var profileImg = document.createElement("img")
    profileImg.src = "img/profile.png"
    profileImg.alt = "Profil"
    profileImg.className = "requestProfile"

    profileTD.append(profileImg)

    var usernameTD = document.createElement("td")
    var usernameText = document.createElement("h3")
    usernameText.innerHTML = p_user
    usernameText.style.marginLeft = "10px"
    usernameText.style.marginBottom = "20px"
    usernameText.className = p_undoClassName

    usernameTD.append(usernameText)

    var redoTD = document.createElement("td")
    var redoImg = document.createElement("img")
    redoImg.src = p_image

    if(p_area === "removedUserTable")
    {
        usernameText.id = p_user

        redoImg.onclick = function()
        {
            while(document.getElementsByClassName("userInGroupRow").length > 0)
            {
                document.getElementsByClassName("userInGroupRow")[0].remove()
            }

            row.remove()
            loadUsersInGroupEdit()
        }
    }else if(p_area === "addedFriendsTable")
    {
        usernameText.id = p_user + "Friend"

        redoImg.onclick = function()
        {
            while(document.getElementsByClassName("friendToAddRow").length > 0)
            {
                document.getElementsByClassName("friendToAddRow")[0].remove()
            }

            row.remove()
            loadFriendsInGroupEdit()
        }
    }

    redoTD.append(redoImg)

    row.append(profileTD)
    row.append(usernameTD)
    row.append(redoTD)

    document.getElementById(p_area).append(row)
}

function saveRemovedUsers()
{
    var array = []

    for(var i = 0; i < document.getElementsByClassName("removeUser").length; i++)
    {
        array.push(document.getElementsByClassName("removeUser")[i].innerHTML)
    }

    document.getElementById("removedUserInput").value = JSON.stringify(array)
    closeEditDiv("removeUserDiv")

    while(document.getElementsByClassName("userRow").length > 0)
    {
        document.getElementsByClassName("userRow")[0].remove()
    }

    loadAdminEdit()
}

function saveAddedFriends()
{
    var array = []

    for(var i = 0; i < document.getElementsByClassName("addedFriend").length; i++)
    {
        array.push(document.getElementsByClassName("addedFriend")[i].innerHTML)
    }

    document.getElementById("addedFriendsInput").value = JSON.stringify(array)
    closeEditDiv("addUserDiv")
}

function loadAdminEdit()
{
    var group = JSON.parse(document.getElementById("groupOutput").innerHTML)

    var users = []
    
    for(var i = 0; i < document.getElementsByClassName("userInGroupRow").length; i++)
    {
        var name = document.getElementsByClassName("userInGroupRow")[i].id.replace("userInGroupRow","")

        users.push(name)
    }

    var admin = group.created_by

    for(var i = 0; i < users.length; i++)
    {
        loadUserRowToChangeAdmin(users[i])
            
        if(document.getElementsByClassName("adminRadio")[i].value === admin)
        {
            document.getElementsByClassName("adminRadio")[i].checked = true
        }
    }
}

function loadUserRowToChangeAdmin(p_user)
{
    var row = document.createElement("tr")
    row.className = "userRow"
    row.id = p_user + "AdminRow"

    var profileTD = document.createElement("td")
    var profileImg = document.createElement("img")
    profileImg.src = "img/profile.png"
    profileImg.alt = "Profil"
    profileImg.className = "requestProfile"

    profileTD.append(profileImg)

    var usernameTD = document.createElement("td")
    var usernameText = document.createElement("h3")
    usernameText.innerHTML = p_user
    usernameText.style.marginLeft = "10px"
    usernameText.style.marginBottom = "20px"
    usernameText.className = "usernameTextAdmin"

    usernameTD.append(usernameText)

    var radioTD = document.createElement("td")
    var radioInput = document.createElement("input")
    radioInput.type = "radio"
    radioInput.name = "adminRadio"
    radioInput.className = "adminRadio"
    radioInput.value = p_user

    radioTD.append(radioInput)

    row.append(profileTD)
    row.append(usernameTD)
    row.append(radioTD)

    document.getElementById("adminTable").append(row)
}

function saveAdmin()
{
    for(var i = 0; i < document.getElementsByClassName("adminRadio").length; i++)
    {
        if(document.getElementsByClassName("adminRadio")[i].checked === true)
        {
            document.getElementById("newAdminInput").value = document.getElementsByClassName("adminRadio")[i].value
        }
    }

    closeEditDiv("changeAdminDiv")

    while(document.getElementsByClassName("userInGroupRow").length > 0)
    {
        document.getElementsByClassName("userInGroupRow")[0].remove()
    }

    loadUsersInGroupEdit()
}

function displayUsersToChangeAdminByUsername(p_value)
{
    while(document.getElementsByClassName("userRow").length > 0)
    {
        document.getElementsByClassName("userRow")[0].remove()
    }

    loadAdminEdit()

    if(p_value !== "")
    {
        for(var i = 0; i < document.getElementsByClassName("userRow").length; i++)
        {
            if(!document.getElementsByClassName("userRow")[i].id.includes(p_value))
            {
                document.getElementsByClassName("userRow")[i].remove()
                i--
            }
        }
    }
}

function displayFriendsToAppendByUsername(p_value)
{
    while(document.getElementsByClassName("friendToAddRow").length > 0)
    {
        document.getElementsByClassName("friendToAddRow")[0].remove()
    }

    loadFriendsInGroupEdit()

    if(p_value !== "")
    {
        for(var i = 0; i < document.getElementsByClassName("friendToAddRow").length; i++)
        {
            if(!document.getElementsByClassName("friendToAddRow")[i].id.includes(p_value))
            {
                document.getElementsByClassName("friendToAddRow")[i].remove()
                i--
            }
        }
    }

    if(document.getElementsByClassName("friendToAddRow").length === 1)
    {
        document.getElementById("friendsCounter").innerHTML = document.getElementsByClassName("friendToAddRow").length + " Freund"
    }else{
        document.getElementById("friendsCounter").innerHTML = document.getElementsByClassName("friendToAddRow").length + " Freunde"
    }
}

function displayUsersInGroupToRemoveByUsername(p_value)
{
    while(document.getElementsByClassName("userInGroupRow").length > 0)
    {
        document.getElementsByClassName("userInGroupRow")[0].remove()
    }

    loadUsersInGroupEdit()

    if(p_value !== "")
    {
        for(var i = 0; i < document.getElementsByClassName("userInGroupRow").length; i++)
        {
            if(!document.getElementsByClassName("userInGroupRow")[i].id.includes(p_value))
            {
                document.getElementsByClassName("userInGroupRow")[i].remove()
                i--
            }
        }
    }

    if(document.getElementsByClassName("userInGroupRow").length === 1)
    {
        document.getElementById("friendsCounter").innerHTML = document.getElementsByClassName("userInGroupRow").length + " Freund"
    }else{
        document.getElementById("friendsCounter").innerHTML = document.getElementsByClassName("userInGroupRow").length + " Freunde"
    }
}

function searchGroupByName(p_value)
{
    while(document.getElementsByClassName("groupDiv").length > 0)
    {
        document.getElementsByClassName("groupDiv")[0].remove()
    }

    openShareDiv(eventId)

    if(p_value !== "")
    {
        for(var i = 0; i < document.getElementsByClassName("groupDiv").length; i++)
        {
            if(!document.getElementsByClassName("groupDiv")[i].id.includes(p_value))
            {
                document.getElementsByClassName("groupDiv")[i].remove()
                i--
            }
        }
    }
}

function authInput(p_index, p_value, key)
{
    if(key === "Backspace" && p_index !== 0) 
    {
        document.getElementsByClassName("authInput")[p_index - 1].focus()
    }else if(p_index !== 4){
        document.getElementsByClassName("authInput")[p_index + 1].focus()
    }

    if(p_index === 4)
    {
        var code = document.getElementsByClassName("authInput")[0].value 
        + document.getElementsByClassName("authInput")[1].value 
        + document.getElementsByClassName("authInput")[2].value  
        + document.getElementsByClassName("authInput")[3].value  
        + document.getElementsByClassName("authInput")[4].value  

        document.getElementById("codeInput").value = code
        document.getElementById("codeButton").click()
    }
}