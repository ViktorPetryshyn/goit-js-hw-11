import './sass/index.scss';
import './js/fixedSearchContainer';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PhotoApiService from './js/photoApiService';
import galleryMurkup from './templates/gallery-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
const photoApiService = new PhotoApiService();

let lightbox = new SimpleLightbox('.gallery a');

const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryBox: document.querySelector('.gallery'),
  loadImg: document.querySelector('.jsimg'),
  backTopBtn: document.querySelector('#back-top')
};
console.log(refs.backTopBtn);
refs.searchForm.addEventListener('submit', searchPhoto);
window.addEventListener('scroll', loadMoreByScroll);

async function searchPhoto(e) {
  murkupReset();
  photoApiService.resetPage();
  e.preventDefault();
  photoApiService.query = e.target.elements.searchQuery.value.trim();
  if (photoApiService.query === '') {
    Notify.failure('Please enter a search word!');
    murkupReset();
    return;
  }
  try {
    const response = await photoApiService.fetchPhoto();
    const totalHits = await response.data.totalHits;
    const hits = await response.data.hits;
    if (hits.length === 0) {
      murkupReset();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    Notify.success(`Hooray! We found ${totalHits} images.`);
    renderGalleryCard(hits);
  } catch (error) {
    Notify.failure(error.name);
    console.log(error);
  }
}

async function loadMoreByScroll() {
  const documentRect = document.documentElement.getBoundingClientRect();
  if (documentRect.bottom < document.documentElement.clientHeight + 200) {
    const response = await photoApiService.fetchPhoto();
    const totalHits = await response.data.totalHits;
    const hits = await response.data.hits;
    renderGalleryCard(hits);
    refs.loadImg.classList.toggle('hidden', !(totalHits > 40));
  }
}

function renderGalleryCard(hits) {
  const photo = hits.map(photo => galleryMurkup(photo)).join('');
  refs.galleryBox.insertAdjacentHTML('beforeend', photo);
}

function murkupReset() {
  refs.galleryBox.innerHTML = '';
}

refs.backTopBtn.addEventListener('click', topFunction)
// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    refs.backTopBtn.style.display = "block";
  } else {
    refs.backTopBtn.style.display = "none";
  }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
}