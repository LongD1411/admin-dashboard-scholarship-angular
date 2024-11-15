import { Component, OnInit } from '@angular/core';
import { CountryResponse } from '../../response/country.response';
import { CountryService } from '../../service/country.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SweetAlertService } from '../../service/sweet.alert.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './country.component.html',
})
export class CountryComponent implements OnInit {
  userName: string = localStorage.getItem('userName') || "Unknow";
  countries: CountryResponse[] = [];
  keyword: string = '';
  currentPage: number = 1;
  limit: number = 10;
  pages: number[] = [];
  totalsPages: number = 0;
  visiblePages: (string | number)[] = [];
  constructor(
    private countryService: CountryService,
    private alert: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
    private authService:AuthService
  ) {}
  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const page = params['page'] || 1;
      this.keyword = params['keyword'] || '';
      this.currentPage = page;
      this.searchCountry(this.keyword, this.currentPage, this.limit);
    });
  }
  searchCountry(keyword: string, currentPage: number, limit: number) {
    this.countryService.getCountries(keyword, currentPage, limit).subscribe({
      next: (response) => {
        this.countries = response.results;
        this.totalsPages = response.totalPages;
        this.visiblePages = this.generateVisiblePageArray(
          this.currentPage,
          this.totalsPages
        );
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  searchCountryKeyword() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { keyword: this.keyword, page: this.currentPage },
      queryParamsHandling: 'merge', // Giữ lại các query params khác (nếu có)
    });
    this.searchCountry(this.keyword, this.currentPage, this.limit);
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalsPages) {
      this.currentPage = page;
      this.searchCountry(this.keyword!, this.currentPage, this.limit);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { page: this.currentPage },
        queryParamsHandling: 'merge',
      });
    }
  }
  changePageIfValid(page: string | number): void {
    if (typeof page === 'number') {
      this.changePage(page);
    }
  }
  generateVisiblePageArray(
    currentPage: number,
    totalPages: number
  ): (string | number)[] {
    const maxVisiblePage = 5;
    const halfVisiblePage = Math.floor(maxVisiblePage / 2);
    let startPage = Math.max(currentPage - halfVisiblePage, 1);
    let endPage = Math.min(startPage + maxVisiblePage - 1, totalPages);
    if (endPage - startPage + 1 < maxVisiblePage) {
      startPage = Math.max(endPage - maxVisiblePage + 1, 1);
    }
    // Xử lý dấu "..."
    const pagesArray = [];
    if (startPage > 1) {
      pagesArray.push(1);
      if (startPage > 2) pagesArray.push('...');
    }
    for (let i = startPage; i <= endPage; i++) {
      pagesArray.push(i);
    }
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pagesArray.push('...');
      pagesArray.push(totalPages);
    }
    return pagesArray;
  }
  navigateNewCountry() {
    window.location.href = '/quoc-gia/chinh-sua';
  }
  viewCountry(id: string) {
    window.location.href = `/quoc-gia/chinh-sua?code=${id}`;
  }
  deleteCoutry(code: string) {
    this.alert.showConfirm('Cảnh báo', 'Xác nhận xóa').then((result) => {
      if (result.isConfirmed) {
        this.countryService.deleteCountry(code).subscribe({
          next: (response) => {
            this.alert.showSuccess('Xóa thành công').then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            this.alert.showError(error.error.message);
          },
        });
      }
    });
  }
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
