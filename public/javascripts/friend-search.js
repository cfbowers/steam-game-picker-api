const userInput = document.querySelector('input')
const messageOne = document.querySelector('#message-1')
const searchForm = document.querySelector('form')

searchForm.addEventListener('submit', (event) => {
    event.preventDefault()

    fetch(`/api/friend-search?userName=${userInput.value}`).then(response)
})

