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
      'https://app.buddy.works/lukes-personal-workspace/for-the-records-astro-payload/pipelines/pipeline/469266/trigger-webhook?token=e1cdc98bec1cfc0886f4ee33c5d410a00abc220c46d8bfda6ce72655f52245a5c6985e61c24d32a464441b7d46525402'
    );
    console.log(response);

    // https://api.buddy.works/workspaces/lukes-personal-workspace/projects/for-the-records-astro-payload/pipelines/469266/executions/65257c9ba8d1657753b3f3a3

    if (response.ok) {
      alert('Deploy triggered!');

      // refresh buddy badge img to see build progress
      refreshBuddyBadge();
    }
    setIsDeploying(false);
  };

  // TODO: refresh automatically every X secs until build is complete
  const refreshBuddyBadge = () => {
    const buddyBadge = document.getElementById(
      'buddy-badge'
    ) as HTMLImageElement;
    buddyBadge.src = buddyBadge.src;
  };

  return (
    <article style={{ marginTop: `2rem` }}>
      <div
        style={{
          display: 'flex',

          alignItems: 'center'
        }}
      >
        <img
          id="buddy-badge"
          src="https://app.buddy.works/lukes-personal-workspace/for-the-records-astro-payload/pipelines/pipeline/469266/badge.svg?token=1e5f39bef2f6738c3985cd62b49f197c31ac10d132287f274d7c391c8ce56cd2"
          alt="Buddy CI badge"
        />
        {/* refresh button */}
        <button
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            padding: 0,
            marginLeft: '.5rem',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
          onClick={refreshBuddyBadge}
        >
          🔄
        </button>
      </div>

      <button
        disabled={IS_DEV}
        style={{
          border: `none`,
          backgroundColor: `${IS_DEV ? 'lightgray' : 'darkslategra'}`,
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
