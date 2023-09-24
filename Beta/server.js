const express = require("express")
const bodyParser =  require("body-parser")
const mongoose = require("mongoose")
const User = require("./models/User.js")
const Event = require("./models/Event.js")
const Group = require("./models/Group.js")
const Message = require("./models/Message.js")
const Comment = require("./models/Comment.js")
const Post = require("./models/Post.js")
const Follow = require("./models/Follow.js")
const Reply = require("./models/Reply.js")
const app = express()
const ejs = require("ejs")
const nodemailer = require('nodemailer')
const AuthCode = require("./models/AuthCode.js")

//connect to the server

class post {
    constructor(eventId, event)
    {
        this.eventId = eventId
        this.event = event
        this.usernames = []
    }
}

const url = "mongodb+srv://yann:yann07042005@weekendspot.rzo5dud.mongodb.net/?retryWrites=true&w=majority"

async function connect()
{
    try{
        await mongoose.connect(url)
        console.log("Connected")
    } catch (error)
    {
        console.log(error)
    }
}

var logedInUser = {
    firstname : "",
    lastname : "",
    username : "",
    email : "",
    password : "",
    friends : "",
    year : 0,
    participations : 0,
    is_creator : false
}

var events = []
var comments = []
var users = []
var posts = []

var groupId = ""
var commentId = ""

var newcode
var signedInfirstName 
var signedInlastname 
var signedInusername
var signedInemail 
var signedInpassword 

var year = new Date().getFullYear()
var month = new Date().getMonth() + 1

connect()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.use(express.static(__dirname + '/'))

const port = 3000
app.listen(port, () => console.log(`Server startet on port ${port}`));

const transporter = nodemailer.createTransport({
    host: "smtp-relay.sendinblue.com",
    port : 587,
    auth: {
        user: "weekendspotde@gmail.com",
        pass: "2DHKV7R8jgx9Ezrh"
    }
})

app.get("/", async function(req, res){
    if(logedInUser.firstname !== "")
    {
        res.redirect("/home")
    }

    res.render("index", {
        error : ""
    })
})

app.post("/logIn", async function(req, res)
{
    var username = req.body.username
    var password = req.body.password

    var check = await checkIfPasswordMatches(username, password)

    if(check)
    {
        var user = await getUserByUsername(username)

        saveLogedInUser(user[0].firstname, user[0].lastname, user[0].username, user[0].email, user[0].password, user[0].friends, user[0].participations, user[0].is_creator)
        res.redirect("/home")
    }else
    {
        res.render("index", {
            error : 1
        })
    }
})

app.post("/signIn", async function(req, res)
{
    signedInfirstName = req.body.firstname
    signedInlastname = req.body.lastname
    signedInusername = req.body.username
    signedInemail = req.body.email
    signedInpassword = req.body.password

    var check = await checkUsernameAndEmail(signedInusername, signedInemail)

    if(check && await AuthCode.findOne({ email : signedInemail }) === null)
    {
        newcode = Math.floor(10000 + Math.random() * 90000)

        while(await AuthCode.findOne({ code : newcode }))
        {
            newcode = Math.floor(10000 + Math.random() * 90000)
        }

        var codeObject = new AuthCode({ code : newcode, email : signedInemail})
        codeObject.save()

        const mailOptions = {
            from: "weekendspotde@gmail.com",
            to : signedInemail,
            subject : "Dein zeitlich limitierter Authentifikations Code lautet " + newcode,
            html : `
            <p>Hey Yann,</p>
            <p>um dich erfolgreich zu authentifizieren, nutze diesen Code:</p>
            <h1 style="font-size: 36px; color: #333;">${newcode}</h1>
            <hr>
            <p>Wenn Sie glauben, dass Sie diese E-Mail fälschlicherweise erhalten haben, ignorieren Sie diese E-Mail bitte.</p>
            <p>Danke,<br>WIISPOT</p>
        `
        }

        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                console.error(error)
                res.status(500).send('E-Mail konnte nicht gesendet werden.')
            } else {
                res.render("auth")
            }
        })
    }else
    {
        console.log("E-Mail or Username already used")
        res.render("index", {
            error : 0
        })
    }
})

