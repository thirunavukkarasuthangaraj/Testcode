import { ApiService } from './../../../services/api.service';
import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { SearchData } from "src/app/services/searchData";
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: "app-team-side-bar-nav",
  templateUrl: "./team-side-bar-nav.component.html",
  styleUrls: ["./team-side-bar-nav.component.scss"],
})
export class TeamSideBarNavComponent implements OnInit {
  pathdata: any;
  menuSelected: any;
  membermenuflag: boolean = true;
  pendingCount: any;
  teamOwnerFlag: boolean = false;
  countrEmitter: Subscription;
  @Input()
  userDataInput: string;
  menus = "home";
  commonVariables: any = {};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private SearchData: SearchData,
    private util: UtilService,
    private api: ApiService) {
    this.countrEmitter = this.SearchData.getCommonVariables().subscribe(
      (res) => {
        this.pendingCount = res.pendingCount;
       }
    );
  }

  ngOnInit() {
    this.route.queryParams.subscribe((res) => {
      this.pathdata = res;
      this.menus = this.userDataInput;
      if (res.teamsOwnerId === localStorage.getItem("userId")) {

        this.teamOwnerFlag = true;
        if (this.menus == "member") {
          this.membermenuflag = false;
        }
        else if (this.menus == "members") {
          this.membermenuflag = false;
        } else if (this.menus == "inviteSent") {
          this.membermenuflag = false;
        }

      }

      const usId = localStorage.getItem("userId");
      this.api.query("teams/member/invites/sent/" + this.pathdata.teamId).subscribe((res:any) => {
        if(res.data && res.data.TeamsMember!=null){
        this.commonVariables.pendingCount = res.data.TeamsMember.length;
        this.SearchData.setCommonVariables(this.commonVariables);
        }
       },err => {
        this.util.stopLoader();
      });

    });



  }
  down(val) {
    if (val == 'down') {
      this.membermenuflag = false;
    } else if (val == 'up') {
      this.membermenuflag = true;
    }
    event.stopPropagation();

  }
  menuclick(name) {

    let values:any={};
    this.menus=name;
    let x = JSON.parse(JSON.stringify(this.pathdata));
    values=x
    values.menu=name;
    this.router.navigateByUrl('teamPage', {skipLocationChange: true}).then(() => {
      // this.router.navigate(['landingPage/'+ menuName]);
      this.router.navigate(["teamPage/" + name], { queryParams: values });

    });

    if (name == "inviteSent") {
      // this.membermenuflag = true;
    } else if (name == "member") {
      // this.membermenuflag = false;
    } else if (name == "members") {
      // this.membermenuflag = false;

    }
    const usId = localStorage.getItem("userId");
    this.api.query("teams/member/invites/sent/" + this.pathdata.teamId).subscribe((res:any) => {
       if(res.data && res.data.TeamsMember!=null){
      this.commonVariables.pendingCount = res.data.TeamsMember.length;
      this.SearchData.setCommonVariables(this.commonVariables);
      }
      // localStorage.setItem("pendingCount", res.data.Teams.length);

    },err => {
      this.util.stopLoader();
    });

  }
}
