function anim1(){
    element = document.getElementById('checkout');
    element.classList.add('anim1');
    
}

let items = document.getElementsByClassName('clickage');
for (let i = 0; i < items.length; i++) {
  items[i].addEventListener('click', anim1);
}
