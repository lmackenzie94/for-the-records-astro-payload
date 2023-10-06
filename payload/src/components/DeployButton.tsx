import React from 'react';

export default function DeployButton() {
  const [deploying, setDeploying] = React.useState(false);

  const IS_DEV = process.env.NODE_ENV === 'development';
  console.log('IS DEV', IS_DEV);
  console.log('NODE ENV', process.env.NODE_ENV);

  const triggerDeployWebhook = async () => {
    // get buddy webhook from env
    const buddyWebhook = process.env.REACT_APP_BUDDY_WEBHOOK;

    // log node env
    console.log(process.env.NODE_ENV);
    setDeploying(true);
    const response = await fetch(buddyWebhook);
    console.log(response);
    setDeploying(false);
  };

  return (
    <article style={{ marginTop: `2rem` }}>
      <img
        src="https://app.buddy.works/lukes-personal-workspace/for-the-records-astro-payload/pipelines/pipeline/469266/badge.svg?token=1e5f39bef2f6738c3985cd62b49f197c31ac10d132287f274d7c391c8ce56cd2"
        alt="Buddy CI badge"
      />
      <button
        disabled={deploying || IS_DEV}
        style={{
          border: `2px solid #4b5320`,
          backgroundColor: `#4b532022`,
          color: `#4b5320`,
          padding: '.5rem 1rem',
          borderRadius: '5px',
          fontWeight: 'bold',
          marginTop: '1rem',
          width: '100%',
          cursor: 'pointer',
          opacity: deploying || IS_DEV ? 0.4 : 1
        }}
        onClick={triggerDeployWebhook}
      >
        Deploy
      </button>
      <p style={{ fontSize: '0.7rem', lineHeight: 1.1, marginTop: '0.5rem' }}>
        This button is disabled in dev mode.
      </p>
    </article>
  );
}
