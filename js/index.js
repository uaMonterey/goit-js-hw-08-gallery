//TODO
/* Разбей задание на несколько подзадач:

* Создание и рендер разметки по массиву данных и предоставленному шаблону.
* Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
* Открытие модального окна по клику на элементе галереи.
* Подмена значения атрибута src элемента img.lightbox__image.
* Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
* Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того, чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.

!Дополнительно
Следующий функционал не обязателен при сдаче задания, но будет хорошей практикой по работе с событиями.
* Закрытие модального окна по клику на div.lightbox__overlay.
* Закрытие модального окна по нажатию клавиши ESC.
* Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо". */

import gallery from './gallery-items.js'

//getting references to DOM objects
const ref = {
  body: document.querySelector('body'),
  galleryList: document.querySelector('.js-gallery'),
  modalWindow: document.querySelector('.js-lightbox'),
  modalImg: document.querySelector('.lightbox__image'),
  overlay: document.querySelector('.lightbox__overlay'),
  btnCloseModal: document.querySelector('.lightbox__button'),
}

const imgArr = gallery.map(({ original }) => original)

let currentImg = 0

//rendering the markup
const rowMarkup = gallery.reduce(
  (acc, { preview, original, description }) =>
    acc +
    `<li class="gallery__item">
  <a
    class="gallery__link"
    href="${original}"
  >
    <img
      loading="lazy"
      class="gallery__image"
      data-src="${preview}"
      data-source="${original}"
      alt="${description}"
    />
  </a>
</li>`,
  ''
)

ref.galleryList.insertAdjacentHTML('beforeend', rowMarkup)

const handlerOnGallery = (e) => {
  e.preventDefault()
  ref.modalWindow.classList.add('is-open')
  ref.modalImg.src = e.target.dataset.source
  ref.modalImg.alt = e.target.alt
  ref.body.style.overflow = 'hidden'

  currentImg = imgArr.indexOf(ref.modalImg.src)
}

const classListRemover = (e) => {
  remove()
}

// close the modal window by pressing the key
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    remove()
  }

  //switching images by pressing a key
  if (e.key === 'ArrowRight') {
    currentImg === imgArr.length - 1 ? (currentImg = 0) : (currentImg += 1)
    ref.modalImg.src = imgArr[currentImg]
  }
  if (e.key === 'ArrowLeft') {
    currentImg === 0 ? (currentImg = imgArr.length - 1) : (currentImg -= 1)
    ref.modalImg.src = imgArr[currentImg]
  }
})

ref.galleryList.addEventListener('click', handlerOnGallery)
ref.btnCloseModal.addEventListener('click', classListRemover)
ref.overlay.addEventListener('click', classListRemover)

function remove() {
  ref.modalWindow.classList.remove('is-open')
  ref.modalImg.src = ''
  ref.modalImg.alt = ''
  ref.body.style.overflow = ''
}

//! for lazyLoading

// check whether browsers support lazy loading
if ('loading' in HTMLImageElement.prototype) {
  console.log('The browser supports lazy load')
  addSrcAttrToLazyImages()
} else {
  console.log('The browser DOES NOT support lazyload')
  addLazySizesScript()
}

const lazyImages = document.querySelectorAll('img[data-src]')

lazyImages.forEach((image) => {
  image.addEventListener('load', onImageLoaded, { once: true })
})

// Shows how many images were uploaded
function onImageLoaded(evt) {
  console.log('The image loaded')
  evt.target.classList.add('appear')
}

// add script with function
function addLazySizesScript() {
  const script = document.createElement('script')

  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.0/lazysizes.min.js'
  script.integrity = 'sha512-TmDwFLhg3UA4ZG0Eb4MIyT1O1Mb+Oww5kFG0uHqXsdbyZz9DcvYQhKpGgNkamAI6h2lGGZq2X8ftOJvF/XjTUg=='
  script.crossOrigin = 'anonymous'

  document.body.appendChild(script)
}

// add src attribute to lazy images
function addSrcAttrToLazyImages() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]')

  lazyImages.forEach((img) => {
    img.src = img.dataset.src
  })
}