app.post("/authenticationDone", async function(req, res) 
{
    var code = req.body.codeInput

    if(await AuthCode.findOne({ code : code, email : signedInemail}))
    {
        createUser(signedInfirstName, signedInlastname, signedInusername, signedInemail, signedInpassword)

        res.render("signIn")

        saveLogedInUser(signedInfirstName, signedInlastname, signedInusername, signedInemail, signedInpassword, "", 0, false)

        await AuthCode.deleteOne({ code : newcode })
    }else{
        await AuthCode.deleteOne({ email : signedInemail})

        res.render("index", {
            error : 3
        })
    }
})

app.get("/home", async function(req, res)
{
    await Event.find().then((data) => {
        events = data
    })

    await User.find().then((data) => {
        users = data
    })

    if(logedInUser.firstname !== "")
    {
        posts = await Post.find({ username : logedInUser.username })

        var friendsPostsArray = []

        for(var i = 0; i < logedInUser.friends.length; i++)
        {
            var friend = logedInUser.friends[i]

            var friendsPosts = await Post.find({ username : friend })

            for(var ii = 0; ii < friendsPosts.length; ii++)
            {
                if(friendsPostsArray.length === 0)
                {
                    var postedEvent = await Event.findOne({ _id : friendsPosts[ii].event })

                    var newPost = new post(friendsPosts[ii].event, postedEvent)
                    newPost.usernames.push(friend)

                    friendsPostsArray.push(newPost)
                }else{
                    for(var index = 0; index < friendsPostsArray.length; index++)
                    {
                        var indexOfEvent = friendsPostsArray.map(function(e) { return e.eventId; }).indexOf(friendsPosts[ii].event)
                
                        var friendBool = friendsPostsArray[index].usernames.includes(friend)

                        if(indexOfEvent !== -1 && friendBool === false)
                        {
                            friendsPostsArray[index].usernames.push(friend)
                        }else if(indexOfEvent === -1){
                            var postedEvent = await Event.findOne({ _id : friendsPosts[ii].event })

                            var newPost = new post(friendsPosts[ii].event, postedEvent)
                            newPost.usernames.push(friend)

                            friendsPostsArray.push(newPost)
                        }
                    }
                }
            }   
        }

        var groups = await Group.find({ users : logedInUser.username })

        renderHome(res, JSON.stringify(events), JSON.stringify(logedInUser), JSON.stringify(users), JSON.stringify(posts), JSON.stringify(groups), JSON.stringify(friendsPostsArray))
    }else{
        renderHome(res, JSON.stringify(events), "", "", "", "", "")
    }

    app.post("/searchByDay", async function(req, res)
    {
        var day = req.body.dayOption
        var dayIndex = req.body.dayOptionIndex
        var newEvents = []

        if(dayIndex == 2)
        {
            const dayArray = day.split(",")

            var combinedArray = []

            for(var i = 0; i < 3; i++)
            {
                var newArray

                await Event.where("date").equals(dayArray[i]).then((data) => {
                    newArray = data
                })

                combinedArray = combinedArray.concat(newArray)
            }

            renderSearch(res, JSON.stringify(combinedArray), JSON.stringify(logedInUser), true, dayIndex, "")
        }else{
            await Event.where("date").equals(day).then((data) => {
                newEvents = data
            })
            
            renderSearch(res, JSON.stringify(newEvents), JSON.stringify(logedInUser), true, dayIndex, "")
        }
    })
})

app.get("/profile", async function(req, res) {
    var username = req.query.username

    var profile = await User.findOne({ username : username })
    var user = await User.findOne({ username : logedInUser.username })
    saveLogedInUser(user.firstname, user.lastname, user.username, user.email, user.password, user.friends, user.participations, user.is_creator)

    var followRequest = await Follow.find({ fromUser : logedInUser.username, toUser : username })

    if(username === logedInUser.username)
    {
        var followed = "own account"
    }else{
        if(followRequest.length === 1)
        {
            var followed = 0
        }else{
            var check = checkIfUsernameIsFriend(username)

            if(check)
            {
                var followed = true
            }else{
                var followed = false
            }
        } 
    }

    var profilePosts = await Post.find({ username : username })

    var profilePostsArray = []

    for(var i = 0; i < profilePosts.length; i++)
    {
        var eventId = profilePosts[i].event

        var event = await Event.findOne({ _id : eventId })
        profilePostsArray.push(event)
    }

    var postsUser = await Post.find({ username : logedInUser.username })

    renderProfile(res, profile, followed, profilePostsArray, postsUser)
})

