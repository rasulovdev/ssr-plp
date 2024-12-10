import { provideHttpClient, withFetch } from '@angular/common/http'
import {
  ApplicationConfig,
  inject,
  makeStateKey,
  provideExperimentalZonelessChangeDetection,
  TransferState
} from '@angular/core'
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration
} from '@angular/platform-browser'
import { provideRouter, withPreloading } from '@angular/router'
import { InMemoryCache, NormalizedCacheObject } from '@apollo/client/core'
import { provideApollo } from 'apollo-angular'
import { HttpLink } from 'apollo-angular/http'
import { hoverPrefetchProviders, HoverPreloadStrategy } from 'ngx-hover-preload'
import { routes } from './app.routes'

const APOLLO_STATE_KEY = makeStateKey<NormalizedCacheObject>('apollo.state')

export const appConfig: ApplicationConfig = {
  providers: [
    provideExperimentalZonelessChangeDetection(),
    hoverPrefetchProviders,
    provideRouter(routes, withPreloading(HoverPreloadStrategy)),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideHttpClient(withFetch()),
    provideApollo(() => {
      const httpLink = inject(HttpLink)
      const transferState = inject(TransferState)
      const cache = new InMemoryCache()
      const isBrowser = transferState.hasKey(APOLLO_STATE_KEY)

      if (isBrowser) {
        cache.restore(transferState.get(APOLLO_STATE_KEY, {}))
      } else {
        transferState.onSerialize(APOLLO_STATE_KEY, () => {
          const result = cache.extract()
          // Reset cache after extraction to avoid sharing between requests
          cache.reset()
          return result
        })
      }

      return {
        link: httpLink.create({
          uri: 'https://fake-ecommerce-api-5oof.onrender.com/graphql'
        }),
        cache
      }
    })
  ]
}
