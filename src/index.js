import './sass/index.scss';
import './js/fixedSearchContainer';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import PhotoApiService from './js/photoApiService';
import galleryMurkup from './templates/gallery-card.hbs';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const photoApiService = new PhotoApiService();
const refs = {
  searchForm: document.querySelector('#search-form'),
  galleryBox: document.querySelector('.gallery'),
  loadImg: document.querySelector('.jsimg'),
  backTopBtn: document.querySelector('#back-top'),
};
let lightbox = new SimpleLightbox('.gallery a');

refs.backTopBtn.addEventListener('click', scrollToTop);
refs.searchForm.addEventListener('submit', searchPhoto);
window.addEventListener('scroll', loadMoreByScroll);
refs.loadImg.classList.add('hidden');

async function searchPhoto(e) {
  murkupReset();
  photoApiService.resetPage();
  e.preventDefault();
  photoApiService.query = e.target.elements.searchQuery.value.trim();
  if (photoApiService.query === '') {
    Notify.failure('Please enter a search word!');
    return;
  }
  try {
    refs.loadImg.classList.remove('hidden');
    const response = await photoApiService.fetchPhoto();
    const totalHits = await response.data.totalHits;
    const hits = await response.data.hits;
    refs.loadImg.classList.add('hidden');
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
    refs.loadImg.classList.remove('hidden');
    const response = await photoApiService.fetchPhoto();
    const hits = await response.data.hits;
    const totalHits = await response.data.totalHits;
    renderGalleryCard(hits);
    refs.loadImg.classList.add('hidden');
    if (refs.galleryBox.children.length === totalHits) {
      Notify.info(
        "We're sorry, but you've reached the end of search results.",
        { showOnlyTheLastOne: true }
      );
      document.removeEventListener('scroll', loadMoreByScroll);
    }
  }
}

function renderGalleryCard(hits) {
  const photo = hits.map(photo => galleryMurkup(photo)).join('');
  refs.galleryBox.insertAdjacentHTML('beforeend', photo);
}

function murkupReset() {
  refs.galleryBox.innerHTML = '';
}

window.onscroll = function () {
  visabilityButtonSwitcher();
};

function visabilityButtonSwitcher() {
  if (
    document.body.scrollTop > 400 ||
    document.documentElement.scrollTop > 400
  ) {
    refs.backTopBtn.style.display = 'block';
  } else {
    refs.backTopBtn.style.display = 'none';
  }
}

function scrollToTop() {
  let scrollHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
    document.body.offsetHeight,
    document.documentElement.offsetHeight,
    document.body.clientHeight,
    document.documentElement.clientHeight
  );
  window.scrollBy({
    top: -scrollHeight,
    behavior: 'smooth',
  });
}
