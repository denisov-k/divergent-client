import axios, {AxiosInstance} from 'axios';
import Config from './Config'

/**
 * Http transport
 * @param {object} options дефолтные настройки @default {} @see https://www.npmjs.com/package/axios
 */
export default class ServiceTransport {
    private axios: AxiosInstance;

    constructor(options?: never) {
        this.axios = axios.create(options);
    }

    /**
     * Создает новый http request
     * @param {string} url                  ссылка api метода @example '/user/edit'
     * @param {object} params               params @default {}
     * @param {function} responseHandler    custom response handler,который орабатывает response @default null @example (response) => { return response.data; }
     * @param {string} method               method @default 'get'
     * @param {object} options              request options @default {} @see https://www.npmjs.com/package/axios
     * @return {Promise}                    promise, имеет параметр 'id' для отмены request @see this.cancelRequest()
     */
    request(url: string, params: object = {}, method: string = 'get', options: object = {}): Promise<any> {
        const request = {
            method,
            baseURL: Config["data"]["api"]["http"]["baseURL"],
            url: url, withCredentials: true,
            params: {},
            data: {},
            ...options
        };

        request[method === 'get' ? 'params' : 'data'] = params;

        return this.axios.request(request)
    }
}