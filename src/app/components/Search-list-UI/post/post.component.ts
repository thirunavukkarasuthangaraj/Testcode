import { Component, OnInit, TemplateRef } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  posts: string[] = ['com1', 'com1', 'com1', 'com1', 'com1', 'com1',]
  bsModalRef: BsModalRef;
  modalRef: BsModalRef;

  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    keyboard: false
  }

  constructor(
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
  }

  clearInput = new UntypedFormControl();

  clearData() {
    // this.businessData = true;
    this.clearInput.reset();
    //console.log('cleare Data')
  }

  openPostSearch(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.backdropConfig);
  }

  close(){
    //console.log('close Model')
    this.bsModalRef.hide()
  }
}
