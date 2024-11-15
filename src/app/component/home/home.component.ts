import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { SweetAlertService } from '../../service/sweet.alert.service';
import { ScholashipService } from '../../service/scholarship.service';
import Chart from 'chart.js/auto';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.compoent.css',
})
export class HomeComponent implements OnInit {
  expiringScholarship: number | undefined;
  countries: any[] = [];
  scholarshipsUpdatedLastWeek: number | undefined;
  chart: any = [];
  chart2: any = [];
  chart3: any = []; 
  chart4: any = [];
  countByMonth: any;
  fieldOfStudyId: any[] = [];
  topSearch: any[] = [];
  constructor(
    private authService: AuthService,
    private alert: SweetAlertService,
    private scholarshipSerivce: ScholashipService
  ) {}
  ngOnInit(): void {
    forkJoin([
      this.scholarshipSerivce.getExpiringScholarship(),
      this.scholarshipSerivce.getScholarshipsUpdatedLastWeek(),
      this.scholarshipSerivce.getScholarshipsByMonth(),
      this.scholarshipSerivce.getScholarshipsByCountry(),
      this.scholarshipSerivce.getScholarshipsByFieldOfStudy(),
      this.scholarshipSerivce.getScholarshipsByTopSearch(),
    ]).subscribe({
      next: ([
        expiringScholarshipResponse,
        updatedLastWeekResponse,
        countByMonthResponse,
        countByCountry,
        countByFieldOfStudy,
        countByTopSearch,
      ]) => {
        this.expiringScholarship = expiringScholarshipResponse.result;
        this.scholarshipsUpdatedLastWeek = updatedLastWeekResponse.result;
        this.countByMonth = countByMonthResponse.result;
        const monthlyData = Array(12).fill(0);
        Object.keys(this.countByMonth).forEach((key) => {
          const [year, month] = key.split('-').map(Number);
          if (year === 2024) {
            monthlyData[month - 1] = this.countByMonth[key];
          }
        });
        this.chart = new Chart('canvas', {
          type: 'bar',
          data: {
            labels: [
              'Jan',
              'Feb',
              'Mar',
              'Apr',
              'May',
              'Jun',
              'Jul',
              'Aug',
              'Sep',
              'Oct',
              'Nov',
              'Dec',
            ],
            datasets: [
              {
                label: 'Học bổng theo tháng',
                data: monthlyData,
                borderWidth: 1,
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
        this.countries = countByCountry.results.map((item: [any, number]) => ({
          name: item[0].name,
          code: item[0].code,
          continent: item[0].continent,
          scholarships: item[1],
        }));
        const countryLabels = this.countries.map((item) => item.name);
        const scholarshipData = this.countries.map((item) => item.scholarships);
        this.chart2 = new Chart('canvas2', {
          type: 'bar',
          data: {
            labels: countryLabels,
            datasets: [
              {
                label: 'Học bổng theo quốc gia',
                data: scholarshipData,
                borderWidth: 1,
                backgroundColor: 'rgba(255, 99, 71, 0.2)',
                borderColor: 'rgba(255, 99, 71, 1)',
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
        this.fieldOfStudyId = countByFieldOfStudy.results;
        const labelsF = this.fieldOfStudyId.map((item) => item[0]);
        const valuesF = this.fieldOfStudyId.map((item) => item[1]);
        const total = valuesF.reduce((acc, curr) => acc + curr, 0);
        const percentageValues = valuesF.map(value => (value / total * 100).toFixed(2));
        this.chart2 = new Chart('canvas3', {
          type: 'pie',
          data: {
            labels: labelsF,
            datasets: [
              {
                label: 'Thống kê theo chuyên ngành',
                data: percentageValues,
                borderWidth: 1,
                backgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                ],
                hoverBackgroundColor: [
                  '#FF6384',
                  '#36A2EB',
                  '#FFCE56',
                  '#4BC0C0',
                  '#9966FF',
                ],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: function (tooltipItem) {
                    return (
                      tooltipItem.label + ': ' + tooltipItem.raw + '%'
                    );
                  },
                },
              },
            },
          },
        });
        this.topSearch = countByTopSearch.results;
        const labelsS = this.topSearch.map((item) => item.keyword);
        const valuesS = this.topSearch.map((item) => item.count);
        this.chart4 = new Chart('canvas4', {
          type: 'bar',
          data: {
            labels: labelsS,
            datasets: [
              {
                label: 'Hot Search',
                data: valuesS,
                borderWidth: 1,
                backgroundColor: '#FFFFE0',
                borderColor: '#FFD700',
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      },
    });
  }
  userName: string = localStorage.getItem('userName') || 'Unknow';
  logout() {
    this.alert.showConfirm('Cảnh bảo', 'Xác nhận đăng xuất').then((result) => {
      if (result.isConfirmed) {
        this.authService.logout().subscribe({
          next: (response) => {
            this.authService.removeToken();
            window.location.href = '/dang-nhap';
          },
          error: (error) => {
            console.log(error);
          },
        });
      }
    });
  }
}
