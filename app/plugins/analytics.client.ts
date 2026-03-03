import { analyticInit } from 'system-analytic-log';

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const { shopSlug } = useShopInfo();

  analyticInit({
    backendUrl: `${config.public.shopBaseUrl}/api`,
    submitAfter: 5000,
    tenant_id: shopSlug.value || (config.public.shopSlug as string),
    showInConsole: false,
    htmlDomSettings: {
      attributePrefix: 'data-sa',
      singleSubmission: false,
    },
    onSubmitSucceeded: () => {},
    onSubmitFailed: () => {},
  });
});
