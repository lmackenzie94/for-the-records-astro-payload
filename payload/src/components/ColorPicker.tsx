import { useField } from 'payload/components/forms';
import React, { useCallback, useEffect, useState } from 'react';
import useEyeDropper from 'use-eye-dropper';

let initialWidth;
let initialHeight;

const ColorPicker = ({ name }) => {
  // TODO: better way to re-use this component for both records and artists?
  const collectionKey = name === 'colorPickerRecords' ? 'record' : 'artist';

  const { open } = useEyeDropper();
  const [error, setError] = useState();
  const [isSelecting, setIsSelecting] = useState(false);

  const { value: themeColor, setValue: selectedThemeColor } = useField({
    path: 'themeColor'
  });

  const { value: selectedImageUrl } = useField({
    path: 'imageUrl'
  });
  // const { value: customImageUrl } = useField({
  //   path: 'image'
  // });

  const { value: headingForPreview } = useField({
    path: collectionKey === 'record' ? 'title' : 'name'
  });

  useEffect(() => {
    const selectedImage = document.querySelector(
      `.${collectionKey}Image.selected`
    );

    if (!selectedImage) return;

    // TODO: better way to do this?
    if (!initialWidth || !initialHeight) {
      initialWidth = selectedImage.style.width;
      initialHeight = selectedImage.style.height;
    }

    if (isSelecting) {
      selectedImage.style.width = `calc(${initialWidth} + 150px)`;
      selectedImage.style.height = `calc(${initialHeight} + 150px)`;
    } else {
      selectedImage.style.width = initialWidth;
      selectedImage.style.height = initialHeight;
    }
  }, [isSelecting]);

  // useEyeDropper will reject/cleanup the open() promise on unmount,
  // so setState never fires when the component is unmounted.
  const pickColor = useCallback(() => {
    // Using async/await (can be used as a promise as-well)
    const openPicker = async () => {
      setIsSelecting(true);
      try {
        const color = await open();
        // setColor(color.sRGBHex);
        selectedThemeColor(color.sRGBHex);
      } catch (e) {
        console.log(e);
        // Ensures component is still mounted
        // before calling setState
        if (!e.canceled) setError(e);
      } finally {
        setIsSelecting(false);
      }
    };
    openPicker();
  }, [open]);
  return (
    <>
      <div
        role="button"
        style={{
          padding: '10px',
          background: themeColor ? themeColor : '#ececec',
          border: 'none',
          outline: 'none',
          cursor: 'pointer',
          borderRadius: '5px',
          display: 'block',
          width: '100%',
          boxShadow: '0 2px 4px 0 rgba(0,0,0,0.40)'
        }}
        onClick={pickColor}
      >
        <p
          style={{
            color: themeColor ? '#fff' : '#000',
            fontWeight: themeColor ? 'bold' : 'normal',
            margin: 0,
            textAlign: 'center'
          }}
        >
          {themeColor ? themeColor : 'Click to pick a colour'}
        </p>
      </div>
      <p style={{ margin: 0, fontSize: '0.8rem', color: '#777' }}>
        ⚠️ Don't pick a colour that is too dark or too light
      </p>

      <Preview
        color={themeColor}
        heading={headingForPreview}
        selectedImageUrl={selectedImageUrl}
      />

      {/* {isSupported() ? (
        <button onClick={pickColor}>Pick color</button>
      ) : (
        <span>EyeDropper API not supported in this browser</span>
      )} */}
      {/* {!!error && <div>{error.message}</div>} */}
    </>
  );
};

export default ColorPicker;

function Preview({ color, heading, selectedImageUrl }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <details
      style={{
        margin: '20px 0'
      }}
    >
      <summary>Theme Colour Preview 👀</summary>
      <div
        style={{
          position: 'relative',
          background: isDarkMode ? '#272727' : '#fbfbfb',
          transition: 'all 0.3s ease',
          padding: '1rem',
          borderRadius: '5px'
        }}
      >
        <p
          style={{
            margin: '1rem 0 -1.3rem 0.2rem',
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            fontWeight: 900,
            fontSize: '3.8rem',
            mixBlendMode: 'exclusion',
            color: color ? color : '#000',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            lineHeight: '1'
          }}
        >
          {heading}
        </p>
        <img
          src={selectedImageUrl}
          alt=""
          style={{
            maxWidth: 150,
            aspectRatio: '1/1',
            objectFit: 'cover',
            borderRadius: '2px'
          }}
        />
        <div
          role="button"
          style={{
            position: 'absolute',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bottom: '1rem',
            right: '1rem',
            color: isDarkMode ? '#272727' : '#fbfbfb',
            background: isDarkMode ? '#fbfbfb' : '#272727',
            borderRadius: '5px',
            cursor: 'pointer',
            boxShadow: '0 2px 4px 0 rgba(0,0,0,0.30)',
            fontSize: '1.5rem',
            width: '40px',
            height: '40px'
          }}
          onClick={() => setIsDarkMode(!isDarkMode)}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </div>
      </div>
    </details>
  );
}