app.get("/eventView", async function(req, res) {
    var id = req.query.id

    events = await Event.findById(id)
    comments = await Comment.find({ event: id })

    var replyArray = []

    for(var i = 0; i < comments.length; i++)
    {
        var replies = await Reply.find({ commentId : comments[i]._id })

        replyArray.push(replies.length)

        var user = await User.findOne({ username : comments[i].username })

        comments[i].username = JSON.stringify(user)
    }

    var length = await Post.countDocuments({ event : id, username : logedInUser.username })

    if(length === 1){
        var posted = true
    }else{
        var posted = false
    }

    var participations = []

    for(var i = 0; i < logedInUser.friends.length; i++)
    {
        var post = await Post.findOne({ event : id, username : logedInUser.friends[i] })
        
        if(post !== null)
        {
            var user = await User.findOne({ username : post.username })

            participations.push(user)
        }
    }

    var groups = await Group.find({ users : logedInUser.username })

    renderEventView(res, posted, participations, groups, replyArray)
})

app.get("/participations", async function(req, res)
{
    var id = req.query.id
    var participations = []

    for(var i = 0; i < logedInUser.friends.length; i++)
    {
        var post = await Post.findOne({ event : id, username : logedInUser.friends[i] })
        
        if(post !== null)
        {
            var user = await User.findOne({ username : post.username })

            participations.push(user)
        }
    }

    renderParticipations(res, participations)
})

app.post("/deleteComment", async function(req, res) {
    var id = req.body.id
    var event = req.body.event
    
    await Comment.deleteOne({ _id : id,  username : logedInUser.username})

    comments = await Comment.find({ event: event })

    res.redirect(`/eventView?id=${event}`)
})

app.post("/comment", async function(req, res) {
    var text = req.body.text
    var event = req.body.event

    await createComment(text, event)

    comments = await Comment.find({ event: event })

    res.redirect(`/eventView?id=${event}`)
})

app.get("/comments", async function(req, res)
{
    commentId = req.query.id

    var comment = await Comment.findOne({ _id : commentId })

    var profile = await User.findOne({ username : comment.username })
    comment.username = JSON.stringify(profile)

    var replies = await Reply.find({ commentId : commentId })

    for(var i = 0; i < replies.length; i++)
    {
        var user = await User.findOne({ username : replies[i].username })

        replies[i].username = JSON.stringify(user)
    }

    renderComment(res, JSON.stringify(comment), JSON.stringify(replies), JSON.stringify(profile), JSON.stringify(logedInUser), comment.event)
})

app.post("/reply", async function(req, res) {
    var text = req.body.text

    const currentDate = new Date()

    var reply = new Reply({text : text, username : logedInUser.username, commentId : commentId, created_at : currentDate})
    reply.save()

    res.redirect(`/comments?id=${commentId}`)
})

app.post("/deleteReply", async function(req, res) {
    var id = req.body.id

    await Reply.deleteOne({ _id : id })

    res.redirect(`/comments?id=${commentId}`)
})

app.post("/post", async function(req, res) {
    var event = req.body.event

    var length = await Post.countDocuments({ event : event, username : logedInUser.username })

    if(length === 0){
        const post = new Post({ event : event, username : logedInUser.username })
	    await post.save()
    }

    res.redirect(`/eventView?id=${event}`)
})

app.post("/deletePost", async function(req, res) {
    var event = req.body.event

    await Post.deleteOne({ event : event, username : logedInUser.username })

    res.redirect(`/eventView?id=${event}`)
})

