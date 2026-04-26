import axios, { AxiosResponse } from "axios";

let p: Promise<unknown> | null = null;

const BASE_URL = "/config/{env}.json";
const http = axios.create();

function resolveRuntimeEnv() {
  if (typeof window === "undefined") {
    return process.env.NODE_ENV || "production";
  }

  const { hostname } = window.location;

  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".ngrok-free.dev") ||
    hostname.endsWith(".ngrok.io")
  ) {
    return "development";
  }

  return "production";
}

interface ConfigInterface {
  data: {
    app: {
      publicURL: string;
      scheme: string;
    };
    api: {
      http: {
        baseURL: string;
      };
      telegram: {
        twaURL: string;
      };
    };
  };
  init(): Promise<unknown>;
  _loadEnv(envCurrent: string | undefined): Promise<AxiosResponse>;
}

const Config: ConfigInterface = {
  data: {
    app: {
      publicURL: "",
      scheme: "",
    },
    api: {
      http: {
        baseURL: "",
      },
      telegram: {
        twaURL: "",
      },
    },
  },
  init() {
    if (!p) {
      p = new Promise((resolve, reject) => {
        return Promise.all([this._loadEnv(resolveRuntimeEnv())]).then(([envResponse]) => {
          if (typeof envResponse.data !== "object") {
            return reject("Bad config file");
          }

          const nextData = envResponse.data as Partial<ConfigInterface["data"]>;
          this.data = {
            app: {
              publicURL: nextData.app?.publicURL || "",
              scheme: nextData.app?.scheme || "",
            },
            api: {
              http: {
                baseURL: nextData.api?.http?.baseURL || "",
              },
              telegram: {
                twaURL: nextData.api?.telegram?.twaURL || "",
              },
            },
          };
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
