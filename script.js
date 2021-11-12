const imageContainer = document.querySelector('#image-container');
const loader = document.querySelector('#loader')

const accessKey = '5gMjEDMdse616_ubT6kN46EiaIW0qybwusNa21NEx2s';

let imagesCount = 5;
let totalPhotos = 0;
let photosLoaded = 0;
let ready = false;
let maxRetryAttempts = 5;

/* FETCH PHOTOS USING GET REQUEST  */
async function fetchPhotos() {
    try {
        const apiUrl = `https://api.unsplash.com/photos/random?client_id=${accessKey}&count=${imagesCount}`;
        const response = await fetch(apiUrl);
        const photos = response ? await response.json() : [];
        totalPhotos = photos.length;
        photosLoaded = 0;
        displayPhotos(photos)
        loader.hidden = true;
    } catch (error) {
        maxRetryAttempts--;
        maxRetryAttempts >= 0 ? fetchPhotos() : alert(error)
    }
}


function displayPhotos(photos) {
    if (photos && photos.length > 0) {
        photos.forEach(photo => {
            //CREATE AN ANCHOR ELEMENT
            const item = document.createElement('a');
            setAttributes(item, { href: photo.links.html || '', target: '_blank' })

            //CREATE AN IMAGE ELEMENT
            const image = document.createElement('img');
            setAttributes(image, {
                src: photo.urls.regular,
                alt: photo.alt_description || '',
                title: photo.alt_description || ''
            })
            image.addEventListener('load', isPhotoLoaded)
            item.appendChild(image)  //PUT IMAGE INSIDE ANCHOR TAG
            imageContainer.appendChild(item) // PUT ANCHOR TAG INSIDE IMAGE CONTAINER

        })
    }
}

/*COMMON FUNCTION TO SET DOM ATTRIBUTES FOR AN ELEMENT */
function setAttributes(element, attributes) {
    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value)
    }
}

function isPhotoLoaded() {
    photosLoaded++
    if (photosLoaded === totalPhotos) {
        ready = true;
        imagesCount = 30;
    }
}

window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= (document.body.offsetHeight - 1000) && ready) {
        ready = false;
        loader.hidden = false
        fetchPhotos();
    }
})

fetchPhotos()