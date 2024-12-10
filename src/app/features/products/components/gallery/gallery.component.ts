import { NgOptimizedImage } from '@angular/common'
import {
  ChangeDetectionStrategy,
  Component,
  input,
  linkedSignal
} from '@angular/core'
import { provideImageLoader } from '../../providers/image-loader.provider'

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './gallery.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'flex gap-4 grid-cols-2 flex-col-reverse lg:flex-row' },
  providers: [provideImageLoader()]
})
export class GalleryComponent {
  public readonly images = input.required<string[]>()

  public readonly preview = linkedSignal<string>(
    () => this.images()?.at(0) ?? ''
  )
}
