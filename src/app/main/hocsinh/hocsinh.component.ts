import { MustMatch } from '../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild, Input  } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators} from '@angular/forms';
import {FormControl, FormGroup} from '@angular/forms' 
import { BaseComponent } from '../../lib/base.component';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/takeUntil';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2/dist/sweetalert2.js'; 
declare var $: any;

@Component({
  selector: 'app-hocsinh',
  templateUrl: './hocsinh.component.html',
  styleUrls: ['./hocsinh.component.css']
})
export class HocsinhComponent extends BaseComponent implements OnInit {
  public hocsinh: any;
  public hocsinhs: any;
  public lophocs:any;
  public totalRecords:any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;  
  public showUpdateModal:any;
  public isCreate:any;
  public MaLophoc: any;
  public KhoiHoc: any
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector,private datePipe: DatePipe) {
    super(injector);
  }
  

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'hoten': [''],     
    });
    this._api.get('/api/lophoc/get-all').takeUntil(this.unsubscribe).subscribe(res => {
      this.lophocs= res;
      });
   this.search();
  }

  loadPage(page) { 
    this._api.post('/api/hocsinh/search',{page: page, pageSize: this.pageSize, hoten: this.formsearch.get('hoten').value, malophoc: this.MaLophoc, khoihoc:this.KhoiHoc}).takeUntil(this.unsubscribe).subscribe(res => {
      this.hocsinhs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  } 

  search() { 
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/hocsinh/search',{page: this.page, pageSize: this.pageSize, hoten: this.formsearch.get('hoten').value, malophoc: this.MaLophoc, khoihoc:this.KhoiHoc}).takeUntil(this.unsubscribe).subscribe(res => {
      this.hocsinhs = res.data;
      this.totalRecords =  res.totalItems;
      this.pageSize = res.pageSize;
      });
  }


  get f() { return this.formdata.controls; }

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    } 
    if(this.isCreate) { 
      let ngay =this.datePipe.transform(value.NgaySinh,"yyyy-MM-dd");
        let tmp = {
           MaHS:value.MaHS,
           MaLopHoc:value.MaLopHoc,
           TenHS:value.TenHS,
           GioiTinh:value.GioiTinh,
           NgaySinh:ngay,
           noisinh: value.NoiSinh,
           dantoc: value.DanToc,
           hotencha:value.HoTenCha,
           hotenme:value.HoTenMe,
           passwordhs: value.Password          
          };
        this._api.post('/api/hocsinh/create-hoc-sinh',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          Swal.fire(
            'Đã thêm!',
            'Thêm thành công',
            'success'
          );
          this.search();
          this.closeModal();
          });
    } else { 
      let ngay =this.datePipe.transform(value.NgaySinh,"yyyy-MM-dd");
        let tmp = {
          MaHS:value.MaHS,
           MaLopHoc:value.MaLopHoc,
           TenHS:value.TenHS,
           GioiTinh:value.GioiTinh,
           NgaySinh:ngay,
           noisinh: value.NoiSinh,
           dantoc: value.DanToc,
           hotencha:value.HoTenCha,
           hotenme:value.HoTenMe,
           passwordhs: value.Password          
          };
        this._api.post('/api/hocsinh/update-hoc-sinh',tmp).takeUntil(this.unsubscribe).subscribe(res => {
          Swal.fire(
            'Đã cập nhật!',
            'Cập nhật thành công',
            'success'
          );
          this.search();
          this.closeModal();
          });
    }
   
  } 

  onDelete(row) { 
    Swal.fire({
      title: 'Bạn có chắc muốn xoá?',
      text: 'Bạn sẽ không thể khôi phục bản ghi này!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Có',
      cancelButtonText: 'Không'
    }).then((result) => {
      if (result.value) {
        this._api.get('/api/diem/get-by-hs-hk/'+row.maHS+"/"+'22019').takeUntil(this.unsubscribe).subscribe(res => {
         let tmp = res;
         if(tmp)
         {
            this._api.post('/api/hocsinh/delete-hoc-sinh', { id: row.maHS }).takeUntil(this.unsubscribe).subscribe(res => {
              this.search();
            });
            Swal.fire(
              'Đã xoá!',
              'Bản ghi không thể khôi phục',
              'success'
            );
         }else {
          Swal.fire(
            'Thất bại!',
            'Bản ghi không thể xoá',
            'danger'
          );
         }
          });
      }
    });
  }

  Reset() {  
    this.hocsinh = null;
    this.formdata = this.fb.group({
      'MaHS': ['', Validators.required],
      'MaLopHoc': ['', Validators.required],
      'TenHS': ['', Validators.required],
      'GioiTinh': ['', Validators.required],
      'NgaySinh': ['', Validators.required],
      'NoiSinh': ['', Validators.required],
      'DanToc': ['', Validators.required],
      'HoTenCha': ['', Validators.required],
      'HoTenMe': ['', Validators.required],
      'Password': ['', Validators.required],
    }); 
    this.formdata.get('MaLopHoc').setValue(this.lophocs[0].maLopHoc);
    this.formdata.get('GioiTinh').setValue("Nam");
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.hocsinh = null;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this.formdata = this.fb.group({
        'MaHS': ['', Validators.required],
        'MaLopHoc': ['', Validators.required],
        'TenHS': ['', Validators.required],
        'GioiTinh': ['', Validators.required],
        'NgaySinh': ['', Validators.required],
        'NoiSinh': ['', Validators.required],
        'DanToc': ['', Validators.required],
        'HoTenCha': ['', Validators.required],
        'HoTenMe': ['', Validators.required],
        'Password': ['', Validators.required],
      });
      this.formdata.get('MaLopHoc').setValue(this.lophocs[0].maLopHoc);
      this.formdata.get('GioiTinh').setValue("Nam");
      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true; 
    this.isCreate = false;
    setTimeout(() => {
      $('#createUserModal').modal('toggle');
      this._api.get('/api/hocsinh/get-by-id/'+ row.maHS).takeUntil(this.unsubscribe).subscribe((res:any) => {
        this.hocsinh = res; 
        let ngay =this.datePipe.transform(this.hocsinh.ngaySinh,"yyyy-MM-dd");
        
          this.formdata = this.fb.group({
            'MaHS': [this.hocsinh.maHS, Validators.required],
            'MaLopHoc': [this.hocsinh.maLopHoc, Validators.required],
            'TenHS': [this.hocsinh.tenHS, Validators.required],
            'GioiTinh': [this.hocsinh.gioiTinh, Validators.required],
            'NgaySinh': [ngay, Validators.required],
            'NoiSinh': [this.hocsinh.noisinh, Validators.required],
            'DanToc': [this.hocsinh.dantoc, Validators.required],
            'HoTenCha': [this.hocsinh.hotencha],
            'HoTenMe': [this.hocsinh.hotenme],
            'Password': [this.hocsinh.passwordhs, Validators.required],
          });
          // this.formdata.get('MaLopHoc').setValue(this.hocsinh.maLopHoc); 
          this.doneSetupForm = true;
        }); 
    }, 100);
  }

  closeModal() {
    $('#createUserModal').closest('.modal').modal('hide');
  }

  changedLop(e) {
    this.MaLophoc = e;
    this.search()
  }
  changedKhoi(e) {
    this.KhoiHoc = e;
    this.search();
  }
}
