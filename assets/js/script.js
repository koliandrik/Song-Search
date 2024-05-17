const userFormEl = document.querySelector('#user-form');
const nameInputEl = document.querySelector('#input-artist');

const artistAlbumEl = document.querySelector('#artist-albums');
const artistTrackEl = document.querySelector('#artist-tracks');
const lyricsDisplay = document.querySelector('#lyrics');


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

  artistAlbumEl.innerHTML = ``;
  artistTrackEl.innerHTML = ``;
  lyricsDisplay.innerHTML = ``;

  const artistName = nameInputEl.value.trim();

  if (artistName) {
    getArtistInfo(artistName);
    nameInputEl.value = '';
  } else {
    alert('Please enter the artist name');
  }
};
/*********************************************************************************************************
 * getArtistInfo
 * 
 * Description:
 * 
 * This module uses the provided artist name to create a searchable endpoint to use with Rapidapi
 * Once the endpoint is invoked, it returns a data structure that includes the artist's portfolio
 * The portfolio object is the sent to displayArtistInfo() to parse out three examples of the artist's work
 * 
 * ********************************************************************************************************
*/
async function getArtistInfo(artistName) {

  const fullName = artistName.split(" ");
  const firstName = fullName[0];
  const lastName = fullName.slice(1).join(" ");

  // Create a Rapidapi searchable endpoint using the artist name
  const baseUrl = 'https://spotify-web2.p.rapidapi.com/search/?q=';
  const trailingUrl = '&type=multi&offset=0&limit=10&numberOfTopResults=5';
  const space = '%20';
  const fullUrl = baseUrl + firstName + space + lastName + trailingUrl;
  
  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'f2b82f2c9amshd0e5de0c4f0d779p101d0ejsn6ac918b7951d',
      'X-RapidAPI-Host': 'spotify-web2.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(fullUrl, options);
    const result = await response.json();
    console.log(result);

    // Now that we have all the info about the artist (result), go and make the relevant pieces accessible for the UI 
    // First ensure that the user entry is not gibberish and that the API service can actually find it
    // If the entry is gibberish popup a prompt to the user asking them to provide a valid artist name
    if( result.artists.items[0].data.profile.name ) {
      displayArtistInfo(artistName, result); 
    }
    else {
      console.log("The entered artist name does not exist");
    
      displayPrompt("Enter a valid artist name!");
    }

  } catch (error) {
    console.error(error);
    displayPrompt("Enter a valid artist name!");
  }
};

/*********************************************************************************************************
 * displayPrompt
 * 
 * Description:
 * 
 * This helper function displays a prompt modal informing the user that their entry is not valid.  The caller
 * provides the message that is to be displayed in this popup dialog. 
 * 
 * ********************************************************************************************************
 */
const displayPrompt = function(message) {
  dialogMessage.textContent = message;
  $(function () {
    $('#dialog').dialog();
  });
}

