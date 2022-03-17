const loaderContainer = document.querySelector('.loader-container')
const imageContainer = document.querySelector('.image-container')
const errorNotify = document.querySelector('.notify.error')
const errorMessage = document.querySelector('#error-message')

const unsplashApi = {
    accessKey: 'EVeP4vPzrylMBb_Go_ZtIf9EUqXhAJ2ueYzntbrzySA',
    count: 5,
    get url() {
        return `https://api.unsplash.com/photos/random/?client_id=${this.accessKey}&count=${this.count}`
    }
}

let ready = false
const data = {
    photos: [],
    images: {
        loaded: 0,
        total: 0
    }
}

const toggleLoader = () => {
    loaderContainer.classList.toggle('hidden')
}

const imageLoaded = () => {
    data.images.loaded++

    if (data.images.loaded === data.images.total) ready = true
}

const displayPhotos = () => {
    data.images.loaded = 0
    data.images.total = data.photos.length

    data.photos.forEach(photo => {
        const a = document.createElement('a')
        a.href = photo.links.html
        a.target = '_blank'

        const img = document.createElement('img')
        img.src = photo.urls.regular
        img.alt = photo.alt_description
        img.title = photo.alt_description
        img.addEventListener('load', imageLoaded)

        a.appendChild(img)
        imageContainer.appendChild(a)
    })
}

const getPhotos = async () => {
    errorNotify.classList.add('hidden')
    try {
        const resp = await fetch(unsplashApi.url)

        if (!resp.ok) throw resp

        data.photos = await resp.json()

        displayPhotos()
    } catch (error) {
        errorNotify.classList.remove('hidden')
        errorMessage.textContent = error.status ? `Error ${error.status}: ${error.statusText}` : 'Something went wrong, please try again later.'
    }

}

toggleLoader()
getPhotos().then().finally(() => {
    toggleLoader()
    unsplashApi.count = 15
})

window.addEventListener('scroll', event => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false
        getPhotos()
    }
})