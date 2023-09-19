import { useDebounce } from '@/utils/useDebounce';
import { useField, useFormFields } from 'payload/components/forms';
import React, { useEffect } from 'react';

type Props = { path: string };

const RecordImages: React.FC<Props> = ({ path }) => {
  const { value: currentImageUrl } = useField<Props>({ path: 'imageUrl' });

  const [error, setError] = React.useState(null);

  // get artist name from Name field
  let dispatch = null;
  const { recordTitle, recordArtistIds } = useFormFields(
    ([fields, dispatchFields]) => {
      dispatch = dispatchFields;
      return {
        recordTitle: fields?.title?.value,
        recordArtistIds: fields?.artist?.value
      };
    }
  );

  console.log('RECORD TITLE', recordTitle);
  console.log('RECORD ARTIST IDs', recordArtistIds); // only returns ID, but I need the name

  const fetchArtistName = async (artistId: string) => {
    // TODO: don't hardcode localhost
    const res = await fetch(`http://localhost:3001/api/artists/${artistId}`);

    if (!res.ok) {
      throw new Error('Network response was not ok');
    }
    const artistData = await res.json();

    return artistData.name;
  };

  const debouncedRecordTitle = useDebounce(recordTitle, 1000);

  // fetch artist images
  useEffect(() => {
    if (debouncedRecordTitle) {
      fetchRecordImage(debouncedRecordTitle);
    }
  }, [debouncedRecordTitle]);

  const [recordOptions, setRecordOptions] = React.useState([]);
  const [recordData, setRecordData] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState(null);

  // TODO: narrow down based on selected artist (if there is one)
  const fetchRecordImage = async (recordTitle: string) => {
    try {
      const mainArtistId = recordArtistIds[0];
      let mainArtistName = null;
      if (mainArtistId) {
        mainArtistName = await fetchArtistName(mainArtistId);
      }

      // const discogsToken = process.env.REACT_APP_DISCOGS_TOKEN;  // <-- this doesn't work
      const discogsToken = 'lvSqsEIAVQNHGbsYiVRDSUwSZHidyBUKGTFdZKYb';
      let discogsUrl = `https://api.discogs.com/database/search?title=${recordTitle}&type=master&token=${discogsToken}`;

      if (mainArtistName) {
        discogsUrl += `&artist=${mainArtistName}`;
      }

      const response = await fetch(discogsUrl);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      console.log('data', data.results);

      setRecordOptions(data.results);

      // const topResult = data.results[0];

      // if (topResult) {
      //   const artistId = topResult.id;
      //   const artistUrl = `https://api.discogs.com/artists/${artistId}?token=${discogsToken}`;
      //   const artistResponse = await fetch(artistUrl);

      //   if (!artistResponse.ok) {
      //     throw new Error('Network response was not ok');
      //   }

      //   const recordData = await artistResponse.json();

      //   setRecordData(recordData);
      // }
    } catch (error) {
      setError(error.message);
    }
  };

  const setImageURLField = (imageURL: string) => {
    setSelectedImage(imageURL);

    dispatch({
      type: 'UPDATE',
      path: 'imageUrl',
      value: imageURL
    });
  };

  // const getRecordImages = (e) => {
  //   e.preventDefault();
  //   fetchRecordImage(recordTitle);
  // };

  // TODO: when an album is selected, fetch the album's data from Discogs and populate the form fields

  return (
    <div
      style={{
        marginBottom: '2rem'
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>
        Record Data (from Discogs)
      </h3>
      {recordOptions ? (
        <div>
          {error && (
            <p
              style={{
                color: 'red',
                fontSize: '.8rem',
                marginBottom: '1rem'
              }}
            >
              {error}
            </p>
          )}
          {/* <p
            style={{
              fontSize: '.8rem',
              color: 'lightgray',
              marginBottom: '1rem'
            }}
          >
            Discogs Artist Name:{' '}
            <span style={{ fontWeight: 'bold' }}>{recordData.name}</span>
          </p> */}
          <RecordImagesGrid
            recordData={recordOptions}
            selectedImage={selectedImage}
            currentImageUrl={currentImageUrl}
            onClick={setImageURLField}
          />
          {/* <RecordImagesGrid
            recordData={recordData}
            selectedImage={selectedImage}
            currentImageUrl={currentImageUrl}
            onClick={setImageURLField}
          /> */}
        </div>
      ) : (
        <>
          {!recordTitle && (
            <p
              style={{
                fontSize: '.8rem',
                color: 'rgba(255,0,0,0.5)',
                marginBottom: 0
              }}
            >
              Enter a record name and artist to get images
            </p>
          )}
          {/* <button
            disabled={!recordTitle}
            onClick={getRecordImages}
            style={{ marginTop: '.5rem' }}
          >
            Get Artist Images
          </button> */}
        </>
      )}
    </div>
  );
};

const NUM_RECORDS_TO_DISPLAY = 3;

const RecordImagesGrid = ({
  recordData,
  selectedImage,
  currentImageUrl,
  onClick
}) => {
  if (!recordData || recordData.length === 0) {
    return <p>No records found.</p>;
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '2rem'
      }}
    >
      {recordData?.slice(0, NUM_RECORDS_TO_DISPLAY).map((record) => {
        const { title, cover_image, year, genre, label, country } = record;

        // if (imageWidth && imageHeight) {
        //   imageURL += `?imgWidth=${imageWidth}&imgHeight=${imageHeight}`;
        // }

        const isSelected =
          selectedImage === cover_image || currentImageUrl === cover_image;

        return (
          <article>
            <div
              key={cover_image}
              style={{
                position: 'relative',
                width: 100,
                height: 100,
                borderRadius: '4px',
                border: isSelected ? '2px solid #000' : 'none',
                padding: isSelected ? '2px' : '0'
              }}
            >
              <img
                onClick={() => onClick(cover_image)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
                src={cover_image}
                alt={title}
              />
              {isSelected && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-5px',
                    right: '5px',
                    fontSize: '2rem'
                  }}
                >
                  ✅
                </span>
              )}
            </div>
            <p
              style={{
                margin: '.5em 0',
                fontWeight: 'bold',
                maxWidth: '20ch',
                lineHeight: 1.1
              }}
            >
              {title}
            </p>
            <p style={{ margin: '.5em 0', lineHeight: 1.1 }}>{year}</p>
            <p style={{ margin: '.5em 0', lineHeight: 1.1 }}>
              {genre.join(', ')}
            </p>
            <p style={{ margin: '.5em 0', lineHeight: 1.1 }}>{label[0]}</p>
            <p style={{ margin: '.5em 0', lineHeight: 1.1 }}>{country}</p>
          </article>
        );
      })}
    </div>
  );
};

export default RecordImages;

export const RecordImagesCell = () => {
  return <p>[image thumb should go here]</p>;
};
