const LEGACY_POS_TOKEN_KEYS = ['guh-pos-token', 'guh-pos-token-expiry'];
const POS_KEY_EXPIRY_MARGIN_MS = 60 * 1000;
const POS_KEY_WHOAMI = 'guest';

interface PosAccessKeyResponse {
  temp_access_key: string;
  expires_at: number;
}

interface CachedPosAccessKey {
  value: string;
  expiresAt: number;
}

let cachedPosAccessKey: CachedPosAccessKey | null = null;
let posAccessKeyRequest: Promise<string | null> | null = null;
let legacyKeysRemoved = false;

function removeLegacyPosTokens() {
  if (legacyKeysRemoved) return;
  legacyKeysRemoved = true;
  try {
    LEGACY_POS_TOKEN_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {
    return;
  }
}

function endOfTodayMs(): number {
  const end = new Date();
  end.setHours(23, 59, 59, 999);
  return end.getTime();
}

export function useShopApi() {
  const config = useRuntimeConfig();

  async function requestPosAccessKey(): Promise<string | null> {
    try {
      const response = await $fetch<PosAccessKeyResponse>('/api/pos-access-key');

      if (!response?.temp_access_key) {
        throw new Error('Unexpected access key response from the shop service');
      }

      cachedPosAccessKey = {
        value: response.temp_access_key,
        expiresAt: response.expires_at ? response.expires_at * 1000 : endOfTodayMs(),
      };

      return cachedPosAccessKey.value;
    } catch (error) {
      console.error('Failed to fetch POS access key:', error);
      return null;
    }
  }

  async function getPosToken(): Promise<string | null> {
    if (!import.meta.client) return null;

    removeLegacyPosTokens();

    if (
      cachedPosAccessKey &&
      Date.now() < cachedPosAccessKey.expiresAt - POS_KEY_EXPIRY_MARGIN_MS
    ) {
      return cachedPosAccessKey.value;
    }

    cachedPosAccessKey = null;

    if (!posAccessKeyRequest) {
      posAccessKeyRequest = requestPosAccessKey().finally(() => {
        posAccessKeyRequest = null;
      });
    }

    return posAccessKeyRequest;
  }

  function clearPosToken() {
    cachedPosAccessKey = null;
  }

  async function posFetch<T>(url: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> {
    const token = await getPosToken();

    if (!token) {
      throw new Error('Failed to authenticate with POS service');
    }

    try {
      return (await $fetch(url, {
        baseURL: config.public.posBaseUrl as string,
        ...options,
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-TEMP-ACCESS-KEY': token,
          'X-WHOMAI': POS_KEY_WHOAMI,
          ...options.headers,
        },
      })) as T;
    } catch (error) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 401 || status === 403) {
        clearPosToken();
      }
      throw error;
    }
  }

  const shopFetch = $fetch.create({
    baseURL: config.public.shopBaseUrl as string,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(config.public.shopPublicToken && {
        Authorization: `Bearer ${config.public.shopPublicToken}`,
      }),
    },
  });

  return {
    shopFetch,
    posFetch,
    getPosToken,
    clearPosToken,
  };
}
