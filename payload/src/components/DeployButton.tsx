import React from 'react';

export default function DeployButton() {
  const IS_DEV = process.env.NODE_ENV === 'development';

  const [isDeploying, setIsDeploying] = React.useState(false);

  const triggerDeployWebhook = async (e) => {
    e.preventDefault();
    setIsDeploying(true);
    // TODO: get buddy webhook from env - wasn't working in prod
    // const buddyWebhook = process.env.REACT_APP_BUDDY_WEBHOOK;
    // console.log('BUDDY WEBHOOK', buddyWebhook);

    // const response = await fetch(buddyWebhook);
    const response = await fetch(
      'https://app.buddy.works/lukes-personal-workspace/for-the-records-astro-payload/pipelines/pipeline/487913/trigger-webhook?token=e1cdc98bec1cfc0886f4ee33c5d410a0333fca6bad48b2d2c6cd4ae29d0a283ad95fc8a7a4c71cb2fb48b17a533cdc8d'
    );

    if (response.ok) {
      alert('Deploy from MAIN BRANCH triggered!');
    } else {
      alert('Something went wrong. Please try again.');
    }
    setIsDeploying(false);
  };

  return (
    <article
      style={{ marginTop: `2rem` }}
      title="REMEMBER: this deploys from the MAIN branch!"
    >
      <img
        id="buddy-badge"
        src="https://app.buddy.works/lukes-personal-workspace/for-the-records-astro-payload/pipelines/pipeline/487913/badge.svg?token=1e5f39bef2f6738c3985cd62b49f197c31ac10d132287f274d7c391c8ce56cd2"
        alt="Buddy CI badge"
      />

      <button
        disabled={IS_DEV}
        style={{
          border: `none`,
          backgroundColor: `${IS_DEV ? 'lightgray' : 'darkslateblue'}`,
          color: `white`,
          padding: '.5rem 1rem',
          borderRadius: '5px',
          fontWeight: 'bold',
          marginTop: '1rem',
          width: '100%',
          cursor: 'pointer',
          opacity: IS_DEV ? 0.5 : 1
        }}
        onClick={triggerDeployWebhook}
      >
        {isDeploying ? 'Deploying...' : 'Deploy'}
      </button>
      {IS_DEV && (
        <p style={{ fontSize: '0.8rem', lineHeight: 1.1, marginTop: '0.5rem' }}>
          This button is disabled in dev mode.
        </p>
      )}
    </article>
  );
}
