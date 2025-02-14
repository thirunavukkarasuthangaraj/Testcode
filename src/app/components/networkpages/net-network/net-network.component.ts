import { ActivatedRoute, Router } from '@angular/router';

import { Component, Input, OnInit } from '@angular/core';
import { SearchData } from 'src/app/services/searchData';
import { ApiService } from 'src/app/services/api.service';
import { UtilService } from 'src/app/services/util.service';
@Component({
  selector: 'app-net-network',
  templateUrl: './net-network.component.html',
  styleUrls: ['./net-network.component.scss']
})
export class NetNetworkComponent implements OnInit {
  pathdata
  constructor(
    private route: ActivatedRoute,
    private router: Router,private api: ApiService,
    private util: UtilService,
    private commonValues: SearchData,) {
      //  this.router.routeReuseStrategy.shouldReuseRoute = () => false;
     }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.route.queryParams.subscribe((res) => {
      this.pathdata = res;
      this.api.query("network/get/" + this.pathdata.networkId).subscribe(
        (res) => {
          if (res != undefined && res != null) {
            this.commonValues.setNetdata(res.data.Network)
          }
        },
        (error) => {
          console.error('Error fetching network data:', error);

        }
      );
    },err => {
      this.util.stopLoader();
    });

  }



}
