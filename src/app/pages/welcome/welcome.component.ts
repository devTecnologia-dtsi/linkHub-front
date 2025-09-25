import { Component } from '@angular/core';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  imports: [NzSpinModule],
})
export class WelcomeComponent {
  constructor() {}

  ngOnInit() {
    // this.isLoading = true;
    // this.dashboardService.getLanguageByProjects().subscribe(
    //   (data: any) => {
    //     if (data.ok !== undefined && data.ok === false) {
    //       this.message.error('¡Ups! Hubo un error al obtener las bases de datos', { nzDuration: 2500 });
    //       return;
    //     }
    //     this.isLoading = false;
    //     this.dashboardData = data.data.data;
    //     // this.createChart();
    //   },
    //   (error) => {
    //     this.isLoading = false;
    //     this.message.error('¡Ups! Hubo un error al cargar los datos', { nzDuration: 2500 });
    //     console.error(error);
    //   }
    // );
  }
}