/*********************************************************************************************************
 *  displayArtistInfo
 * 
 * Description:
 * 
 * This module parse out three examples of the artist's work, including playlists, and makes it accessible 
 * for the UI in form of a data structure (object)
 * 
 * ********************************************************************************************************
*/
const displayArtistInfo = function(artistName, data) {
  artistPortfolio = {

    artistFullName: artistName,

    Albums: {
      1: {
        name: data.albums.items[0].data.name,
        date: data.albums.items[0].data.date.year,
        image: data.albums.items[0].data.coverArt.sources[0].url,
      },
      2: {
        name: data.albums.items[1].data.name,
        date: data.albums.items[1].data.date.year,
        image: data.albums.items[1].data.coverArt.sources[0].url,
      },
      3: {
        name: data.albums.items[2].data.name,
        date: data.albums.items[2].data.date.year,
        image: data.albums.items[2].data.coverArt.sources[0].url,
      },
    },

    Tracks: {
      1: {
        name:  data.tracks.items[0].data.name,
        id: data.tracks.items[0].data.id,
        track: processTrack(data.tracks.items[0].data.uri),
      },
      2: {
        name:  data.tracks.items[1].data.name,
        id: data.tracks.items[1].data.id,
        track: processTrack(data.tracks.items[1].data.uri),
      },
      3: {
        name:  data.tracks.items[2].data.name,
        id: data.tracks.items[2].data.id,
        track: processTrack(data.tracks.items[2].data.uri),
      },
      4: {
        name:  data.tracks.items[3].data.name,
        id: data.tracks.items[3].data.id,
        track: processTrack(data.tracks.items[3].data.uri),
      },
      5: {
        name:  data.tracks.items[4].data.name,
        id: data.tracks.items[4].data.id,
        track: processTrack(data.tracks.items[4].data.uri),
      },
      6: {
        name:  data.tracks.items[5].data.name,
        id: data.tracks.items[5].data.id,
        track: processTrack(data.tracks.items[5].data.uri),
      },
      7: {
        name:  data.tracks.items[6].data.name,
        id: data.tracks.items[6].data.id,
        track: processTrack(data.tracks.items[6].data.uri),
      },
      8: {
        name:  data.tracks.items[7].data.name,
        id: data.tracks.items[7].data.id,
        track: processTrack(data.tracks.items[7].data.uri),
      },
      9: {
        name:  data.tracks.items[8].data.name,
        id: data.tracks.items[8].data.id,
        track: processTrack(data.tracks.items[8].data.uri),
      },
      10: {
        name:  data.tracks.items[9].data.name,
        id: data.tracks.items[9].data.id,
        track: processTrack(data.tracks.items[9].data.uri),
      },
    },
  }; // end artistPortfolio


//   console.table("Top 3 results of the artist:", artistPortfolio);
// }

// Creating HTML content to display artist information

artistAlbumEl.classList.add('card');

let artistAlbumHTML = `<div class ='card-content black-text'>`;
artistAlbumHTML += `<h4>Top 3 Albums of ${artistPortfolio.artistFullName}:</h4>`;
artistAlbumHTML += `<div class="row">`;

// Looping through the top 3 albums of the artist

for (let i = 1; i <= 3; i++) {
  artistAlbumHTML += `
    <div class="col s12 m4">
      <div class="card">
        <div class="card-image">
          <img src="${artistPortfolio.Albums[i].image}" alt="${artistPortfolio.Albums[i].name}">
          <span class="card-title text-dark">${artistPortfolio.Albums[i].name}</span>
        </div>
        <div class="card-content">
          <h3>Release Year: ${artistPortfolio.Albums[i].date}</h3>
        </div>
      </div>
    </div>
  `;
}

artistAlbumHTML += `</div>`;  // Closing row div for albums
  // Header indicating artist's name for playlists
artistAlbumHTML += `</div>`;

artistTrackEl.classList.add('card');

let artistTrackHTML = `<div class ='card-content black-text'>`;  // Opening row div for playlists
artistTrackHTML += `<h4>Top Tracks from ${artistPortfolio.artistFullName}:</h4>`;
artistTrackHTML += `<div class="container">`
// Looping through the top 3 playlists of the artist
for (let i = 1; i <= 10; i++) {
  artistTrackHTML += `
    <div class="card song-card">
      <div class="card-content">
        <a href="${artistPortfolio.Tracks[i].track}" target="_blank" class="black-text waves-effect waves-light btn">${artistPortfolio.Tracks[i].name}</a>
        <button class="btn btn-med waves-effect waves-light black-text get-lyrics-btn" data-track-url="${artistPortfolio.Tracks[i].id}"><i class="material-icons">subject</i></button>
      </div>
    </div>
  `;
}

artistTrackHTML += `</div></div>`; // Closing col div, row div, and row div for tracks


artistAlbumEl.insertAdjacentHTML('beforeend', artistAlbumHTML); // Insert the HTML content at the end of the specified element
artistTrackEl.insertAdjacentHTML('beforeend', artistTrackHTML);

document.querySelectorAll('.get-lyrics-btn').forEach(button => {
  button.addEventListener('click', function(event) {
    event.preventDefault();
    const trackId = event.currentTarget.getAttribute('data-track-url');
    console.log("Track ID:", trackId); // Add this line to debug
    getLyrics(trackId);
  });
});
};
/*********************************************************************************************************
 *  processPlayList
 * 
 * Description:
 * 
 * The playlist provided by Rapidapi is a google searchable URL.
 * This module reconstructs the Rapidapi provided playlist in order to create the final landing page for the playlist
 * 
 * ********************************************************************************************************
*/
const processTrack = function(track) {
  const trackArray = track.split(":");
  const baseUrl = 'https://open.spotify.com/track/';
  const trackSearchTerm = trackArray[2];
  const trackClickableUrl = baseUrl + trackSearchTerm;

  return trackClickableUrl;
};

const getLyrics = async function(track) {
  console.log("Fetching lyrics for track ID:", track);
  const url = `https://spotify-web2.p.rapidapi.com/track_lyrics/?id=${track}`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': 'c2062f4901mshf330d409dbb6836p1769c5jsna4924e5a2cd1',
      'X-RapidAPI-Host': 'spotify-web2.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    console.log(result);
    displayLyrics(result);
  } catch (error) {
    console.error("Error fetching lyrics:", error);
  }
};


function displayLyrics(data) {
  const lyrics = data.lyrics;
  lyricsDisplay.innerHTML = ''; // Clear previous lyrics
  lyricsDisplay.classList.add('card', 'lyrics-display');
  let lyricsDisplayHTML = `<h4>Lyrics:</h4><div class='card-content row black-text'><div class='col s12'>`;

  if (lyrics && lyrics.lines) {
    lyrics.lines.forEach(line => {
      lyricsDisplayHTML += `<p>${line.words}</p>`;
    });
  } else {
    lyricsDisplayHTML += `<p>No lyrics found.</p>`;
  }

  lyricsDisplayHTML += `</div></div>`;
  lyricsDisplay.innerHTML = lyricsDisplayHTML; // Update the DOM with new lyrics
};


  /*********************************************************************************************************
 *  User Form Event Listener
 * 
 * Description:
 * 
 * Listens for the Submit button and calls its handler when pressed
 * 
 * ********************************************************************************************************
*/
userFormEl.addEventListener('submit', formSubmitHandler);

$(document).ready(function() {
    $(".dropdown-trigger").dropdown({
        coverTrigger: false
        
    });
});