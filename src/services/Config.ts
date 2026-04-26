import axios, { AxiosResponse } from "axios";

let p: Promise<unknown> | null = null;

const ENV_CURRENT = process.env.NODE_ENV;
const BASE_URL = "/config/{env}.json";
const http = axios.create();

interface ConfigInterface {
  data: {
    api: {
      http: {
        baseURL: string;
      };
      ton: {
        manifestURL: string;
        wallet: string;
      };
    };
  };
  init(): Promise<unknown>;
  _loadEnv(envCurrent: string | undefined): Promise<AxiosResponse>;
}

const Config: ConfigInterface = {
  data: {
    api: {
      http: {
        baseURL: "",
      },
      ton: {
        manifestURL: "",
        wallet: "",
      },
    },
  },
  init() {
    if (!p) {
      p = new Promise((resolve, reject) => {
        return Promise.all([this._loadEnv(ENV_CURRENT)]).then(([envResponse]) => {
          if (typeof envResponse.data !== "object") {
            return reject("Bad config file");
          }
          this.data = { ...envResponse.data };
          resolve(this.data);
        });
      });
    }
    return p;
  },
  _loadEnv(env?: string) {
    return http.request({
      method: "get",
      url: BASE_URL.replace("{env}", env || "production"),
    });
  },
};

export default Config;
