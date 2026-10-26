interface PosAccessKeyResponse {
  temp_access_key: string;
  expires_at: number;
  service_url: string;
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);

  setResponseHeader(event, 'Cache-Control', 'no-store');

  try {
    const response = await $fetch<PosAccessKeyResponse>(
      `${config.public.shopBaseUrl}/api/custom-domain/request-pos-token`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${config.shopSecretKey}`,
        },
      }
    );

    return {
      temp_access_key: response.temp_access_key,
      expires_at: response.expires_at,
    };
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Failed to fetch POS access key' });
  }
});
