'use client';

import { useLivePreview } from '@/hooks/useLivePreview';
import { Serialize } from '@/utils/lexical/ReactSerializer';

const ContentReact = ({ content, className = '' }) => {
  // const contentArray = getContentArray(content);

  const serverURL = import.meta.env.DEV
    ? 'http://localhost:3001'
    : 'https://for-the-records.com';

  const { data } = useLivePreview({
    initialData: content,
    // serverURL: import.meta.env.PAYLOAD_URL // doesn't work...
    serverURL
    // depth: 2
  });

  return (
    <div className={`${className}`}>
      {/* {data && <h2>About {data?.name}</h2>} */}
      <Serialize nodes={data?.content?.root?.children} />
      {/* {contentArray.map((value) => {
        if (typeof value === 'string') {
          return <article dangerouslySetInnerHTML={{ __html: value }} />;
        } else {
          return (
            <img
              src={getImageSrc(value.src)}
              width={value.width}
              height={value.height}
              // format="webp"
              alt=""
            />
          );
        }
      })} */}
      {/* <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eos, libero
        totam harum illo obcaecati, hic iste vitae distinctio fuga nisi quam
        dolor est iure aliquid minus dolore, temporibus ipsa esse molestias
        tempore nemo sint molestiae. Doloremque itaque tempore non facilis
        earum, unde eos, rem esse molestias autem recusandae labore iste!
      </p> */}
    </div>
  );
};

export default ContentReact;
