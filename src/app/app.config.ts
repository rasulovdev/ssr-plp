import { provideHttpClient, withFetch } from '@angular/common/http'
import {
  ApplicationConfig,
  inject,
  provideZoneChangeDetection
} from '@angular/core'
import {
  provideClientHydration,
  withEventReplay,
  withIncrementalHydration
} from '@angular/platform-browser'
import { provideRouter } from '@angular/router'
import { InMemoryCache } from '@apollo/client/core'
import { provideApollo } from 'apollo-angular'
import { HttpLink } from 'apollo-angular/http'
import { routes } from './app.routes'

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay(), withIncrementalHydration()),
    provideHttpClient(withFetch()),
    provideApollo(() => {
      const httpLink = inject(HttpLink)

      return {
        link: httpLink.create({
          uri: 'https://fake-ecommerce-api-5oof.onrender.com/graphql'
        }),
        cache: new InMemoryCache()
      }
    })
  ]
}
