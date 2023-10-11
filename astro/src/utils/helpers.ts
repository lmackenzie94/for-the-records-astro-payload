import { payloadSlateToHtmlConfig, slateToHtml } from '@slate-serializers/html';
import { Element } from 'domhandler';
import contrast from 'get-contrast';

export const getContentArray = (content: any) => {
  const html = slateToHtml(content, {
    ...payloadSlateToHtmlConfig,
    elementTransforms: {
      ...payloadSlateToHtmlConfig.elementTransforms,
      upload: ({ node }) =>
        // @ts-ignore
        new Element('img', {
          src: node.value.filename,
          width: `${node.value.width}`,
          height: `${node.value.height}`
        })
    }
  });
  // .replaceAll('<p></p>', '<p>&nbsp;</p>');
  const htmlImageArray: (
    | string
    | { src: string; width: number; height: number }
  )[] = [];
  let lastIndex = 0;
  while (true) {
    const imgStartIndex = html.indexOf('<img', lastIndex);
    if (imgStartIndex === -1) {
      htmlImageArray.push(html.substring(lastIndex));
      break;
    }
    const imgEndIndex = html.indexOf('>', imgStartIndex) + 1;
    const imgTag = html.substring(imgStartIndex, imgEndIndex);
    const remainingHtml = html.substring(lastIndex, imgStartIndex);
    const imgObject = {
      src: imgTag.match(/src="(.*?)"/)![1],
      width: +imgTag.match(/width="(.*?)"/)![1],
      height: +imgTag.match(/height="(.*?)"/)![1]
    };
    htmlImageArray.push(remainingHtml, imgObject);
    lastIndex = imgEndIndex;
  }
  return htmlImageArray;
};

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