app.post("/follow", async function(req, res) {
    const follow = new Follow({ toUser : req.body.username, fromUser : logedInUser.username, confirmed : false })
	await follow.save()

    res.redirect(`/profile?username=${req.body.username}`)
})

app.post("/unfollow", async function(req, res) {
    await User.updateOne({ username : req.body.username }, { $pull: {friends :  logedInUser.username }})
    await User.updateOne({ username : logedInUser.username }, { $pull: {friends : req.body.username }})

    var user = await User.findOne({ username : logedInUser.username })
    saveLogedInUser(user.firstname, user.lastname, user.username, user.email, user.password, user.friends, user.participations, user.is_creator)

    res.redirect(`/profile?username=${req.body.username}`)
})

app.post("/undoRequest", async function(req, res) {
    await Follow.deleteOne({ fromUser : logedInUser.username, toUser : req.body.username })

    res.redirect(`/profile?username=${req.body.username}`)
})

app.post("/removeFriend", async function(req, res) {
    await User.updateOne({ username : req.body.username }, { $pull: {friends : logedInUser.username }})
    await User.updateOne({ username : logedInUser.username }, { $pull: {friends : req.body.username }})

    var user = await User.findOne({ username : logedInUser.username })
    saveLogedInUser(user.firstname, user.lastname, user.username, user.email, user.password, user.friends, user.participations, user.is_creator)

    res.redirect(`/friendlist?username=${logedInUser.username}`)
})

app.get("/signIn", function(req, res)
{
    res.render("signIn")
})

app.get("/likes", function(req, res)
{
    res.render("likes")
})

app.get("/search", async function(req, res)
{
    var eventTitle = ""

    await Event.find().then((data) => {
        events = data
    })

    if(logedInUser.firstname !== "")
    {
        renderSearch(res, JSON.stringify(events), JSON.stringify(logedInUser), false, false, "")
    }else{
        renderSearch(res, JSON.stringify(events), "", false, false, "")
    }

    app.post("/searchFiltered", async function(req, res)
    {
        if(req.body.filter !== "")
        {
            var filter = JSON.parse(req.body.filter)

            var location = filter.location
            var day = filter.day
            var price = filter.price
            var category = filter.category

            events = await Event.find()

            if(location !== ""){
                for(var i = 0; i < events.length; i++)
                {
                    if(!events[i].location.includes(location))
                    {
                        events.splice(i, 1)
                        i--
                    }
                }
            }

            if(day !== "")
            {
                for(var i = 0; i < events.length; i++)
                {
                    if(events[i].date !== day)
                    {
                        events.splice(i, 1)
                        i--
                    }
                }
            } 

            if(price !== "" && price !== 1000)
            {
                for(var i = 0; i < events.length; i++)
                {
                    if(events[i].lowestPrice > price)
                    {
                        events.splice(i, 1)
                        i--
                    }
                }
            }

            if(category !== "")
            {
                var categoryArray = [category[0], category[1], category[2], category[3]]

                for(var i = 0; i < events.length; i++)
                {
                    if(events[i].category === categoryArray)
                    {
                        events.splice(i, 1)
                        i--
                    }
                }
            }

            if(logedInUser.firstname !== "")
            {
                renderSearch(res, JSON.stringify(events), JSON.stringify(logedInUser), true, false, eventTitle)
            }else{
                renderSearch(res, JSON.stringify(events), "", true, false, eventTitle)
            }
        }
    })

    app.post("/searchByDay", async function(req, res)
    {
        var day = req.body.dayOption
        var dayIndex = req.body.dayOptionIndex
        var newEvents = []

        if(dayIndex == 2)
        {
            const dayArray = day.split(",")

            var combinedArray = []

            for(var i = 0; i < 3; i++)
            {
                var newArray

                await Event.where("date").equals(dayArray[i]).then((data) => {
                    newArray = data
                })

                combinedArray = combinedArray.concat(newArray)
            }

            renderSearch(res, JSON.stringify(combinedArray), JSON.stringify(logedInUser), true, dayIndex, eventTitle)
        }else{
            await Event.where("date").equals(day).then((data) => {
                newEvents = data
            })
            
            renderSearch(res, JSON.stringify(newEvents), JSON.stringify(logedInUser), true, dayIndex, eventTitle)
        }
    })

    app.post("/searchByEventName", async function(req, res)
    {
        eventTitle = req.body.title
        
        events = await Event.find({ title : { $regex: eventTitle} })

        renderSearch(res, JSON.stringify(events), JSON.stringify(logedInUser), true, false, eventTitle)
    })
})

