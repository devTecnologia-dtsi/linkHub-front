import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
// amCharts imports
import * as am5 from '@amcharts/amcharts5';
import * as am5xy from '@amcharts/amcharts5/xy';
import am5themes_Animated from '@amcharts/amcharts5/themes/Animated';
import { PieChart } from '@amcharts/amcharts5/.internal/charts/pie/PieChart';
import { PieSeries } from '@amcharts/amcharts5/.internal/charts/pie/PieSeries';
import { DashboardService } from '../../service/dashboard/dashboard.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';

@Component({
  selector: 'app-welcome',
  standalone: true,
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
  imports: [NzSpinModule]
})
export class WelcomeComponent implements OnInit, AfterViewInit, OnDestroy {
  dashboardData: any = [];
  isLoading: boolean = true;
  private root!: am5.Root;

  constructor(
    private dashboardService: DashboardService,
    private message: NzMessageService
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.dashboardService.getLanguageByProjects().subscribe(
      (data: any) => {
        if (data.ok !== undefined && data.ok === false) {
          this.message.error('¡Ups! Hubo un error al obtener las bases de datos', { nzDuration: 2500 });
          return;
        }
        this.isLoading = false;
        this.dashboardData = data.data.data;
        this.createChart();
      },
      (error) => {
        this.isLoading = false;
        this.message.error('¡Ups! Hubo un error al cargar los datos', { nzDuration: 2500 });
        console.error(error);
      }
    );
  }

  ngAfterViewInit() {
    if (!this.isLoading && this.dashboardData.length > 0) {
      this.createChart();
    }
  }

  createChart() {
    if (!this.dashboardData || this.dashboardData.length === 0) {
      console.warn('No hay datos para mostrar el gráfico.');
      return;
    }

    if (this.root) {
      this.root.dispose();
    }

    this.root = am5.Root.new('chartdiv');
    this.root.setThemes([am5themes_Animated.new(this.root)]);

    let chart = this.root.container.children.push(
      PieChart.new(this.root, {})
    );

    let series = chart.series.push(
      PieSeries.new(this.root, {
        name: 'Series',
        categoryField: 'lenguaje',
        valueField: 'cantidad',
      })
    );

    series.appear();
    chart.appear();

    series.data.setAll(this.dashboardData);

    let legend = chart.children.push(
      am5.Legend.new(this.root, {
        centerX: am5.percent(50),
        x: am5.percent(50),
        layout: this.root.horizontalLayout,
        paddingTop: 5,
      })
    );

    legend.data.setAll(series.dataItems);

    this.root.events.on('frameended', () => {
      if (this.root.dom.clientWidth < 600) {
        legend.setAll({
          layout: this.root.verticalLayout,
        });
      } else {
        legend.setAll({
          layout: this.root.horizontalLayout,
        });
      }
    });
  }


  ngOnDestroy() {
    if (this.root) {
      this.root.dispose();
    }
  }
}
