import contrast from 'get-contrast';

export const invertHex = (hexCode: string) => {
  const hex = hexCode.replace('#', '');
  const invertedHex = (Number(`0x1${hex}`) ^ 0xffffff)
    .toString(16)
    .substr(1)
    .toUpperCase();
  return `#${invertedHex}`;
};

export const getThemeColors = (hexCode: string, defaultColor: string) => {
  const themeColor = hexCode || defaultColor;
  const invertedThemeColor = invertHex(themeColor);

  const FADE_FACTOR = 20;
  const themeColorFaded = `${themeColor}${FADE_FACTOR}`;
  const invertedThemeColorFaded = `${invertedThemeColor}${FADE_FACTOR}`;

  const lightModeBg = '#fbfbfb';
  const darkModeBg = '#323232';

  let lightModeTextColor = darkModeBg;
  let darkModeTextColor = lightModeBg;

  // check contrast to determine text color
  const lightModeThemeColorContrast = contrast.ratio(lightModeBg, themeColor);
  const lightModeInvertedThemeColorContrast = contrast.ratio(
    lightModeBg,
    invertedThemeColor
  );
  const darkModeThemeColorContrast = contrast.ratio(darkModeBg, themeColor);
  const darkModeInvertedThemeColorContrast = contrast.ratio(
    darkModeBg,
    invertedThemeColor
  );

  if (lightModeThemeColorContrast > lightModeInvertedThemeColorContrast) {
    lightModeTextColor = themeColor;
  } else {
    lightModeTextColor = invertedThemeColor;
  }

  if (darkModeThemeColorContrast > darkModeInvertedThemeColorContrast) {
    darkModeTextColor = themeColor;
  } else {
    darkModeTextColor = invertedThemeColor;
  }

  return {
    themeColor,
    invertedThemeColor,
    lightModeTextColor,
    darkModeTextColor,
    themeColorFaded,
    invertedThemeColorFaded
  };
};

// query helpers

export const getLimitQuery = (limit: number) => {
  return `limit=${limit}`;
};

export const getStatusQuery = (status: 'published' | 'draft') => {
  return `where[status][equals]=${status}`;
};
