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

/**
 * Функцию реализовывать здесь необязательно, но может помочь не плодить логику у GET-метода
 * На входе: объект. Пример: {a: 1, b: 2, c: {d: 123}, k: [1, 2, 3]}
 * На выходе: строка. Пример: ?a=1&b=2&c=[object Object]&k=1,2,3
 */
// function queryStringify(data) {
//     return "?" + Object.keys(data).map(key => key + '=' + data[key]).join('&');
// }

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

// function fetchWithRetry(url, options) {
//     let count = 0;
//     const catchErrors = () => {
//         if (options.retries > 1 && count < options.retries) {
//             count += 1;
//             return new HTTPTransport().get(url, options).then(response => new Response(response)).catch(catchErrors);
//         } else {
//             throw new Error('ресурс недоступен')
//         }
//     };
//     return new HTTPTransport().get(url, options).then(response => new Response(response)).catch(catchErrors);
// }
