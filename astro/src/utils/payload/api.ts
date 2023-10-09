export const URL = import.meta.env.DEV
  ? 'http://localhost:3001'
  : `${import.meta.env.PAYLOAD_URL}`;

export const apiFetch = async (url: string, options: any = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json'
      //   // TODO: only works if you add this header...
      //   Authorization: `JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1hY2tlbnppZWx1a2U5NEBnbWFpbC5jb20iLCJpZCI6IjY0ZjBmNmY0NGRlN2Y1ZDg4ZWYxNjc1YSIsImNvbGxlY3Rpb24iOiJ1c2VycyIsImlhdCI6MTY5Mzk1MTM1NCwiZXhwIjoxNjkzOTU4NTU0fQ.-n0ypBaTxP4Ojvm99Km-hsNf4oCm1r-D-RoSO3V5faw`
    },
    credentials: 'include'
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options
  };

  return fetch(url, mergedOptions).then((res) => {
    if (res.ok) {
      return res.json();
    }
    throw new Error(
      `Error fetching page data: ${res.statusText} (${res.status})}`
    );
  });
};
