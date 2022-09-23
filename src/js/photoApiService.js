import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '30035722-97951b8b1f6051b6354733e34';

export default class PhotoApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 0;
    this.perPage = 40;
  }
  async fetchPhoto() {
    this.page += 1;
    return await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=${this.perPage}`
    );
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }

  resetPage() {
    this.page = 0;
  }
}
