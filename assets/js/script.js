const userFormEl = document.querySelector('#user-form');
const nameInputEl = document.querySelector('#input-artist');

const accessToken = 'BQBoQjvLTbalB5BJmFf29ZrwgUh-54MrYYdAj6OAhSiWyt2OHPZ3FwtsDNROyNGSFGSudoptBM__du2EBiWAiYtp-Q0MVoVgIRaOkmkhz4qCWlEGcCivxn8HysZb88Bel0xmpagqW9TdWZyn9mTNXBLQWGsIagJzg0Ant0U_tOeghztdHkN5pr9kmVR8n_QUdz63EC6cZxw6YUB_nx0';

const formSubmitHandler = function (event) {
  event.preventDefault();

  const artistName = nameInputEl.value.trim();

  if (artistName) {
    getArtistSongSearchUrl(artistName);   // <-- Start of our thread to get the info on the submitted artist
    
    nameInputEl.value = '';
  } else {
    alert('Please enter the artist name');
  }
};

const getArtistSongSearchUrl = function (artistName) {
  
  const artistIdSearchUrl = `https://api.spotify.com/v1/search?q=${artistName}&type=artist`;

  fetch(artistIdSearchUrl, { headers: {
    Authorization: `Bearer ${accessToken}`,
    }})
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          // We extract the (artist Id) here   
          let artistId = data.artists.items[0].id;  // <-- Artist's ID

          console.log("Artist's name: ", artistName);
          console.log("Artist's Spotify ID: ", artistId);

          // Using the Artist's extracted ID, we build the endpoint for the (top tracks) here
          let artistSongSearchUrl = 'https://api.spotify.com/v1/artists/' + artistId + '/top-tracks';

          // Now given that the execution must be in scope and on the same thread that we started
          // we now call another function to get the Artists Songs, by passing it the (top tracks) endpoint
          getArtistSongs(artistSongSearchUrl);  // <-- get the bundle that includes the Artist's Songs, images, etc.
        });
      } else {
        alert(`Error:${response.statusText}`);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to server');
    });
}

const getArtistSongs = function(artistSongSearchUrl) {
  fetch(artistSongSearchUrl, { headers: {
    Authorization: `Bearer ${accessToken}`,
  }})
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          //console.log("Inside getArtistSongs(), data: ", data);

          //Now that we have the artist's songs bundle, we'll call the final API below to extract and display the artist's songs
          displayArtistSongs( data );
        });
      } else {
        alert(`Error:${response.statusText}`);
      }
    })
    .catch(function (error) {
      alert('Unable to connect to server');
    });
}

const displayArtistSongs = function(data) {
  console.log("Inside displayArtistSongs(), data: ", data);
  const artistName = data.tracks[0].artists[0].name;
  
  artistSongsDetails = {
    song1Name: data.tracks[0].name,
    song1PreviewUrl: data.tracks[0].preview_url,
    song1Image: data.tracks[0].album.images[2],

    song2Name: data.tracks[1].name,
    song2PreviewUrl: data.tracks[1].preview_url,
    song2Image: data.tracks[1].album.images[2],

    song3Name: data.tracks[2].name,
    song3PreviewUrl: data.tracks[2].preview_url,
    song3Image: data.tracks[2].album.images[2],
  };

  console.table("Top 3 songs of the artist:", artistSongsDetails);
}

userFormEl.addEventListener('submit', formSubmitHandler);


$(document).ready(function() {
    $(".dropdown-trigger").dropdown({
        coverTrigger: false
    });
}) 

//why does the dropdown still cover the trigger in the footer?