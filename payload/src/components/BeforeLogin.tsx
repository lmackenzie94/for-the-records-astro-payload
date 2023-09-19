import React from 'react';

const BeforeLogin: React.FC = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        maxWidth: 400,
        margin: '1rem auto'
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="100"
        height="100"
        style={{
          animation: 'spin 3s linear infinite'
        }}
      >
        <path
          d="M50.5 1.5c-26.512 0-48 21.488-48 48s21.488 48 48 48 48-21.488 48-48-21.488-48-48-48Zm25.844 64.203a1.5 1.5 0 0 1 2.543 1.594C72.71 77.133 62.097 83 50.5 83a1.5 1.5 0 0 1 0-3c10.559 0 20.223-5.344 25.844-14.297ZM16.449 30a1.5 1.5 0 0 1-1.277-2.29C22.8 15.368 36.008 8 50.5 8a1.5 1.5 0 0 1 0 3c-13.445 0-25.7 6.84-32.773 18.29-.274.44-.758.71-1.278.71Zm8.203 3.297a1.498 1.498 0 0 1-1.27.703 1.5 1.5 0 0 1-.796-.227 1.501 1.501 0 0 1-.473-2.07C28.29 21.867 38.903 16 50.5 16a1.5 1.5 0 0 1 0 3c-10.559 0-20.227 5.344-25.848 14.297ZM31.5 49.5c0-10.492 8.508-19 19-19s19 8.508 19 19-8.508 19-19 19-19-8.508-19-19Zm19 41.5a1.5 1.5 0 0 1 0-3c13.445 0 25.695-6.836 32.773-18.29a1.505 1.505 0 0 1 2.067-.487c.703.437.922 1.363.484 2.066C78.2 83.63 64.992 91 50.5 91Zm4-41.5c0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4 4-1.79 4-4Zm0 0"
          style={{
            stroke: 'none',
            fillRule: 'nonzero',
            fill: '#272727',
            fillOpacity: 1,
            transform: 'scale(0.5)',
            transformOrigin: 'center'
          }}
        />
      </svg>
      <h1 style={{ margin: 0, fontSize: '2rem' }}>For The Records.</h1>
    </div>
  );
};

export default BeforeLogin;
