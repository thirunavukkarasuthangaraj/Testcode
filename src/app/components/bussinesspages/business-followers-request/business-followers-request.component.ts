import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { CommonValues } from 'src/app/services/commonValues';
import { SearchData } from 'src/app/services/searchData';
import { UtilService } from 'src/app/services/util.service';
import { User } from 'src/app/types/User';
import { UserCardConfig } from 'src/app/types/UserCardConfig';
import Swal from 'sweetalert2';
import { BusinessEmployeeComponent } from '../business-employee/business-employee.component';
import { BusinessFollowerComponent } from '../business-follower/business-follower.component';

@Component({
  selector: 'app-business-followers-request',
  templateUrl: './business-followers-request.component.html',
  styleUrls: ['./business-followers-request.component.scss']
})
export class BusinessFollowersRequestComponent implements OnInit {
  @Input() commonemit
  values: any = {}
  // basicDeatils: any
  // clickEventsubscription: Subscription;
  isAdmin
  isSuperAdmin
  // name
  businessId
  bussinessName
  // empSearch:any;
  // requestsReceivedData:any ;
  userId: any;
  //Usercard initialization;
  // userCardConfig: UserCardConfig[] = []
  constructor(
    private commonvalues: CommonValues,
    private searchData: SearchData,
    private api: ApiService,
    private util:UtilService,
    // private employee:BusinessEmployeeComponent,
    // private router: Router ,
    // private fb: FormBuilder,
    private route: ActivatedRoute,
    private follower: BusinessFollowerComponent
  ) { }

  ngOnInit() {
    this.values=this.commonemit
    this.isAdmin = localStorage.getItem('isAdmin');
    this.isSuperAdmin=localStorage.getItem('isSuperAdmin');
    this.userId=localStorage.getItem('userId');

   if(this.isSuperAdmin){
     this.isAdmin= this.isSuperAdmin
   }

   this.route.queryParams.subscribe((res) => {
   this.businessId=res.businessId;
   this.bussinessName=res.bussinessName;
   });

    // let accept : UserCardConfig = new UserCardConfig("Accept", this.acceptEmployee, this.canShow, true);
    // accept.source = this;
    // this.userCardConfig.push(accept);

    // let ignore : UserCardConfig = new UserCardConfig("Ignore", this.ignoreFollower, this.canShow, true);
    // ignore.source = this;
    // this.userCardConfig.push(ignore);

    // let revokeBtn : UserCardConfig = new UserCardConfig("Deny", this.rejectFollower, this.canShow, true);
    // revokeBtn.source = this;
    // this.userCardConfig.push(revokeBtn);
  }

//   rejectFollower(user: User){
//     let data: any = {}
//     data.businessId = this.businessId
//     data.userId = user.userId
//     // /business/follow/accept/request - accept request - {'userId': '', 'businessId': ''} - POST
// // /business/follow/reject/request - reject request - {'userId': '', 'businessId': ''} - POST
//     // /business/employee/request/accept - accept employee from request - {'userId': '', 'businessId': ''}
//     this.api.create('business/follow/accept/request', data).subscribe(res=>{
//       if(res.code=='00000'){
//         Swal.fire({
//           position: 'center',
//               icon: 'success',
//               title: 'Follower Denied',
//               // text: 'Follower added successfully',
//               showConfirmButton: false,
//               timer: 1500
//         })
//       }else{
//         Swal.fire({
//           position: 'center',
//               icon: 'error',
//               title: 'Oops..',
//               text: 'Something went wrong. Please try later.',
//               showConfirmButton: false,
//               timer: 1500
//         })
//       }
//       this.requestlist()
//     })
//   }

//   ignoreFollower(user: User){
//     let data: any = {}
//     data.businessId = this.businessId
//     data.userId = user.userId
//     // /business/employee/request/accept - accept employee from request - {'userId': '', 'businessId': ''}
//     this.api.create('business/follow/reject/request', data).subscribe(res=>{
//       if(res.code=='00000'){

//       }else{
//         Swal.fire({
//           position: 'center',
//               icon: 'error',
//               title: 'Oops..',
//               text: 'Something went wrong. Please try later.',
//               showConfirmButton: false,
//               timer: 1500
//         })
//       }
//       this.requestlist()
//     })
//   }

//   acceptEmployee(user: User){
//     let data: any = {}
//     data.businessId = this.businessId
//     data.userId = user.userId
//     console.log()
//     // /business/employee/request/accept - accept employee from request - {'userId': '', 'businessId': ''}
//     this.api.create('business/follow/accept/request/accept', data).subscribe(res=>{
//       if(res.code=='00000'){
//         Swal.fire({
//           position: 'center',
//               icon: 'success',
//               title: 'Follower Added',
//               text: 'Follower added successfully',
//               showConfirmButton: false,
//               timer: 1500
//         })
//       }else{
//         Swal.fire({
//           position: 'center',
//               icon: 'error',
//               title: 'Oops..',
//               text: 'Something went wrong. Please try later.',
//               showConfirmButton: false,
//               timer: 1500
//         })
//       }
//       this.requestlist()
//     })
//   }

//   canShow(){

//   }

  //   /business/visitor/all/{businessId}  - Get all visited user - GET
// /business/visitor/send/all/request/{businessId} - Send request to all visited user - GET          method not supported
// /business/visitor/send/request - Send request to particular user - {'userId': '', 'businessId': ''} - POST
// /business/follow/accept/request - accept request - {'userId': '', 'businessId': ''} - POST
// /business/follow/reject/request - reject request - {'userId': '', 'businessId': ''} - POST

// /business/employee/request/pending/{id} - Get pending employee from request
// /business/employee/request/accept - accept employee from request - {'userId': '', 'businessId': ''}
// /business/employee/request/reject - reject employee from request - {'userId': '', 'businessId': ''}
// /business/employee/request/send - send employee from request - {'userId': '', 'businessId': ''}

// pendingList: any = []
  requestlist(){
    // this.pendingList=[]
    let data: any = {}
    data.businessId = this.businessId
        this.util.startLoader()
        setTimeout(() => {
          this.api.create('business/followers/', data).subscribe(res=>{
            // this.pendingList = res
            // this.searchData.setRequestedFollowerCount(res.length)
            this.setFollowerRequestDetailOnBusiness(res.data.businessFollowers)
            // this.follower.followersapicall()
          })
        },600);

    this.util.stopLoader()
  }

  // userprofile(data){
  //   var userData: any= {}
  //    userData.userId = data
  //    this.router.navigate(['personalProfile'], {queryParams : userData})
  //  }

  sort_by_key(array, key) {
    return array.sort(function(a, b) {
     var x = a[key]; var y = b[key];
     return ((x < y) ? -1 : ((x > y) ? 1 : 0));
   });
  }

   setFollowerRequestDetailOnBusiness(userdata){
    this.values.menu = 'followerRequestsReceived'
    this.values.followers = userdata
    this.values.followers = this.sort_by_key(userdata,"firstName");
    this.values.followers.forEach((element,i) => {
      if(element.userId==localStorage.getItem("userId")){
       var b = this.values.followers[i];
       this.values.followers[i] =   this.values.followers[0];
       this.values.followers[0] = b;
      }

   });

    // this.commonvalues.businessid(this.values)
   }


}
