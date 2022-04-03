const form = document.forms[0]
const table = document.querySelector('tbody')
const defaultURL = 'http://167.172.42.239:1337/api/movies'
const pagers = document.querySelector('.pagers')

// Post Data function

const sendData = async items => {
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: items })
    })

    const data = await res.json()
    console.log(data)
  } catch (err) {
    console.log(err)
  }
}

// Submit data via form

form.addEventListener('submit', e => {
  e.preventDefault()

  const title = e.target.elements.title.value.trim()
  const year = e.target.elements.year.value.trim()
  const rating = e.target.elements.rating.value.trim()

  sendData({ title, year, IMDbRating: rating })
})

// Get movies from the server

const getMovies = async url => {
  try {
    const res = await fetch(url)
    const data = await res.json()

    // console.log(data)
    createPagination(data.meta.pagination.pageCount)
    displayMovies(data.data)
  } catch (error) {
    console.log(error)
  }
}

getMovies(defaultURL)

// Display movies on the table

const displayMovies = data => {
  data.forEach(movie => {
    const tr = table.insertRow()

    const td1 = tr.insertCell()
    td1.textContent = movie.attributes.title

    const td2 = tr.insertCell()
    td2.textContent = movie.attributes.year

    const td3 = tr.insertCell()
    td3.textContent = movie.attributes.IMDbRating
  })
}

// Pagnition
const createPagination = data => {
  for (let i = 0; i < data; i++) {
    const btn = document.createElement('button')
    btn.className = 'pager'

    btn.textContent = i + 1

    pagers.append(btn)
  }

  const allPages = document.querySelectorAll('.pager')

  allPages.forEach(btn => {
    table.innerHTML = ''
    btn.addEventListener('click', e => {
      const buttonNumber = e.target.textContent

      pagers.innerHTML = ''
      return getMovies(`${defaultURL}?pagination[page]=${buttonNumber}`)
    })
  })
}

const search = document.getElementById('search')

search.addEventListener('keyup', e => {
  let searchQuery = e.target.value
  return getMovies(
    `http://167.172.42.239:1337/api/movies?&filters[title][$containsi]=${searchQuery}`
  )
})
