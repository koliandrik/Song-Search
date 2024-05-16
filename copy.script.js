document.addEventListener('DOMContentLoaded', function() {
  const searchBtn = document.getElementById('searchBtn');
  const inputArtist = document.getElementById('input-artist');
  const albumsList = document.getElementById('albums');

  searchBtn.addEventListener('click', async function() {
      const artistName = inputArtist.value.trim();
      if (artistName === '') {
          return;
      }
      try {
          const url = `https://spotify23.p.rapidapi.com/search/?q=${artistName}&type=artist&limit=1`;
          const options = {
              method: 'GET',
              headers: {
                  'X-RapidAPI-Key': 'f25d7fe6a9msh9961a093da9e0abp1605dajsn33447a900e4c',
                  'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
              }
          };
          const response = await fetch(url, options);
          const data = await response.json();
          console.log('Artist data:', data);
          if (data.artists && data.artists.items && data.artists.items.length > 0) {
              const artistId = data.artists.items[0].id;
              const tracksUrl = `https://spotify23.p.rapidapi.com/artist_top_tracks/?id=${artistId}`;
              const tracksResponse = await fetch(tracksUrl, options);
              const tracksData = await tracksResponse.json();
              console.log('Tracks data:', tracksData);
              displayTracks(tracksData);
          } else {
              console.error('Artist not found');
          }
      } catch (error) {
          console.error(error);
      }
  });

  function displayTracks(data) {
      albumsList.innerHTML = '';
      const tracks = data.tracks;
      if (tracks && tracks.length > 0) {
          tracks.forEach(track => {
              const li = document.createElement('li');
              li.className = 'collection-item';
              li.textContent = track.name;
              albumsList.appendChild(li);
          });
      } else {
          const li = document.createElement('li');
          li.className = 'collection-item';
          li.textContent = 'No tracks found for this artist';
          albumsList.appendChild(li);
      }
  }
});

