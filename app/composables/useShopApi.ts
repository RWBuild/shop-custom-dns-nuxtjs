const POS_TOKEN_KEY = 'guh-pos-token';
const POS_TOKEN_EXPIRY_KEY = 'guh-pos-token-expiry';

interface PosTokenResponse {
  access_token: string;
  expires_at: string;
  created_at: string;
  service_url: string;
}

export function useShopApi() {
  const config = useRuntimeConfig();

  async function getPosToken(): Promise<string | null> {
    if (!import.meta.client) return null;

    const cachedToken = localStorage.getItem(POS_TOKEN_KEY);
    const cachedExpiry = localStorage.getItem(POS_TOKEN_EXPIRY_KEY);

    if (cachedToken && cachedExpiry) {
      const expiryDate = new Date(cachedExpiry);
      if (expiryDate > new Date()) {
        return cachedToken;
      }
      localStorage.removeItem(POS_TOKEN_KEY);
      localStorage.removeItem(POS_TOKEN_EXPIRY_KEY);
    }

    try {
      const response = await $fetch<PosTokenResponse>(
        `${config.public.shopBaseUrl}/api/custom-domain/request-pos-token`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${config.public.shopSecretKey}`,
          },
        }
      );

      localStorage.setItem(POS_TOKEN_KEY, response.access_token);
      localStorage.setItem(POS_TOKEN_EXPIRY_KEY, response.expires_at);

      return response.access_token;
    } catch (error) {
      console.error('Failed to fetch POS token:', error);
      return null;
    }
  }

  async function posFetch<T>(url: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> {
    const token = await getPosToken();

    if (!token) {
      throw new Error('Failed to authenticate with POS service');
    }

    return $fetch(url, {
      baseURL: config.public.posBaseUrl as string,
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    }) as Promise<T>;
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

  function clearPosToken() {
    if (import.meta.client) {
      localStorage.removeItem(POS_TOKEN_KEY);
      localStorage.removeItem(POS_TOKEN_EXPIRY_KEY);
    }
  }

  return {
    shopFetch,
    posFetch,
    getPosToken,
    clearPosToken,
  };
}
