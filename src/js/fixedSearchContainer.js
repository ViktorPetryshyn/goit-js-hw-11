const { height: searchContainer } = document
  .querySelector('.section')
  .getBoundingClientRect();
document.body.style.paddingTop = `${searchContainer + 10}px`;
