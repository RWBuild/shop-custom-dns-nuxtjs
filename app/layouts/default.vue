<script setup lang="ts">
const appConfig = useAppConfig()
const runtimeConfig = useRuntimeConfig()

const store = (appConfig.store ?? {}) as {
  name?: string
  description?: string
  logo?: string
  contact?: { email?: string; phone?: string; address?: string }
  social?: { twitter?: string; facebook?: string; instagram?: string }
}

const siteUrl = (runtimeConfig.public.siteUrl as string) || ''
const storeName = store.name || 'Store'
const storeDescription = store.description || ''
const storeLogo = store.logo || '/logo.png'

useSchemaOrg([
  defineOrganization({
    name: storeName,
    description: storeDescription,
    url: siteUrl,
    logo: `${siteUrl}${storeLogo}`,
    email: store.contact?.email,
    telephone: store.contact?.phone,
    sameAs: [
      store.social?.twitter ? `https://twitter.com/${store.social.twitter.replace('@', '')}` : '',
      store.social?.facebook ? `https://facebook.com/${store.social.facebook}` : '',
      store.social?.instagram ? `https://instagram.com/${store.social.instagram}` : ''
    ].filter(Boolean)
  }),
  defineWebSite({
    name: storeName,
    url: siteUrl,
    description: storeDescription,
    potentialAction: {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': `${siteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  })
])
</script>

<template>
  <div class="flex flex-col min-h-screen bg-white">
    <AppNavbar />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
