import queryString from './queryString';

type Options = {
  data?: object;
  timeout?: number | undefined;
  method?: string;
  headers?: string | { [key: string]: string };
};

const METHODS = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

class HTTPTransport {
  get = (url: string, options: Options = {}) => {
    if (typeof options?.data === 'object') {
      url = url + queryString(options.data as Options);
    }
    return this.request(
      url,
      { ...options, method: METHODS.GET },
      options?.timeout,
    );
  };

  put = (url: string, options: Options = {}) => {
    return this.request(
      url,
      { ...options, method: METHODS.PUT },
      options?.timeout,
    );
  };

  post = (url: string, options: Options = {}) => {
    return this.request(
      url,
      { ...options, method: METHODS.POST },
      options?.timeout,
    );
  };

  delete = (url: string, options: Options = {}) => {
    return this.request(
      url,
      { ...options, method: METHODS.DELETE },
      options?.timeout,
    );
  };

  request = (url: string, options: Options, timeout = 5000) => {
    const { method, headers, data } = options;

    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method as string, url);

      if (typeof headers === 'object') {
        Object.keys(headers).forEach(key => {
          xhr.setRequestHeader(key, headers[key]);
        });
      }

      xhr.timeout = timeout;
      xhr.onload = function () {
        resolve(xhr);
      };
      xhr.onabort = reject;
      xhr.onerror = reject;
      xhr.ontimeout = reject;
      xhr.withCredentials = true;
      if (method === METHODS.GET || !data) {
        xhr.send();
      } else {
        if (method === METHODS.PUT && !(typeof headers === 'object')) {
          // @ts-ignore
          xhr.send(data);
        } else {
          // @ts-ignore
          xhr.send(JSON.stringify(data));
        }
      }
    });
  };
}

const xhr = new HTTPTransport();
export { xhr };
