import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router, RouterLink } from '@angular/router';
import { FieldOfStudyResponse } from '../../response/field.of.study.response';
import { CommonModule } from '@angular/common';
import { SchoolService } from '../../service/school.service';
import { SchoolResponse } from '../../response/school.response';
import { ScholashipResponse } from '../../response/scholarship.response';
import { ScholashipService } from '../../service/scholarship.service';
import { SweetAlertService } from '../../service/sweet.alert.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-field.of.study',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './scholarship.component.html',
})
export class ScholarshipComponent implements OnInit {
  userName: string = localStorage.getItem('userName') || 'Unknow';
  scholarships: ScholashipResponse[] = [];
  keyword: string = '';
  currentPage: number = 1;
  limit: number = 10;
  pages: number[] = [];
  totalsPages: number = 0;
  visiblePages: (number | string)[] = [];
  constructor(
    private scholarshipService: ScholashipService,
    private alert: SweetAlertService,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const page = params['page'] || 1;
      this.keyword = params['keyword'] || '';
      this.currentPage = page;
      this.searchSchools(this.keyword, this.currentPage, this.limit);
    });
  }
  searchSchools(keyword: string, currentPage: number, limit: number) {
    this.scholarshipService
      .getScholarships(keyword, currentPage, limit)
      .subscribe({
        next: (response) => {
          this.scholarships = response.results;
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
  searchKeyword() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { keyword: this.keyword, page: this.currentPage },
      queryParamsHandling: 'merge',
    });
    this.searchSchools(this.keyword, this.currentPage, this.limit);
  }
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalsPages) {
      this.currentPage = page;
      this.searchSchools(this.keyword!, this.currentPage, this.limit);
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
  createScholarship() {
    window.location.href = '/hoc-bong/chinh-sua';
  }
  viewScholarship(id: number) {
    window.location.href = `/hoc-bong/chinh-sua?id=${id}`;
  }
  deleteScholarsip(id: number) {
    this.alert.showConfirm('Cảnh báo', 'Xác nhận xóa').then((result) => {
      if (result.isConfirmed) {
        this.scholarshipService.deleteScholarship(id.toString()).subscribe({
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
