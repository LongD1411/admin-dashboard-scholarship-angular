import { Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  constructor(
    private renderer: Renderer2
  ){}
  ngOnInit(): void {
    this.loadScript('assets/vendor/jquery/jquery.min.js');
    this.loadScript('assets/vendor/bootstrap/js/bootstrap.bundle.min.js');
    this.loadScript('assets/vendor/jquery-easing/jquery.easing.min.js');
    this.loadScript('assets/js/sb-admin-2.min.js');
    this.loadScript('assets/vendor/chart.js/Chart.min.js');
    this.loadScript('assets/js/demo/chart-area-demo.js');
    this.loadScript('assets/js/demo/chart-pie-demo.js');
  }
  loadScript(src: string) {
    const script = this.renderer.createElement('script');
    script.src = src;
    script.type = 'text/javascript';
    script.async = true;
    this.renderer.appendChild(document.body, script);
  }
}
