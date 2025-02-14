import { Component, OnInit, ViewChild } from '@angular/core';
import { UserCardConfig } from 'src/app/types/UserCardConfig';
import { UtilService } from 'src/app/services/util.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { exists } from 'fs';

@Component({
  selector: 'app-page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PageListComponent implements OnInit {
  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  mycommunities = false;
  communityDetails;
  showLessCommunity = false;
  showMoreCommunity = false;
  businessPage = false;
  organizationList: any;
  businessExistList: any;
  businessPendingList: any;
  chooseBusinessPage: UntypedFormGroup;
  businessdetail;
  startPageCom: number;
  paginationLimitCom: number;
  comm: any;
  startPageBus;
  paginationLimitBus;
  userCardConfig: UserCardConfig[] = []
  showLessBus = false;
  backdropConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    show: true
  }
  isModalShown = false;
  public config: PerfectScrollbarConfigInterface = {};

  constructor(private util: UtilService,
    private api: ApiService,
    private router: Router,
    private formBuilder: UntypedFormBuilder) {
    this.startPageCom = 0;
    this.paginationLimitCom = 5;
    this.startPageBus = 0;
    this.paginationLimitBus = 5;


  }

  ngOnInit() {
    this.companydetailsapicall()
    this.comunitydetailsapicall()
  }


  showModal(): void {
    this.isModalShown = true;

    //  this.modalRef = this.modalService.show( this.backdropConfig);
  }

  hideModal(): void {
    this.autoShownModal.hide();
  }

  onHidden(): void {
    this.isModalShown = false;
    this.formValidity = false;
  }
  // INVALID_USER_ID = "10000";
  // USER_NOT_PRESENT = "10001";
  // WORK_EXP_NOT_PRESENT = "10002";
  // CURRENT_ORG_NOT_PRESENT = "10003";
  // BUSINESS_PAGE_NOT_EXIST = "10004";
  // public static final String BUSINESS_PAGE_NOT_VERIFED = "10005";

  get controlOfForms() {
    return this.chooseBusinessPage.controls;
  }

  formValidity: boolean = false
  navigate() {
    this.formValidity = true
    if (this.chooseBusinessPage.valid) {
      this.organizationList.forEach(ele => {
        //// //// console.log(ele)
        //// //// console.log(this.chooseBusinessPage.value.organizationName)
        if (ele.organizationId == this.chooseBusinessPage.value.organizationName) {
          var obj: any = {}
          obj.organizationId = ele.organizationId;
          obj.businessName = ele.organizationName
          obj.zipCode = ele.zipCode
          obj.city = ele.city
          obj.state = ele.state
          obj.country = ele.country
          obj.street = ele.street &&
            ele.street !== null ? ele.street : null


          this.util.startLoader()
          setTimeout(() => {
            this.router.navigate(['createBusiness'], { queryParams: obj })
          }, 1000);
          this.util.stopLoader()
        }
      })
    }
  }
  businessPageStatus() {
    var id: any = localStorage.getItem('userId')
    this.api.query('business/check/' + id).subscribe(res => {
      if (res.code == '10000') {
        //// //// console.log('this is business repsonse')
        //// //// console.log(res)
        Swal.fire({
          title: 'Invalid user ID',
          text: 'Sorry there! The user ID seems to be invalid.',
          icon: 'error',
          showDenyButton: false,
          confirmButtonText: `ok`,

        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {

          }
        });
      } else if (res.code == '10001') {
        // //// console.log('// USER_NOT_PRESENT = "10001";')
        Swal.fire({
          title: 'Invalid user',
          text: 'Sorry there! There is no such user present.',
          icon: 'error',
          showDenyButton: false,
          confirmButtonText: `ok`,

        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {

          }
        });
      } else if (res.code == '10002') {
        // //// console.log('// WORK_EXP_NOT_PRESENT = "10002";')
        Swal.fire({
          text: 'Work experience is required for creating a business page. It seems you have not provided any. Please create one in your profile.',
          title: 'Work experience is required',
          icon: 'info',
          showDenyButton: false,
          confirmButtonText: `ok`,

        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {

          }
        });
      } else if (res.code == '10003') {
        // //// console.log('// CURRENT_ORG_NOT_PRESENT = "10003";')
        //
        Swal.fire({
          title: 'Current Organization is required',
          text: 'You need a business organization where you should be currently working for creating a Business Page. Please go to Profile > Add Work Experience > Check the Current Organization check-box.',
          icon: 'info',
          showDenyButton: false,
          confirmButtonText: `ok`,

        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {

          }
        });
      } else if (res.code == '10004') {
        // //// console.log('// BUSINESS_PAGE_NOT_EXIST = "10004";')
        var obj: any = {}

        obj.businessName = res.data.organisation.organizationName
        obj.zipCode = res.data.organisation.zipCode
        obj.city = res.data.organisation.city
        obj.state = res.data.organisation.state
        obj.country = res.data.organisation.country
        obj.street = res.data.organisation.street && res.data.organisation.street !== null ? res.data.organisation.street : null
        obj.orgId = res.data.organisation.organizationId;
        setTimeout(() => {
          this.router.navigate(['createBusiness'], { queryParams: obj })

        }, 400);
      } else if (res.code == '10005' && res.data.businessData.status != "VERIFIED") {
        // //// console.log('// public static final String BUSINESS_PAGE_NOT_VERIFED = "10005";')
        Swal.fire({
          // Your business has not been verified yet! Please verify with the verification code that was sent to your business email address.
          // title: res.message,
          title: "Business page exists",
          text: "There is a business page existing in your current organization which has not been verified as yet.",
          showDenyButton: false,
          confirmButtonText: `ok`,
          icon: 'info',

        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {

          }
        });
      } else if (res.code == '10005' && res.data.businessData.status == "Open") {
        var object12: any = {}
        object12.value = 'create'
        object12.businessName = res.data.organisation.organizationName
        object12.zipCode = res.data.organisation.zipCode
        object12.city = res.data.organisation.city
        object12.state = res.data.organisation.state
        object12.country = res.data.organisation.country
        object12.street = res.data.organisation.street && res.data.organisation.street !== null ? res.data.organisation.street : null
        object12.orgId = res.data.organisation.organizationId;
        this.router.navigate(['createBusiness'], { queryParams: object12 })
      }
      else if (res.data.businessData.status == "VERIFIED" && res.code == "10008") {

        Swal.fire({
          title: "Business page exists already",
          text: "Your current organization already has a business page. Please click 'Redirect' to visit the page or click 'Create' to make a new page or click cancel.",
          icon: 'question',
          showDenyButton: true,
          showCancelButton: true,
          reverseButtons: true,

          cancelButtonText: 'Cancel',
          denyButtonText: 'Create',
          confirmButtonText: 'Redirect',


        }).then((result) => {
          if (result.isConfirmed) {

            var obj: any = {}

            obj.businessBanner = res.data.businessData.businessBanner
            obj.businessId = res.data.businessData.businessId
            obj.businessLogo = res.data.businessData.businessLogo
            obj.businessName = res.data.businessData.businessName
            obj.businessOwner = res.data.businessData.businessOwner
            obj.businessStatus = res.data.businessData.businessStatus;
            obj.isSuperAdmin = res.data.businessData.isSuperAdmin;

            this.getbussinessid(obj) //redirecting to the existing business page that user was trying to create being oblivious

            // } else if (result.dismiss === Swal.DismissReason.cancel) {
          } else if (result.dismiss) {


          } else if (result.isDenied) {
            setTimeout(() => {
              var object: any = {}
              object.value = 'create'
              object.businessName = res.data.business.businessName
              this.router.navigate(['createBusiness'], { queryParams: object })
            }, 400);
          }
        })




        // swalWithBootstrapButtons.fire({
        //   title: "Business page exists already",
        //   text: "Your current organization already has a business page. Please click 'Redirect' to visit the page or click 'Create' to make a new page or click cancel.",
        //   icon: 'question',
        //   reverseButtons: true,
        //   showDenyButton: true,
        //   showCancelButton: true,
        //   confirmButtonText: 'Redirect',
        //   cancelButtonText: 'Cancel',
        //   denyButtonText: 'Create',
        // }).then((result) => {
        //   if (result.isConfirmed) {

        //     var obj : any = {}

        //     obj.businessBanner = res.data.business.businessBanner
        //     obj.businessId = res.data.business.businessId
        //     obj.businessLogo = res.data.business.businessLogo
        //     obj.businessName = res.data.business.businessName
        //     obj.businessOwner = res.data.business.businessOwner
        //     obj.businessStatus = res.data.business.businessStatus;
        //     obj.isSuperAdmin = res.data.business.isSuperAdmin;

        //     this.getbussinessid(obj) //redirecting to the existing business page that user was trying to create being oblivious

        //     // } else if (result.dismiss === Swal.DismissReason.cancel) {
        //   } else if (result.dismiss) {


        //   }else if(result.isDenied){
        //     setTimeout(() => {
        //       var object: any = {}
        //       object.value = 'create'
        //       object.businessName = res.data.business.businessName
        //       this.router.navigate(['createBusiness'], { queryParams: object })
        //     }, 400);
        //   }
        // })


      } else if (res.code == "10008" && res.data.businessData.status == "INITIATED") {
        Swal.fire({
          title: "Business Page Pending Verification",
          text: "There is already a business page created for your organization that is pending verification.",
          icon: 'info',
          // showDenyButton: true,
          // showCancelButton: true,
          // reverseButtons: true,
          showConfirmButton: true,

          // cancelButtonText: 'Cancel',
          // denyButtonText: 'Create',
          confirmButtonText: 'Ok',


        }).then((result) => {
          if (result.isConfirmed) {

          }
        })
      } else if (res.code == "10008" && res.data.businessData != undefined && res.data.businessData.status == "ACTIVE") {
        Swal.fire({
          title: "Business Page Exists Already",
          text: "There is a business page already existing for your organization. Please, click the 'Redirect' button to visit the business page.",
          icon: 'info',
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Redirect',


        }).then((result) => {
          if (result.isConfirmed) {
            var obj1 = res.data.businessData
            this.router.navigate(["business"], { queryParams: obj1 });
          }
        })
      } else if (res.code == "10008" && res.data.businessExist != undefined && res.data.businessExist.status == "INITIATED") {
        Swal.fire({
          title: "Business Page Pending Verification",
          text: "There is already a business page created for your organization that is pending verification.",
          icon: 'info',
          // showDenyButton: true,
          // showCancelButton: true,
          // reverseButtons: true,
          showConfirmButton: true,

          // cancelButtonText: 'Cancel',
          // denyButtonText: 'Create',
          confirmButtonText: 'Ok',


        }).then((result) => {
          if (result.isConfirmed) {

          }
        })
      } else if (res.code == "10008" && res.data.businessExist != undefined && res.data.businessExist.status == "INACTIVE") {
        Swal.fire({
          title: "Business Page Deactivated",
          text: "There is a business page already existing for your organization. However, it has been deactivated. The super admin of the business page has to activate it for using the business page.",
          icon: 'info',
          // showDenyButton: true,
          // showCancelButton: true,
          // reverseButtons: true,
          showConfirmButton: true,

          // cancelButtonText: 'Cancel',
          // denyButtonText: 'Create',
          confirmButtonText: 'Ok',


        }).then((result) => {
          if (result.isConfirmed) {

          }
        })
      } else if (res.code == "10008" && res.data.businessExist != undefined && res.data.businessExist.status == "ACTIVE") {
        Swal.fire({
          title: "Business Page Exists Already",
          text: "There is a business page already existing for your organization. Please, click the 'Redirect' button to visit the business page.",
          icon: 'info',
          showCancelButton: true,
          showConfirmButton: true,
          cancelButtonText: 'Cancel',
          confirmButtonText: 'Redirect',


        }).then((result) => {
          if (result.isConfirmed) {
            var obj1 = res.data.businessExist
            this.router.navigate(["business"], { queryParams: obj1 });
          }
        })
      }
      else if (res.code == '00000') {

        this.organizationList = res.data.organisation;
        this.businessExistList = res.data.businessExist;
        this.businessPendingList = res.data.businessPending;

        if (this.organizationList.length == 0) {
          Swal.fire({
            title: 'No Organisation ',
            text: 'No organisation for this user',
            icon: 'error',
            showDenyButton: false,
            confirmButtonText: `ok`,
          }).then((result) => {
            if (result.isConfirmed) {

            }
          });
          return;
        }

        for (let i = 0; i < this.businessPendingList.length; i++) {
          let pending = this.businessPendingList[i];
          for (let j = 0; j < this.organizationList.length; j++) {
            let org = this.organizationList[j];
            if (org['organizationId'] === pending['organizationId']) {
              this.organizationList.splice(j, 1);
              break;
            }
          }
        }
        for (let penindex = 0; penindex < res.data.businessExist.length; penindex++) {
          const pendingelement = res.data.businessExist[penindex];
          for (let index = 0; index < this.organizationList.length; index++) {
            const orgelement = this.organizationList[index];
            if (pendingelement.organizationId == orgelement.organizationId) {
              this.organizationList.splice(index, 1);
              break;
            }
          }
        }
        if (this.organizationList.length == 0) {
          Swal.fire({
            title: 'Business page already exists',
            text: 'Business page created already. Please check your business page.',
            icon: 'error',
            showDenyButton: false,
            confirmButtonText: `ok`,
          }).then((result) => {
            if (result.isConfirmed) {

            }
          });
        } else if (this.organizationList.length == 1) {
          this.organizationList.forEach(ele => {
            var obj: any = {}
            obj.organizationId = ele.organizationId;
            obj.businessName = ele.organizationName
            obj.zipCode = ele.zipCode
            obj.city = ele.city
            obj.state = ele.state
            obj.country = ele.country
            obj.street = ele.street && ele.street !== null ? ele.street : null
            // //// console.log('obj')
            setTimeout(() => {
              this.router.navigate(['createBusiness'], { queryParams: obj })
            }, 600);

          })
        } else if (this.organizationList.length > 1) {
          this.isModalShown = true
          this.organizationList = res.data.organisation;
          this.chooseBusinessPage = this.formBuilder.group({
            organizationName: [null, [Validators.required]]
          })
        }






        // if(this.organizationList.length==1){
        //  this.organizationList = res.data.organisation;

        //  if(res.data.businessExist.length!=0){
        //    res.data.organisation.forEach(element => {
        //      if(res.data.businessExist[0].businessId==element.businessId){
        //       Swal.fire({
        //         title: 'Business Already Exits',
        //         text: 'Business Already created please check your business page',
        //         icon: 'error',
        //         showDenyButton: false,
        //         confirmButtonText: `ok`,
        //       }).then((result) => {
        //         if (result.isConfirmed) {
        //          }
        //       });

        //       return true;

        //    }
        //   });


        // }else  if(res.data.businessPending.length!=0){
        //   if(res.data.businessPending[0].businessId==res.data.organisation[0].businessId){

        //   Swal.fire({
        //     title: ' Business verification pending ',
        //     text: ' Business verification pending ',
        //     icon: 'error',
        //     showDenyButton: false,
        //     confirmButtonText: `ok`,
        //   }).then((result) => {
        //       if (result.isConfirmed) {

        //       }
        //    });
        //   } }
        //   else{
        //     this.organizationList.forEach(ele=>{
        //       var obj: any = {}
        //       obj.organizationId = ele.organizationId;
        //       obj.businessName = ele.organizationName
        //       obj.zipCode = ele.zipCode
        //       obj.city = ele.city
        //       obj.state = ele.state
        //       obj.country = ele.country
        //       obj.street = ele.street && ele.street !== null ? ele.street : null
        //      // //// console.log('obj')
        //       setTimeout(() => {
        //         this.router.navigate(['createBusiness'], { queryParams: obj })
        //       }, 600);

        //       })
        //   }
        // //   else if(res.data.organisation.length>1){
        // //   //// //// console.log('this is passing this area')
        //   this.isModalShown = true
        //   this.organizationList = res.data.organisation
        //   //creating organizzation form
        //   this.chooseBusinessPage = this.formBuilder.group({
        //     organizationName: [null, [Validators.required]]
        //   })
        // // }

        // }else{

        //   Swal.fire({
        //     title: 'No Organisation ',
        //     text: 'No Organisation for this user ',
        //     icon: 'error',
        //     showDenyButton: false,
        //     confirmButtonText: `ok`,
        //   }).then((result) => {
        //     if (result.isConfirmed) {

        //       }
        //     });

        // }

      } else if (res.code == '99999') {
        res.data.businessExist
      }
    }, err => {
      this.util.stopLoader();
    })

  }


  checkadmincommunity(businessid, data) {

    let datas: any = {};
    datas.communityId = businessid
    datas.userId = localStorage.getItem('userId')
    this.util.startLoader();
    this.api.create("community/home", datas).subscribe(res => {
      this.util.stopLoader();
      localStorage.setItem('businessId', businessid)
      localStorage.setItem('communityId', businessid)
      localStorage.setItem('isAdmin', res.data.isAdmin)
      localStorage.setItem('isSuperAdmin', res.data.isSuperAdmin)
      localStorage.setItem('screen', 'community')
      localStorage.setItem('adminviewflag', 'false')

      this.router.navigate(['community'], { queryParams: data })


    }, err => {
      this.util.stopLoader();

    });

  }


  companydetailsapicall() {
    let datas: any = {};
    datas.userId = localStorage.getItem('userId')
    this.util.startLoader()
    this.api.create("business/check/user", datas).subscribe(res => {
      this.util.stopLoader()
      if (res && res != null && res.data.businessModelList[0].length > 0) {
        let d = [];
        res.data.businessModelList.forEach(e => {
          if (e.businessStatus && e.businessStatus != null && e.businessStatus === 'VERIFIED') {
            d.push(e);
          }
        });
        this.businessdetail = d;
      } else {
        this.businessdetail = [];
      }
    }, err => {
      this.util.stopLoader();

    });

  }

  setCommunityId(data) {

    this.checkadmincommunity(data.communityId, data)

  }
  showMoreComm() {
    //  this.paginationLimit = Number(this.paginationLimit) + 3;
    this.paginationLimitCom = this.communityDetails.length;
    this.showLessCommunity = true;
  }

  showLessComm() {
    this.paginationLimitCom = Number(this.paginationLimitCom) + 5 - this.communityDetails.length;
    this.showLessCommunity = false;
  }

  getbussinessid(data) {

    this.checkadmin(data.businessId, data)

  }

  checkadmin(businessid, data) {
    let datas: any = {};
    datas.businessId = businessid
    datas.userId = localStorage.getItem('userId')
    this.util.startLoader();
    this.api.create("business/check/admin", datas).subscribe(res => {
      this.util.stopLoader();
      // // //// console.log("businesscheckadmin "+res);

      localStorage.setItem('businessId', businessid)
      localStorage.setItem('isAdmin', res.isAdmin)
      localStorage.setItem('isSuperAdmin', res.isSuperAdmin)
      localStorage.setItem('screen', 'business')
      localStorage.setItem('adminviewflag', 'false')


      //this.sideheader.displaymenu('business')
      this.router.navigate(['business'], { queryParams: data })


    }, err => {
      this.util.stopLoader();

    });

  }

  showMoreBusiness() {
    this.paginationLimitBus = this.businessdetail.length;
    this.showLessBus = true
  }
  showLessBusiness() {
    this.paginationLimitBus = Number(this.paginationLimitBus) + 5 - this.businessdetail.length;
    this.showLessBus = false;
  }

  comunitydetailsapicall() {

    let datas: any = {};
    datas.userId = localStorage.getItem('userId')

    this.util.startLoader()
    this.api.queryPassval("community/check/user", datas).subscribe(res => {
      this.util.stopLoader()
      this.communityDetails = res.data.communityModelList;
      this.comm = res.data.communityModelList.communityName;


    }, err => {
      this.util.stopLoader();
    });
  }

}