app.get("/calendar", async function(req, res){
    year = new Date().getFullYear()
    month = new Date().getMonth() + 1

    var date = year + "-" + month

    var regexPattern = new RegExp(`^${date}`)
    events = await Event.find({ date: { $regex: regexPattern } })
    var groups = await Group.find({ users : logedInUser.username })

    month = date.slice(5)

    renderCalendar(res, JSON.stringify(groups))

    app.post("/monthUp", async function(req, res){
        if(month == 12)
        {
            month = 1
            year++
        }else{
            month++
        }

        var date = year + "-" + month

        var regexPattern = new RegExp(`^${date}`)
        events = await Event.find({ date: { $regex: regexPattern } })
        var groups = await Group.find({ users : logedInUser.username })

        month = date.slice(5)

        renderCalendar(res, JSON.stringify(groups))
    })

    app.post("/monthDown", async function(req, res){
        if(month == 1)
        {
            month = 12
            year--
        }else{
            month--
        }

        var date = year + "-" + month

        var regexPattern = new RegExp(`^${date}`)
        events = await Event.find({ date: { $regex: regexPattern } })
        var groups = await Group.find({ users : logedInUser.username })

        month = date.slice(5)

        renderCalendar(res, JSON.stringify(groups))
    })
})

app.get("/groups", async function(req, res)
{
    var username = req.query.username

    var groups = await Group.find({ users : username })

    renderGroups(res, groups)
    //res.redirect(`/groups?username=${logedInUser.username}`)
})

app.post("/createChat", async function(req, res)
{
    var username = req.body.username

    var time = new Date().getTime()

    var group = new Group({ name : "_id" , users : [username, logedInUser.username], created_at : time, created_by : logedInUser.username})
    group.save()

    await Group.updateOne({ _id : group._id }, { name : group.id })

    groupId = group._id
    res.redirect(`/chat?id=${groupId}`)
})

app.get("/createGroup", async function(req, res)
{
    var friends = logedInUser.friends

    res.render("createGroup",{
        user : JSON.stringify(logedInUser),
        friends : JSON.stringify(friends)
    })
})

app.post("/createGroup", async function(req, res)
{
    var members = JSON.parse(req.body.usernames)
    var title = req.body.title

    members.push(logedInUser.username)

    var time = new Date().getTime()

    var group = new Group({ name : title, users : members, created_at : time, created_by : logedInUser.username})
    group.save()

    res.redirect(`/groups?username=${logedInUser.username}`)
})

app.post("/deleteGroup", async function(req, res)
{
    await Group.deleteOne({ _id : groupId })
    await Message.deleteMany({ group : groupId })

    res.redirect(`/groups?username=${logedInUser.username}`)
})

app.post("/leaveGroup", async function(req, res)
{   
    var group = await Group.findOne({ _id : groupId })

    if(group.users.length === 2)
    {
        await Group.deleteOne({ _id : groupId })
    }else{
        await Group.updateOne({ _id : groupId }, { $pull: {users : logedInUser.username }})
    }

    res.redirect(`/groups?username=${logedInUser.username}`)
})    

app.get("/chat", async function(req, res)
{
    groupId = req.query.id

    var messages = await Message.find({ group : groupId })
    var group = await Group.findOne({ _id : groupId })

    if(group.users.length === 2)
    {
        if(group.users[0] === logedInUser.username)
        {
            var name = group.users[1] 
        }else{
            var name = group.users[0] 
        }
    }else{
        var name = group.name
    }

    renderChat(res, JSON.stringify(logedInUser), name, groupId, JSON.stringify(messages))
})

