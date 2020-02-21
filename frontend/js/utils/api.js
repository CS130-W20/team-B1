import _request from './request';

export const loginWithSpotify = (data) => {
  return _request('http://localhost:8000/login/', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
  });
};

export const loginToDirector = (data) => {
  return _request('http://localhost:8000/login/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
};
