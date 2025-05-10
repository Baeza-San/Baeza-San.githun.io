function openEnvelope() {
    const envelope = document.querySelector('.envelope');
    envelope.classList.add('opened');
  
    const petals = document.querySelector('.petals');
    const photos = document.querySelector('.photos');
    const audio = document.getElementById('bg-music');
  
    setTimeout(() => {
      petals.classList.remove('hidden');
      photos.classList.remove('hidden');
      audio.play();
    }, 1500);
  }
  