app.post("/message", async function(req, res)
{
    groupId = req.body.groupId
    var text = req.body.text

    var time = new Date().getTime()

    const message = new Message({ text : text, user : logedInUser.username, group: groupId, created_at : time, is_share : false })
	await message.save()

    res.redirect(`/chat?id=${groupId}`)
})

app.post("/shareEvent", async function(req, res)
{
    groupId = req.body.groupId
    var eventId = req.body.eventId

    var event = await Event.find({ _id : eventId })

    var time = new Date().getTime()

    const message = new Message({ text : JSON.stringify(event), user : logedInUser.username, group: groupId, created_at : time, is_share : true })
	await message.save()

    res.redirect(`/chat?id=${groupId}`)
})

app.get("/groupInfo", async function(req, res)
{
    groupId = req.query.id

    var group = await Group.findOne({ _id : groupId })

    if(group.users.length === 2)
    {
        if(group.users[0] === logedInUser.username)
        {
            var name = group.users[1] 
        }else{
            var name = group.users[0] 
        }
    }else{
        var name = group.name
    }

    renderGroupInfo(res, group, name)
})

app.post("/updateGroup", async function(req, res)
{
    var groupname = req.body.groupname
    var addedFriends = JSON.parse(req.body.addedFriends)
    var removedUsers = JSON.parse(req.body.removedUsers)
    var newAdmin = req.body.newAdmin

    if(addedFriends !== "")
    {
        for(var i = 0; i < addedFriends.length; i++)
        {
            await Group.updateOne({ _id : groupId }, { $push: {users : addedFriends[i] }})
        }
    }

    if(removedUsers !== "")
    {
        for(var i = 0; i < removedUsers.length; i++)
        {
            await Group.updateOne({ _id : groupId }, { $pull: {users : removedUsers[i] }})
        }
    }

    if(newAdmin !== "")
    {
        var group = await Group.findOne({ _id : groupId })

        if(newAdmin !== group.created_by)
        {
            await Group.updateOne({ _id : groupId }, { created_by : newAdmin })
        }
    }

    if(groupname !== "")
    {
        var group = await Group.findOne({ _id : groupId })

        if(groupname !== group.name)
        {
            await Group.updateOne({ _id : groupId }, { name : groupname })
        }
    }

    res.redirect(`/groupInfo?id=${groupId}`)
})

app.get("/editGroup", async function(req, res)
{
    groupId = req.query.id

    var group = await Group.findOne({ _id : groupId })

    renderEditGroup(res, group, logedInUser.friends)
})

app.post("/followInGroup", async function(req, res) {
    const follow = new Follow({ toUser : req.body.username, fromUser : logedInUser.username, confirmed : false })
    await follow.save()

    res.redirect(`/groupInfo?id=${groupId}`)
})

app.post("/unfollowInGroup", async function(req, res) {
    await User.updateOne({ username : req.body.username }, { $pull: {friends : logedInUser.username }})
    await User.updateOne({ username : logedInUser.username }, { $pull: {friends : req.body.username }})

    var user = await User.findOne({ username : logedInUser.username })
    saveLogedInUser(user.firstname, user.lastname, user.username, user.email, user.password, user.friends, user.participations, user.is_creator)

    res.redirect(`/groupInfo?id=${groupId}`)
})

app.post("/undoRequestInGroup", async function(req, res) {
    await Follow.deleteOne({ fromUser : logedInUser.username, toUser : req.body.username })

    res.redirect(`/groupInfo?id=${groupId}`)
})

app.get("/friendlist", async function(req, res)
{
    var username = req.query.username

    res.render("friendlist",{
        user : JSON.stringify(logedInUser)
    })
})

app.get("/friendRequests", async function(req, res)
{
    var username = req.query.username

    var requests = await Follow.find({ toUser : username })

    renderFriendRequests(res, JSON.stringify(requests))
})

app.post("/acceptFollow", async function(req, res)
{
    var id = req.body.id

    var follow = await Follow.findOne({ _id : id })
    var fromUser = follow.fromUser

    await User.updateOne({ username : fromUser }, { $push: { friends: logedInUser.username } })
    await User.updateOne({ username : logedInUser.username }, { $push: { friends: fromUser } })

    await Follow.deleteOne({ _id : id })
    
    res.redirect(`/friendRequests?username=${logedInUser.username}`)
})

