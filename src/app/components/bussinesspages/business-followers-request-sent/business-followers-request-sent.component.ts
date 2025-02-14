import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-business-followers-request-sent',
  templateUrl: './business-followers-request-sent.component.html',
  styleUrls: ['./business-followers-request-sent.component.scss']
})
export class BusinessFollowersRequestSentComponent implements OnInit, OnDestroy {
  @Input() commonemit
  values: any = {}
  clickEventsubscription: Subscription;
  isAdmin
  isSuperAdmin
  name
  noDatafound: Array<string> = ["You have no new invites sent lately."];
  businessId
  bussinessName
  empSearch: any;
  requestsReceivedData: any;
  userId: any;
  //Usercard initialization;
  userCardConfig: UserCardConfig[] = []
  userCardConfig_requestsent: UserCardConfig[] = []
  showNoDatafound: boolean = false;
  tempvisitorsList: any;
  searchKey
  constructor(
    private commonvalues: CommonValues,
    private searchData: SearchData,
    private api: ApiService,
    private util: UtilService,
    private employee: BusinessEmployeeComponent,
    private router: Router,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute,
    private follower: BusinessFollowerComponent
  ) {
    this.businessId = route.snapshot.queryParamMap.get('businessId');
    this.bussinessName = route.snapshot.queryParamMap.get('bussinessName');
    this.clickEventsubscription = this.commonvalues.getbusinessid().subscribe((res) => {

      this.values = res;

    });

  }

  ngOnInit() {
    this.values = this.commonemit
    this.isAdmin = localStorage.getItem('isAdmin');
    this.isSuperAdmin = localStorage.getItem('isSuperAdmin');
    this.userId = localStorage.getItem('userId');

    if (this.isSuperAdmin) {
      this.isAdmin = this.isSuperAdmin
    }
    this.getVisitorsList()



    // let removeBtn : UserCardConfig = new UserCardConfig("Remove", this.rejectFollower, this.canShow, true);
    // removeBtn.source = this;
    // this.userCardConfig.push(removeBtn);

    // let ignore : UserCardConfig = new UserCardConfig("Ignore", this.ignoreFollower, this.canShow, true);
    // ignore.source = this;
    // this.userCardConfig.push(ignore);

  }

  ngOnDestroy(): void {
    if (this.clickEventsubscription) {
      this.clickEventsubscription.unsubscribe();
    }
  }

  keyupdata(event) {
    if (event.target.value.length == 0) {
      this.onsearch('');
    }
  }
  onsearch(val) {
    if (val != undefined) {
      val = val.trim().toLowerCase();
    }
    this.visitorsList = this.tempvisitorsList
    this.visitorsList = this.filterByString(this.visitorsList, val);
    if (this.visitorsList.length == 0) {
      this.showNoDatafound = true;
    } else {
      this.showNoDatafound = false;
    }

  }

