const userFormEl = document.querySelector('#user-form');
const nameInputEl = document.querySelector('#input-artist');

const albumListEl = document.querySelector('#album-list');
const songListEl = document.querySelector('#song-list');
const lyricsDisplay = document.querySelector('#lyrics-display');

/*********************************************************************************************************
 * formSubmitHandler
 * 
 * Description:
 * 
 * This is the submit event handler that gets invoked when the artist name is entered and submit
 * button is pressed.
 * 
 * It calls the main function getArtistInfo() to search and retrieve artist's portfolio
 * 
 * ********************************************************************************************************
*/
const formSubmitHandler = function (event) {
  event.preventDefault();

  albumListEl.innerHTML = ``;
  songListEl.innerHTML = ``;
  lyricsDisplay.innerHTML = ``;

  const artistName = nameInputEl.value.trim();

  if (artistName) {
    getArtistId(artistName);
    nameInputEl.value = '';
  } else {
    alert('Please enter the artist name');
  }
};

async function getArtistId(artistName) {

  // Create a Rapidapi searchable endpoint using the artist name
  const url = `https://spotify23.p.rapidapi.com/search/?q=${artistName}&type=artists&offset=0&limit=10&numberOfTopResults=5`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'c2062f4901mshf330d409dbb6836p1769c5jsna4924e5a2cd1',
      'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    const artistId = result.artists.items[0].data.uri.split(':')[2]
    console.log(artistId);
    getArtistInfo(artistId);
  } catch (error) {
    console.error(error);
  };
}


async function getArtistInfo(artistId) {

  // Create a Rapidapi searchable endpoint using the artist name
  const url = `https://spotify23.p.rapidapi.com/artist_albums/?id=${artistId}&limit=100`;
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'c2062f4901mshf330d409dbb6836p1769c5jsna4924e5a2cd1',
      'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
  };
  
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    const albums = result.data.artist.discography.albums.items;
    console.log(albums);
    displayAlbums(albums);
  } catch (error) {
    console.error(error);
  }
}

function displayAlbums(albums) {
  albums.forEach(album => {
    const albumListItem = document.createElement('li');

    const albumEl = document.createElement('div');
    albumEl.classList.add('card', 'p-2', 'm-2', 'bg-light');

    const albumImg = document.createElement('img');
    albumImg.classList.add('card-img-top');
    albumImg.src = album.releases.items[0].coverArt.sources[0].url;

    const albumTitle = document.createElement('h3');
    albumTitle.classList.add('card-title');
    albumTitle.textContent = album.releases.items[0].name;

    albumEl.appendChild(albumTitle);
    albumEl.appendChild(albumImg);

    albumListItem.appendChild(albumEl);
    albumListEl.appendChild(albumListItem);

    albumEl.addEventListener('click', function () {
      getAlbumSongs(album.releases.items[0].id);      
    });
  });
}

async function getAlbumSongs(albumId) {
  const url = `https://spotify23.p.rapidapi.com/album_tracks/?id=${albumId}&offset=0&limit=300`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'c2062f4901mshf330d409dbb6836p1769c5jsna4924e5a2cd1',
      'X-RapidAPI-Host': 'spotify23.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    const songs = result.data.album.tracks.items;
    displaySongs(songs);
  } catch (error) {
    console.error(error);
  }
}
function displaySongs(songs) {
  songListEl.innerHTML = ``;
  
  songs.forEach(song => {
    const songListItem = document.createElement('li');
    songListItem.classList.add('card', 'p-2', 'm-2', 'bg-light', 'row', 'valign-wrapper');

    const lyricsBtn = document.createElement('button');
    lyricsBtn.classList.add('btn', 'btn-primary', 'm-2',);
    lyricsBtn.innerHTML = `<i class="material-icons">format_align_center</i>`;

    lyricsBtn.height = '100%'; // Set a fixed height for the embed
 
    const songEmbed = document.createElement('embed');
    songEmbed.classList.add('m-2', 'left-align');
    songEmbed.src = song.track.uri.replace('spotify:track:', 'https://open.spotify.com/embed/track/');
    songEmbed.allowtransparency = 'true';
    songEmbed.allow = 'encrypted-media';
    songEmbed.width = '80%';
    songEmbed.height = '80'; // Set a fixed height for the embed

    songListItem.appendChild(songEmbed);
    songListItem.appendChild(lyricsBtn);
    
    songListEl.appendChild(songListItem);

    lyricsBtn.addEventListener('click', function () {
      getLyrics(song.track.name, song.track.artists[0].name);
    });
  });
}


userFormEl.addEventListener('submit', formSubmitHandler);