app.post("/deleteFollow", async function(req, res)
{
    var id = req.body.id

    await Follow.deleteOne({ _id : id })
    
    res.redirect(`/friendRequests?username=${logedInUser.username}`)
})

app.get("/account", async function(req, res){
    if(logedInUser.firstname !== "")
    {
        renderAccount(res, "", JSON.stringify(logedInUser))
    }else{
        renderAccount(res, "", "")
    }

    app.post("/logOut", async function(req, res)
    {
        resetLogedInUser()
        res.render("index", {
            error : ""
        })
    })

    app.post("/editProfile", async function(req, res)
    {
        var firstname = req.body.firstname
        var lastname = req.body.lastname
        var username = req.body.username
        var email = req.body.email
        var password = req.body.password

        var check = true

        if(logedInUser.username !== username && logedInUser.email !== email)
        {
            check = await checkUsernameAndEmail(username, email)
        }

        if(check)
        {
            var user = await getUserByUsername(logedInUser.username)

            await User.updateOne({ _id : user[0]._id }, { $set: {
                firstname : firstname,
                lastname : lastname,
                username : username,
                email : email,
                password : password
            }})

            saveLogedInUser(firstname, lastname, username, email, password, logedInUser.friends, logedInUser.participations, user.is_creator)
            renderAccount(res, "", JSON.stringify(logedInUser))

            console.log("Updated succesfully")
        }else
        {
            console.log("E-Mail or Username already used")
            renderAccount(res, 2, JSON.stringify(logedInUser))
        }
    })

    app.post("/deleteAccount", async function(req, res)
    {
        var username = req.body.username

        await User.deleteOne({ username : username})

        renderAccount(res, "", "")
        resetLogedInUser()

        console.log("Deleted succesfully")
    })
});

function renderHome(res, p_events, p_user, p_users, p_posts, p_groups, p_friendsPosts)
{
    res.render("home",{
        events : p_events,
        user : p_user,
        users : p_users,
        posts : p_posts,
        groups : p_groups,
        friendsPosts : p_friendsPosts
    })
}

function renderAccount(res, p_error, p_user)
{
    res.render("account",{
        error : p_error,
        user : p_user
    })
}

function renderComment(res, p_comment, p_replies, p_profile, p_user, p_eventId)
{
    res.render("comment",{
        user : p_user,
        profile : p_profile,
        eventId : p_eventId,
        replies : p_replies,
        comment : p_comment
    })
}

function renderChat(res, p_user, p_name, p_id, p_messages)
{
    res.render("chat",{
        user : p_user,
        name : p_name,
        id : p_id,
        messages : p_messages
    })
}

async function renderSearch(res, p_events, p_user, p_filter, p_filterDays, p_eventTitle)
{
    await Post.find({ username : logedInUser.username }).then((data) => {
        posts = data
    })

    var groups = await Group.find({ users : logedInUser.username })

    res.render("search",{
        events : p_events,
        user : p_user,
        filter : p_filter,
        filterDays : p_filterDays,
        eventTitle : p_eventTitle,
        posts : JSON.stringify(posts),
        groups : JSON.stringify(groups)
    })
}

async function renderCalendar(res, p_groups)
{
    var posts = await Post.find({ username : logedInUser.username })

    res.render("calendar",{
        events : JSON.stringify(events),
        user : JSON.stringify(logedInUser),
        month : month,
        year : year,
        groups : p_groups,
        posts : JSON.stringify(posts)
    })
}

function renderEventView(res, p_posted, p_participations, p_groups, p_replyArray)
{
    res.render("eventView",{
        event : JSON.stringify(events),
        user : JSON.stringify(logedInUser),
        comments : JSON.stringify(comments),
        posted : p_posted,
        participations : JSON.stringify(p_participations),
        groups : JSON.stringify(p_groups),
        replyArray : JSON.stringify(p_replyArray)
    })
}