  filterByString(data, s) {
    return data.filter(e => e.userName.toLowerCase().includes(s))
      .sort((a, b) => a.userName.toLowerCase().includes(s) && !b.userName.toLowerCase().includes(s) ? -1 : b.userName.toLowerCase().includes(s) && !a.userName.toLowerCase().includes(s) ? 1 : 0);
  }
  acceptFollower(user: User) {
    let data: any = {}
    data.businessId = this.businessId
    data.userId = user.userId
    // /business/employee/request/accept - accept employee from request - {'userId': '', 'businessId': ''}
    this.api.create('business/follow/accept/request', data).subscribe(res => {
      if (res.code == '00000') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Follower Added',
          text: 'Follower added successfully',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          this.getVisitorsList()
        })
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Oops..',
          text: 'Something went wrong. Please try again later.',
          showConfirmButton: false,
          timer: 3000
        })
      }

    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while accepting request. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    })
  }

  //   /business/visitor/all/{businessId}  - Get all visited user - GET
  // /business/visitor/send/all/request/{businessId} - Send request to all visited user - GET
  // /business/visitor/send/request - Send request to particular user - {'userId': '', 'businessId': ''} - POST
  // /business/follow/accept/request - accept request - {'userId': '', 'businessId': ''} - POST
  // /business/follow/reject/request - reject request - {'userId': '', 'businessId': ''} - POST
  inviteFollower(user: User) {
    let data: any = {}
    data.businessId = this.businessId
    data.userId = user.userId
    this.util.startLoader();
    // /business/employee/request/accept - accept employee from request - {'userId': '', 'businessId': ''}
    this.api.create('business/visitor/send/request', data).subscribe(res => {
      this.util.stopLoader();
      if (res.code == '00000') {
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Invite sent successfully',
          // text: 'Follower added successfully',
          showConfirmButton: false,
          timer: 1500
        })
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Oops..',
          text: 'Something went wrong. Please try again later.',
          showConfirmButton: false,
          timer: 3000
        })
      }
      this.getVisitorsList()
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while inviting. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    })
  }
  cancelInvitation(user: User) {
    var data: any = {}
    data.userId = user.userId
    data.businessId = localStorage.getItem('businessId')
    this.api.create('business/visitor/invite/cancel', data).subscribe(res => {
      if (res.code == '00000') {
        // this.getVisitorsList()

        this.visitorsList.splice(this.visitorsList.findIndex(a => a.userId === user.userId), 1)

      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'Oops..',
          text: 'Something went wrong. Please try again later.',
          showConfirmButton: false,
          timer: 3000
        })
      }
    }, err => {
      this.util.stopLoader();
      if (err.status == 500) {
        this.util.stopLoader();
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: 'Something went wrong while cancelling invitation. Please, try again later.',
          showDenyButton: false,
          confirmButtonText: `ok`,
        })
      }
    })
  }

  inviteSent(): void {

  }

  canShow(data, source): boolean {
    return true;
  }

  visitorsList: any = []
  tempList: any = []
  followerList
  getVisitorsList() {
    this.visitorsList = []
    this.tempList = []
    this.util.startLoader()
    setTimeout(() => {
      this.api.query('business/followerrequests/' + this.businessId).subscribe(res => {
        if (res.data && res.data.requestList != null && res.data.requestList.lenght != 0) {
          this.tempList = res.data.requestList





          // this.tempList = this.sort_by_key(res.data.visitedList,"firstName");
          this.tempList.forEach((element, i) => {
            this.userCardConfig = []
            // let invite_sent: UserCardConfig = new UserCardConfig("Pending Acceptance", this.inviteSent, this.canShow, true);
            let cancel_invite: UserCardConfig = new UserCardConfig("Cancel Invitation", this.cancelInvitation, this.canShow, true);
            cancel_invite.source = this;
            // this.userCardConfig.push(invite_sent);
            this.userCardConfig.push(cancel_invite);
            // this.userCardConfig.push(cancel_invite);
            //     if(element.status=="PENDING"){
            //     this.userCardConfig=[]
            //    let invite : UserCardConfig = new UserCardConfig("Invite", this.inviteFollower, this.canShow, true);
            //    invite.source = this;
            //    this.userCardConfig.push(invite);
            //  }else

            // if(element.status=="REQUEST_SENT"){
            element.userName = element.firstName + " " + element.lastName;
            //  invite_sent.source = this;
            //  element.userCardConfig= this.userCardConfig;
            this.visitorsList.push(element);

            this.visitorsList = [...new Map(this.visitorsList.map(item => [item['userId'], item])).values()];

            // if(element.userId==localStorage.getItem("userId")){
            //  var b = this.tempList[i];
            //  this.tempList[i] =   this.tempList[0];
            //  this.tempList[0] = b;
            // }
            //   this.tempList.forEach((element,i) => {

            //     if(element.userId==localStorage.getItem("userId")){
            //      var b =  this.tempList[i];
            //      this.tempList[i] =  this.tempList[0];
            //      this.tempList[0] = b;
            //     }
            //  });

            // }
          });
          // this.tempvisitorsList=this.visitorsList;
          // this.visitorsList = this.tempList
          this.setBusinessFollowersRequestSent(this.visitorsList)
        }

      }, err => {
        this.util.stopLoader();
      })

      // let data: any = {};
      // data.businessId = this.values.businessId
      // this.api.create('business/followers', data ).subscribe(res => {
      //   this.util.stopLoader()
      //   this.followerList = res;
      //   if(res!=null && res.lenght!=0){
      //     this.followerList = this.sort_by_key(res,"firstName");
      //     this.followerList.forEach((element,i) => {
      //       // if(element.userId==localStorage.getItem("userId")){
      //       //  var b = this.values.followerList[i];
      //       //  this.values.followerList[i] =   this.values.followerList[0];
      //       //  this.values.followerList[0] = b;
      //       // }
      //     });
      //   }

      // })
    }, 600);

    this.util.stopLoader()
  }

  sort_by_key(array, key) {
    return array.sort(function (a, b) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
  }

  userprofile(data) {
    var userData: any = {}
    userData.userId = data
    this.router.navigate(['personalProfile'], { queryParams: userData })
  }

  setBusinessFollowersRequestSent(userdata) {
    this.values.menu = 'followerRequestsSent'
    this.values.followerRequestsSent = userdata
    this.values.followerRequestsSent = this.sort_by_key(userdata, "firstName");
    this.values.followerRequestsSent.forEach((element, i) => {
      if (element.userId == localStorage.getItem("userId")) {
        var b = this.values.followerRequestsSent[i];
        this.values.followerRequestsSent[i] = this.values.followerRequestsSent[0];
        this.values.followerRequestsSent[0] = b;
      }

    });


    // this.commonvalues.businessid(this.values)
  }

}
