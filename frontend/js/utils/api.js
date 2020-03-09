import _request from './request';

export const loginWithSpotify = () => {
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

export const searchSpotify = (data) => {
  data['refresh_token'] = localStorage.getItem('refresh_token');
  console.log(data)
  return _request('http://localhost:8000/spotify/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
}
