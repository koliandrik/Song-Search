const userFormEl = document.querySelector('#user-form');
const nameInputEl = document.querySelector('#input-artist');
const artistInfoEl = document.querySelector('#artist-info');
const dialogMessage = document.querySelector('#dialog-message');

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
  const lastName = fullName[1];

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
}

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
      }
    },

    playLists: {
      1: {
        name:  data.playlists.items[0].data.name,
        description: data.playlists.items[0].data.description,
        image: data.playlists.items[0].data.images.items[0].sources[0].url,
        playList: processPlayList(data.playlists.items[0].data.uri),
      },
      2: {
        name:  data.playlists.items[1].data.name,
        description: data.playlists.items[1].data.description,
        image: data.playlists.items[1].data.images.items[0].sources[0].url,
        //playList: data.playlists.items[1].data.uri,
        playList: processPlayList(data.playlists.items[1].data.uri),
      },
      3: {
        name:  data.playlists.items[2].data.name,
        description: data.playlists.items[2].data.description,
        image: data.playlists.items[2].data.images.items[0].sources[0].url,
        playList: data.playlists.items[2].data.uri,
        playList: processPlayList(data.playlists.items[2].data.uri),
      },
    }
  }; // end artistPortfolio


//   console.table("Top 3 results of the artist:", artistPortfolio);
// }

// Creating HTML content to display artist information

let artistInfoHTML = `<h4>Top 3 results of ${artistName}:</h4>`;
artistInfoHTML += `<div class="row">`;

// Looping through the top 3 albums of the artist

for (let i = 1; i <= 3; i++) {
  artistInfoHTML += `
    <div class="col s12 m4">
      <div class="card">
        <div class="card-image">
          <img src="${artistPortfolio.Albums[i].image}" alt="${artistPortfolio.Albums[i].name}">
          <span class="card-title">${artistPortfolio.Albums[i].name}</span>
        </div>
        <div class="card-content">
          <p>Release Year: ${artistPortfolio.Albums[i].date}</p>
        </div>
      </div>
    </div>
  `;
}

artistInfoHTML += `</div>`;  // Closing row div for albums

artistInfoHTML += `<h4>Top 3 playlists of ${artistName}:</h4>`;  // Header indicating artist's name for playlists

artistInfoHTML += `<div class="row">`;  // Opening row div for playlists

// Looping through the top 3 playlists of the artist
for (let i = 1; i <= 3; i++) {
  artistInfoHTML += `
    <div class="col s12 m4">
      <div class="card">
        <div class="card-image">
          <img src="${artistPortfolio.playLists[i].image}" alt="${artistPortfolio.playLists[i].name}">
          <span class="card-title">${artistPortfolio.playLists[i].name}</span>
        </div>
        <div class="card-content">
          <p>${artistPortfolio.playLists[i].description}</p>
          <a href="${artistPortfolio.playLists[i].playList}" target="_blank" class="waves-effect waves-light btn">Listen</a>
        </div>
      </div>
    </div>
  `;
}

artistInfoHTML += `</div>`; // Closing row div for playlists

artistInfoEl.innerHTML = artistInfoHTML; // Update the HTML content of the specified element
}


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
const processPlayList = function(playList) {
  
  const playListArray = playList.split(":");

  const baseUrl = 'https://open.spotify.com/playlist/';
  const playListSearchTerm = playListArray[2];
  const playListClickableUrl = baseUrl + playListSearchTerm;

  return playListClickableUrl;
}

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
}) 

//why does the dropdown still cover the trigger in the footer?