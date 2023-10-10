import React from 'react';
import './Icon.scss';

const Icon = () => {
  const IS_DEV = process.env.NODE_ENV === 'development';

  React.useEffect(() => {
    // add border to top of page to show we're in dev mode
    if (IS_DEV) {
      const body = document.querySelector('body');

      if (!body.classList.contains('dev')) {
        body.classList.add('dev');
      }
    }
  }, []);

  return (
    <div className="ftr-icon__container">
      <div className="ftr-icon">
        <img src="/assets/record.svg" alt="For The Records logo" />
      </div>
      {IS_DEV && <span>🚧</span>}
    </div>
  );
};

export default Icon;