function renderParticipations(res, p_participations)
{
    res.render("participations",{
        participations : JSON.stringify(p_participations)
    })
}

function renderGroups(res, p_groups)
{
    res.render("groups",{
        user : JSON.stringify(logedInUser),
        groups : JSON.stringify(p_groups)
    })
}

async function renderGroupInfo(res, p_group, p_groupname)
{
    var user = await User.findOne({ username : logedInUser.username })

    var requests = await Follow.find({ fromUser : user.username, confirmed : false })

    res.render("groupInfo",{
        user : JSON.stringify(user),
        group : JSON.stringify(p_group),
        groupname : p_groupname,
        requests : JSON.stringify(requests)
    })
}

function renderEditGroup(res, p_group, p_friends)
{
    res.render("editGroup",{
        user : JSON.stringify(logedInUser),
        group : JSON.stringify(p_group),
        friends : JSON.stringify(p_friends)
    })
}

function renderProfile(res, p_profile, p_followed, p_postsProfile, p_posts)
{
    res.render("profile",{
        user : JSON.stringify(logedInUser),
        profile : JSON.stringify(p_profile),
        followed : p_followed,
        postsProfile : JSON.stringify(p_postsProfile),
        posts : JSON.stringify(p_posts)
    })
}

function renderFriendRequests(res, p_requests)
{
    res.render("friendRequests",{
        user : JSON.stringify(logedInUser),
        requests : p_requests
    })
}

async function createUser(p_firstname, p_lastname, p_username, p_email, p_password)
{
    var year = new Date().getFullYear()

	const user = new User({ firstname : p_firstname, lastname : p_lastname, username: p_username, email : p_email, password : p_password, year : year, participations : 0, is_creator : false })
	await user.save()
	console.log(user)
}

async function getUserByUsername(p_username)
{
	const user = await User.find({ username : p_username })
	return user
}

async function checkUsernameAndEmail(p_username, p_email)
{
	const countUsername = await User.countDocuments({ username : p_username})
    const countEmail = await User.countDocuments({ email : p_email})

    var count = countEmail + countUsername

    if(count > 0)
    {
        return false
    }else
    {
        return true
    }
}

async function checkIfPasswordMatches(p_username, p_password)
{
    const user = await User.find({ username : p_username})

    if(user.length > 0){
        const password = user[0].password

        if(p_password === password){
            return true
        }else{
            return false
        }
    }
}

async function createEvent(p_title, p_description, p_date, p_time, p_category, p_tickets, p_lowestPrice, p_organizer, p_minimum_age, p_links, p_location, p_street)
{
    const events = new Event({ title : p_title, description : p_description, date : p_date, time : p_time, category : p_category, tickets : p_tickets, lowestPrice : p_lowestPrice, organizer : p_organizer,
                                minimum_age : p_minimum_age, links : p_links, location : p_location, street : p_street})
	await events.save()
}

async function createComment(p_text, p_event)
{
    const currentDate = new Date()

    const comment = new Comment({ text : p_text, event : p_event, username : logedInUser.username, created_at : currentDate, replies : []})
    await comment.save()
}

function saveLogedInUser(p_firstname, p_lastname, p_username, p_email, p_password, p_friends, p_participations, p_is_creator)
{
    logedInUser.firstname = p_firstname
    logedInUser.lastname = p_lastname
    logedInUser.username = p_username
    logedInUser.email = p_email
    logedInUser.password = p_password
    logedInUser.friends = p_friends
    logedInUser.year = new Date().getFullYear()
    logedInUser.participations = p_participations
    logedInUser.is_creator = p_is_creator
}

function resetLogedInUser()
{
    logedInUser.firstname = ""
    logedInUser.lastname = ""
    logedInUser.username = ""
    logedInUser.email = ""
    logedInUser.password = ""
    logedInUser.friends = ""
    logedInUser.year = 0
    logedInUser.participations = 0
}

function checkIfUsernameIsFriend(p_username)
{
    for(var i = 0; i < logedInUser.friends.length; i++)
    {
        if(logedInUser.friends[i] === p_username)
        {
            return true
        }
    }

    return false
}