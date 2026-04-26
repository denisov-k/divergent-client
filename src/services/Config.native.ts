type NativeConfigData = {
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

let p: Promise<unknown> | null = null;

const Config = {
  data: {
    app: {
      publicURL: "",
      scheme: "divergent",
    },
    api: {
      http: {
        baseURL: "",
      },
      telegram: {
        twaURL: "",
      },
    },
  } satisfies NativeConfigData,
  init() {
    if (!p) {
      p = new Promise((resolve, reject) => {
        const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || "";
        const publicURL = process.env.EXPO_PUBLIC_APP_PUBLIC_URL || baseURL;
        const scheme = process.env.EXPO_PUBLIC_APP_SCHEME || "divergent";

        if (!baseURL) {
          reject(
            new Error(
              "EXPO_PUBLIC_API_BASE_URL is not configured. Native runtime needs an explicit API origin."
            )
          );
          return;
        }

        this.data = {
          app: {
            publicURL,
            scheme,
          },
          api: {
            http: {
              baseURL,
            },
            telegram: {
              twaURL: process.env.EXPO_PUBLIC_TELEGRAM_BOT_URL || "",
            },
          },
        };

        resolve(this.data);
      });
    }

    return p;
  },
};

export default Config;
