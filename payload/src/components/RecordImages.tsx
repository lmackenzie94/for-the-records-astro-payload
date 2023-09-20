import { useDebounce } from '@/utils/useDebounce';
import { useField, useFormFields } from 'payload/components/forms';
import React, { useEffect } from 'react';

type Props = { path: string };

const RecordImages: React.FC<Props> = ({ path }) => {
  const { value: currentImageUrl } = useField<Props>({ path: 'imageUrl' });

  const [recordData, setRecordData] = React.useState(null);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    if (currentImageUrl) setSelectedImage(currentImageUrl);
  }, []);

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

  const debouncedRecordTitle = useDebounce(recordTitle, 1000);

  useEffect(() => {
    if (debouncedRecordTitle) {
      getRecordData(debouncedRecordTitle);
    }
  }, [debouncedRecordTitle, recordArtistIds]);

  // TODO: narrow down based on selected artist (if there is one)
  const getRecordData = async (recordTitle: string) => {
    try {
      const mainArtistId = recordArtistIds ? recordArtistIds[0] : null;
      const recordData = await fetchRecordData(recordTitle, mainArtistId);
      setRecordData(recordData.results);
    } catch (error) {
      setError(error.message);
    }
  };

  const setImageURLField = (imageURL: string) => {
    // if user clicks on an image that is already selected, unselect it
    if (selectedImage === imageURL) {
      setSelectedImage(null);

      dispatch({
        type: 'UPDATE',
        path: 'imageUrl',
        value: ''
      });

      return;
    }

    setSelectedImage(imageURL);

    dispatch({
      type: 'UPDATE',
      path: 'imageUrl',
      value: imageURL
    });
  };

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
      {recordData ? (
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
          <RecordImagesGrid
            recordData={recordData}
            selectedImage={selectedImage}
            onClick={setImageURLField}
          />
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
        </>
      )}
    </div>
  );
};

const NUM_RECORDS_TO_DISPLAY = 3;

const RecordImagesGrid = ({ recordData, selectedImage, onClick }) => {
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

        const isSelected = selectedImage === cover_image;

        return (
          <article key={cover_image}>
            <div
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
                maxWidth: '15ch',
                lineHeight: 1.1
              }}
            >
              {title} ({year})
            </p>
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

const fetchRecordData = async (recordTitle: string, mainArtistId: string) => {
  let mainArtistName = null;
  if (mainArtistId) {
    mainArtistName = await fetchArtistName(mainArtistId);
  }

  // TODO: move discogs request to a function to hide the token??
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

  return data;
};

const fetchArtistName = async (artistId: string) => {
  // TODO: don't hardcode localhost
  const res = await fetch(`http://localhost:3001/api/artists/${artistId}`);

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }
  const artistData = await res.json();

  return artistData.name;
};
