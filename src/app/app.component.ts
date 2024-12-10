import { Component } from '@angular/core'
import { RouterOutlet } from '@angular/router'

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  host: { class: 'container block py-4 xl:py-8' }
})
export class AppComponent {}
