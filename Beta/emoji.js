fetch("https://emoji-api.com/emojis?access_key=f9acf6863f756cb50f1bbaf8e9f5679a068be895")
    .then(res => res.json())
    .then(data => loadEmojis(data))

function loadEmojis(p_data)
{
    console.log(p_data)

    p_data.forEach(emoji => {
        createEmoji(emoji)
    })
}

function createEmoji(p_emoji)
{
    var div = document.createElement("div")
    div.textContent = p_emoji.character
    div.className = "noselect"
    div.setAttribute("name", p_emoji.slug)

    document.getElementById("emojiList").append(div)

    div.onclick = function()
    {
        document.getElementById("messageTextInput").value = document.getElementById("messageTextInput").value + div.innerHTML
    }
}

function openEmojiDiv()
{
    if(document.getElementById("emojiPicker").style.display === "none")
    {
        document.getElementById("emojiPicker").style.display = ""
    }else{
        document.getElementById("emojiPicker").style.display = "none"
    }
}

function searchEmoji(p_value)
{
    var emojis = document.querySelectorAll("#emojiList div")
    console.log(emojis)
    emojis.forEach(emoji => {
        if(emoji.getAttribute("name").toLowerCase().includes(p_value))
        {
            emoji.style.display = ""
        }else{
            emoji.style.display = "none"
        }
    })
}