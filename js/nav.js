document.addEventListener('DOMContentLoaded', function () {
  var btn = document.getElementById('navbtn');
  var menu = document.getElementById('navmenu');
  if (!btn || !menu) return;
  btn.addEventListener('click', function () {
    var open = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
});
