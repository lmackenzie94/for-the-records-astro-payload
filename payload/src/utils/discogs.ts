const DISCOGS_BASE_URL = 'https://api.discogs.com';
const DISCOGS_TOKEN = 'lvSqsEIAVQNHGbsYiVRDSUwSZHidyBUKGTFdZKYb';

export const fetchRecordData = async (
  recordTitle: string,
  mainArtistId: string
) => {
  console.log('fetchRecordData', recordTitle, mainArtistId);

  let mainArtistName = null;
  if (mainArtistId) {
    // use the main artist ID to get the artist name via the Payload API

    // TODO: why doesn't process.env work in production?
    const serverURL =
      process.env.PAYLOAD_PUBLIC_SERVER_URL || 'https://for-the-records.com';
    const URL = `${serverURL}/api/artists/${mainArtistId}`;

    console.log(`Fetching artist name from: ${URL}`);
    const res = await fetch(URL);

    if (!res.ok) {
      throw new Error('Error fetching artist name...');
    }

    const artistData = await res.json();

    mainArtistName = artistData.name;
  }

  // TODO: move discogs request to a function to hide the token??
  // NOTE: sort=have sorts by Discog "Most Collected" (desc) which seems to be better than the default (Relevance)
  let discogsUrl = `${DISCOGS_BASE_URL}/database/search?sort=have&title=${recordTitle}&type=master&token=${DISCOGS_TOKEN}`;

  if (mainArtistName) {
    discogsUrl += `&artist=${mainArtistName}`;
  }

  console.log(`Fetching Discogs record data from: ${discogsUrl}`);

  const response = await fetch(discogsUrl);

  if (!response.ok) {
    throw new Error('Error fetching record data...');
  }

  const data = await response.json();

  return data;
};

export const fetchArtistData = async (
  artistName: string,
  numToFetch: number = 3
) => {
  const url = `${DISCOGS_BASE_URL}/database/search?sort=have&title=${artistName}&type=artist&token=${DISCOGS_TOKEN}&per_page=${numToFetch}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Error fetching artist data...');
  }

  const data = await response.json();

  // loop through results and find "title" that most closely matches artistName, with no extra words or characters
  let topResult = data.results?.[0];

  data?.results?.forEach((result, index) => {
    const resultTitle = result.title.toLowerCase().trim();
    const artistNameLower = artistName.toLowerCase().trim();

    if (resultTitle === artistNameLower) {
      topResult = result;
    }
  });

  if (topResult) {
    const artistId = topResult.id;
    const artistUrl = `${DISCOGS_BASE_URL}/artists/${artistId}?token=${DISCOGS_TOKEN}`;
    const artistResponse = await fetch(artistUrl, {
      headers: {
        // Accept: 'application/vnd.discogs.v2.plaintext+json' // get plaintext bio from Discogs
        Accept: 'application/vnd.discogs.v2.html+json' // get HTML bio from Discogs
      }
    });

    if (!artistResponse.ok) {
      throw new Error('Error fetching artist data...');
    }

    const artistData = await artistResponse.json();

    return artistData;
  }
};
