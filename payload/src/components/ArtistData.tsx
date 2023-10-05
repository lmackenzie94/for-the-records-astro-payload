// @ts-nocheck

import { fetchArtistData } from '@/utils/discogs';
import { useDebounce } from '@/utils/useDebounce';
import { useField } from 'payload/components/forms';
import React, { useEffect } from 'react';

type Props = { path: string };

const ArtistData: React.FC<Props> = ({ path }) => {
  const { value: currentImageUrl, setValue: setCurrentImageUrl } =
    useField<Props>({ path: 'imageUrl' });
  const { value: artistName } = useField<Props>({ path: 'name' });
  const { value: artistBio, setValue: setArtistBio } = useField<Props>({
    path: 'discogsBio'
  });

  const [artistData, setArtistData] = React.useState(null);
  const [error, setError] = React.useState(null);

  useEffect(() => {
    if (currentImageUrl) setCurrentImageUrl(currentImageUrl);
  }, []);

  const debouncedArtistName = useDebounce(artistName, 1000);

  // fetch artist data from Discogs
  useEffect(() => {
    if (debouncedArtistName) {
      getArtistData(debouncedArtistName);
    }
  }, [debouncedArtistName]);

  const getArtistData = async (artistName: string) => {
    try {
      const artistData = await fetchArtistData(artistName);
      setArtistData(artistData);

      if (artistData?.profile_html && !artistBio) {
        setArtistBio(artistData.profile_html);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const setFields = ({ imageURL, profile }) => {
    // if user clicks on an image that is already selected, unselect it
    if (currentImageUrl === imageURL) {
      setCurrentImageUrl(null);
      return;
    }

    setCurrentImageUrl(imageURL);

    if (profile && !artistBio) {
      setArtistBio(profile);
    }
  };

  return (
    <div
      style={{
        marginBottom: '2rem'
      }}
    >
      <h3 style={{ margin: '0', fontSize: '1rem' }}>
        Artist Image (from Discogs)
      </h3>
      {artistData ? (
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
          <p
            style={{
              fontSize: '.8rem',
              color: 'lightgray',
              marginBottom: '1rem'
            }}
          >
            Discogs Artist Name:{' '}
            <span style={{ fontWeight: 'bold' }}>{artistData.name}</span>
          </p>
          <ArtistImages
            artistData={artistData}
            currentImageUrl={currentImageUrl}
            onClick={setFields}
          />
          {currentImageUrl && (
            <details style={{ marginTop: '1rem' }}>
              <summary style={{ cursor: 'pointer' }}>
                Selected Image URL
              </summary>
              <a
                href={currentImageUrl}
                target="_blank"
                style={{
                  wordWrap: 'break-word',
                  color: '#5d6436'
                }}
              >
                {currentImageUrl}
              </a>
            </details>
          )}
        </div>
      ) : (
        <>
          {!artistName && (
            <p
              style={{
                fontSize: '.8rem',
                color: 'rgba(255,0,0,0.5)',
                marginBottom: 0
              }}
            >
              Enter an artist name to get images
            </p>
          )}
        </>
      )}
    </div>
  );
};

const NUM_IMAGES_TO_DISPLAY = 4;

const ArtistImages = ({ artistData, currentImageUrl, onClick }) => {
  const { name: artistName, images } = artistData;

  if (!images || images.length === 0) {
    return <p>No images found for {artistName}</p>;
  }

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.5rem'
      }}
    >
      {images?.slice(0, NUM_IMAGES_TO_DISPLAY).map((image) => {
        const isSelected = currentImageUrl === image.uri;

        return (
          <div
            key={image.uri}
            className={`artistImage ${isSelected ? 'selected' : ''}`}
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
              onClick={() =>
                onClick({
                  imageURL: image.uri,
                  profile: artistData.profile_html
                })
              }
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                cursor: 'pointer',
                borderRadius: '4px'
              }}
              src={image.uri}
              alt={artistName}
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
        );
      })}
    </div>
  );
};

export const ArtistDataCell = () => {
  return <p>[image thumb should go here]</p>;
};

export default ArtistData;
