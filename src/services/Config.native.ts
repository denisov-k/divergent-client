type NativeConfigData = {
  api: {
    http: {
      baseURL: string;
    };
    telegram: {
      twaURL: string;
    };
    ton: {
      manifestURL: string;
      wallet: string;
    };
  };
};

let p: Promise<unknown> | null = null;

const Config = {
  data: {
    api: {
      http: {
        baseURL: "",
      },
      telegram: {
        twaURL: "",
      },
      ton: {
        manifestURL: "",
        wallet: "",
      },
    },
  } satisfies NativeConfigData,
  init() {
    if (!p) {
      p = new Promise((resolve, reject) => {
        const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL || "";

        if (!baseURL) {
          reject(
            new Error(
              "EXPO_PUBLIC_API_BASE_URL is not configured. Native runtime needs an explicit API origin."
            )
          );
          return;
        }

        this.data = {
          api: {
            http: {
              baseURL,
            },
            telegram: {
              twaURL: process.env.EXPO_PUBLIC_TELEGRAM_BOT_URL || "",
            },
            ton: {
              manifestURL: process.env.EXPO_PUBLIC_TON_MANIFEST_URL || "",
              wallet: process.env.EXPO_PUBLIC_TON_WALLET || "",
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
