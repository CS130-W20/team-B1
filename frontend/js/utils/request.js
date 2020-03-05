const checkFetchResponse = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  return response.json().then(data => {
    const error = new Error(data.error);
    throw error;
  });
};

const _request = (url, options = {}) => {
  const defaults = { credentials: 'same-origin' };
  const defaultedOptions = Object.assign({}, defaults, options);

  return fetch(url, defaultedOptions)
    .then(checkFetchResponse)
    .then(res => {
      if (res.status == 204) // HTTP_NO_CONTENT
        return;
      else 
        return res.json();
    });
};

export default _request;
