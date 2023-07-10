const express = require("express")
const bodyParser =  require("body-parser")
const mongoose = require("mongoose")
const User = require("./models/User.js")
const Event = require("./models/Event.js")
const app = express()
const ejs = require("ejs")

//connect to the server

const port = 3000

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
    password : ""
}

var events = []

connect()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.set("view engine", "ejs")
app.use(express.static(__dirname + '/'))

app.listen(port, async function()
{   
    //createEvent("Project Germany Open Air Festival", "Deutschlands spektakulärste Open Air Festival Shows kommen auf ihrer Deutschlandtour in die Region BODENSEE/FRIEDRICHSHAFEN!", "2023-06-23", "19:30", false, "", "", 18, "", "Bermatingen", "In der Breite 1")

    console.log("Server startet on port " + port)

    Event.find().then((data) => {
        events = data
    })
})

app.get("/", function(req, res){
    if(logedInUser.firstname !== "")
    {
        renderIndex(res, JSON.stringify(events), JSON.stringify(logedInUser))
    }else{
        renderIndex(res, JSON.stringify(events), "")
    }
})

app.get("/signIn", function(req, res)
{
    res.render("signIn")
})

app.get("/groups", function(req, res)
{
    if(logedInUser.firstname !== "")
    {
        renderGroups(res, JSON.stringify(logedInUser))
    }else{
        renderGroups(res, "")
    }
})

app.get('/account', (req, res) => {
    if(logedInUser.firstname !== "")
    {
        renderAccount(res, "", JSON.stringify(logedInUser))
    }else{
        renderAccount(res, "", "")
    }

    app.post("/", async function(req, res)
    {
        var username = req.body.username
        var password = req.body.password

        var check = await checkIfPasswordMatches(username, password)

        if(check)
        {
            console.log("Login succesfully")

            var user = await getUserByUsername(username)

            saveLogedInUser(user[0].firstname, user[0].lastname, user[0].username, user[0].email, user[0].password, user[0].isCreator)

            renderAccount(res, "", JSON.stringify(logedInUser))
        }else
        {
            console.log("E-Mail or Username are false")
            renderAccount(res, 1, "")
        }
    })

    app.post("/signIn", async function(req, res)
    {
        var firstname = req.body.firstname
        var lastname = req.body.lastname
        var username = req.body.username
        var email = req.body.email
        var password = req.body.password

        var check = await checkUsernameAndEmail(username, email)

        if(check)
        {
            createUser(firstname, lastname, username, email, password)

            res.render("signIn")

            saveLogedInUser(firstname, lastname, username, email, password, false)
        }else
        {
            console.log("E-Mail or Username already used")
            renderAccount(res, 0, "")
        }
    })

    app.post("/logOut", async function(req, res)
    {
        resetLogedInUser()
        renderAccount(res, "", "")
    })
});

function renderIndex(res, p_events, p_user)
{
    res.render("index",{
        events : p_events,
        user : p_user
    })
}

function renderAccount(res, p_error, p_user)
{
    res.render("account",{
        error : p_error,
        user : p_user
    })
}

function renderGroups(res, p_user)
{
    res.render("groups",{
        user : p_user
    })
}

async function createUser(p_firstname, p_lastname, p_username, p_email, p_password)
{
	const user = new User({ firstname : p_firstname, lastname : p_lastname, username: p_username, email : p_email, password : p_password, isCreator : false})
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

async function createEvent(p_title, p_description, p_date, p_time, p_category, p_tickets, p_organizer, p_minimum_age, p_links, p_location, p_street)
{
    const events = new Event({ title : p_title, description : p_description, date : p_date, time : p_time, category : p_category, tickets : p_tickets, organizer : p_organizer,
                                minimum_age : p_minimum_age, links : p_links, likes : 0, shares : 0, location : p_location, street : p_street})
	await events.save()
}

function saveLogedInUser(p_firstname, p_lastname, p_username, p_email, p_password, p_isCreator)
{
    logedInUser.firstname = p_firstname
    logedInUser.lastname = p_lastname
    logedInUser.username = p_username
    logedInUser.email = p_email
    logedInUser.password = p_password
    logedInUser.isCreator = p_isCreator
}

function resetLogedInUser()
{
    logedInUser.firstname = ""
    logedInUser.lastname = ""
    logedInUser.username = ""
    logedInUser.email = ""
    logedInUser.password = ""
    logedInUser.isCreator = false
}