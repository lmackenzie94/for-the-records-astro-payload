// @ts-nocheck

import { fetchRecordData } from '@/utils/discogs';
import { useDebounce } from '@/utils/useDebounce';
import { useField } from 'payload/components/forms';
import React, { useEffect } from 'react';

type Props = { path: string };

const RecordData: React.FC<Props> = ({ path }) => {
  const { value: currentImageUrl, setValue: setCurrentImageUrl } =
    useField<Props>({ path: 'imageUrl' });
  const { setValue: setReleaseYear } = useField<Props>({ path: 'releaseYear' });
  const { setValue: setLabel } = useField<Props>({
    path: 'label'
  });
  const { value: recordTitle } = useField<Props>({ path: 'title' });
  const { value: recordArtistIds } = useField<Props>({ path: 'artist' });

  const [recordData, setRecordData] = React.useState(null);
  const [error, setError] = React.useState(null);

  const debouncedRecordTitle = useDebounce(recordTitle, 1000);

  useEffect(() => {
    if (debouncedRecordTitle) {
      getRecordData(debouncedRecordTitle, recordArtistIds);
    }
  }, [debouncedRecordTitle, recordArtistIds]);

  // TODO: narrow down based on selected artist (if there is one)
  const getRecordData = async (recordTitle: string, recordArtistIds: any) => {
    try {
      const mainArtistId = recordArtistIds ? recordArtistIds[0] : null;
      const recordData = await fetchRecordData(recordTitle, mainArtistId);
      setRecordData(recordData.results);
    } catch (error) {
      setError(error.message);
    }
  };

  const setFields = (fields: {
    cover_image: string;
    year: string;
    label: string;
  }) => {
    const { cover_image: imageURL, year, label } = fields;

    // if user clicks on an image that is already selected, unselect it
    if (currentImageUrl === imageURL) {
      setCurrentImageUrl(null);
      return;
    }

    setCurrentImageUrl(imageURL);

    if (year) {
      setReleaseYear(year);
    }

    if (label) {
      setLabel(label);
    }
  };

  useEffect(() => {
    if (error) console.error(`Something went wrong... ${error}`);
  }, [error]);

  return (
    <div
      style={{
        marginBottom: '2rem'
      }}
    >
      <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem' }}>Record Data</h3>
      {recordData ? (
        <div>
          <RecordImagesAndInfo
            recordData={recordData}
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

const RecordImagesAndInfo = ({ recordData, currentImageUrl, onClick }) => {
  if (!recordData || recordData.length === 0) {
    return <p>No records found.</p>;
  }

  return (
    <div
      style={{
        display: 'flex',
        borderRadius: '4px',
        background: '#f4f4f4',
        padding: '1rem 0'
      }}
    >
      {recordData?.slice(0, NUM_RECORDS_TO_DISPLAY).map((record, idx) => {
        const { title, cover_image, year, genre, label, country } = record;

        const mainLabel = label[0];

        const isSelected = currentImageUrl === cover_image;

        const isInnerRecord = idx !== 0 && idx !== NUM_RECORDS_TO_DISPLAY - 1;

        return (
          <article
            key={cover_image}
            style={{
              padding: '0 1.5rem',
              borderRight: isInnerRecord ? '1px solid #e2e2e2' : 'none',
              borderLeft: isInnerRecord ? '1px solid #e2e2e2' : 'none'
            }}
          >
            <div
              className={`recordImage ${isSelected ? 'selected' : ''}`}
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
                    cover_image,
                    year,
                    label: mainLabel
                  })
                }
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
            <div
              style={{
                marginTop: '10px',
                maxWidth: '18ch'
              }}
            >
              <p
                style={{
                  fontWeight: 'bold',
                  lineHeight: 1.1,
                  margin: 0
                }}
              >
                {title}{' '}
                {year && <span style={{ fontWeight: 'normal' }}>({year})</span>}
              </p>
              <p style={{ margin: '.3em 0', lineHeight: 1.1 }}>
                {genre.join(', ')}
              </p>
              <p style={{ margin: '.3em 0', lineHeight: 1.1 }}>{mainLabel}</p>
              {/* <p style={{ margin: '.5em 0', lineHeight: 1.1 }}>{country}</p> */}
            </div>
          </article>
        );
      })}
    </div>
  );
};

export const RecordDataCell = () => {
  return <p>[image thumb should go here]</p>;
};

export default RecordData;
