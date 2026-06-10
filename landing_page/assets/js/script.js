var obs = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      obs.unobserve(entry.target);
    }
  });
}, {threshold:0.1});
document.querySelectorAll('.reveal').forEach(function(el) {
  obs.observe(el);
});

var previewTrack = document.querySelector('.preview-phones');
var previewPhones = previewTrack ? Array.prototype.slice.call(previewTrack.querySelectorAll('.preview-phone')) : [];
var previewActiveTitle = document.querySelector('.preview-active-title');
var previewScrollFrame;

function getPreviewCenterIndex() {
  if (!previewTrack || !previewPhones.length) return 0;
  var trackCenter = previewTrack.scrollLeft + previewTrack.clientWidth / 2;

  return previewPhones.reduce(function(closestIndex, phone, index) {
    var closestCenter = previewPhones[closestIndex].offsetLeft + previewPhones[closestIndex].offsetWidth / 2;
    var phoneCenter = phone.offsetLeft + phone.offsetWidth / 2;
    var closestDistance = Math.abs(closestCenter - trackCenter);
    var phoneDistance = Math.abs(phoneCenter - trackCenter);
    return phoneDistance < closestDistance ? index : closestIndex;
  }, 0);
}

function setPreviewActive(index) {
  previewPhones.forEach(function(phone, phoneIndex) {
    phone.classList.toggle('is-active', phoneIndex === index);
  });
  if (previewActiveTitle && previewPhones[index]) {
    var label = previewPhones[index].querySelector('.preview-phone-label');
    previewActiveTitle.textContent = label ? label.textContent : 'Preview Aplikasi';
  }
}

function centerPreviewPhone(index, behavior) {
  if (!previewTrack || !previewPhones[index]) return;
  setPreviewActive(index);

  requestAnimationFrame(function() {
    var phone = previewPhones[index];
    var nextLeft = phone.offsetLeft - (previewTrack.clientWidth - phone.offsetWidth) / 2;
    previewTrack.scrollTo({left: nextLeft, behavior: behavior || 'smooth'});
  });
}

if (previewTrack && previewPhones.length) {
  setPreviewActive(getPreviewCenterIndex());
  previewTrack.addEventListener('scroll', function() {
    window.cancelAnimationFrame(previewScrollFrame);
    previewScrollFrame = window.requestAnimationFrame(function() {
      setPreviewActive(getPreviewCenterIndex());
    });
  });
}

document.querySelectorAll('[data-preview-scroll]').forEach(function(button) {
  button.addEventListener('click', function() {
    if (!previewTrack) return;
    var direction = Number(button.getAttribute('data-preview-scroll')) || 1;
    var currentIndex = getPreviewCenterIndex();
    var nextIndex = Math.max(0, Math.min(previewPhones.length - 1, currentIndex + direction));

    centerPreviewPhone(nextIndex, 'smooth');
  });
});
