import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common'

export function provideImageLoader() {
  return {
    provide: IMAGE_LOADER,
    useValue: (config: ImageLoaderConfig) => {
      return config.src.replace(
        '.jpeg',
        `${config.loaderParams?.['size'] ?? ''}.jpeg`
      )
    }
  }
}
