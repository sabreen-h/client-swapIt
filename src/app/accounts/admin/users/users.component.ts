import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserModel } from 'src/app/models/UserModel';
import { Users } from 'src/app/models/users.model';
import { AdminService } from 'src/app/services/admin.service';
import { AuthService } from 'src/app/services/auth.service';
import * as $ from 'jquery';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  
  constructor(
    private service:AdminService,
    private auth: AuthService,
    private router:Router
  ) { }
  

  users:Users[];
  num:number;
  ngOnInit(): void {
    
    this.users=null;
    this.num=0;
    this.getUsers();
  }
  getUsers() {
    this.service.GetAllUsers().subscribe((list)=>{
      this.users=list;
   },err=>console.log(err));
  }


  EditUserClick(id:string){
    this.router.navigate(['/editusers',id]);
  }

  IsDelete(){
    var checkboxes=document.getElementsByClassName('ckitem');
    if(checkboxes.length > 0){
       for (let i = 0; i < checkboxes.length; i++) {
          if($(checkboxes[i]).is(":checked")){
            return true;
          }
         
       }
    }
    return false;
  }
  DeleteCount(){
    var count=$(".ckitem:checked").length;
    this.num=count;
  }
  
  DeleteConfirm(){
    var checkboxes=document.getElementsByClassName('ckitem');
    if(checkboxes.length > 0){
      var ids = [];
       for (let i = 0; i < checkboxes.length; i++) {
          if($(checkboxes[i]).is(":checked")){
            var id= $(checkboxes[i]).val() as string;
            ids.push(id);
          }
         
       }
       this.service.DeleteAll(ids).subscribe(s=>{
         this.getUsers();
         $("#btnClose").trigger("click");
       },ex=>console.log(ex));
    }
    
  }

  SelectAll(){
    var tbl=$('#tbl');
    var header=tbl.find('thead .ckheader');
    var item=tbl.find('tbody .ckitem');

    
    $(function(ready){
      item.on('change',function(){
        if($(this).is(':checked')){
          $(this).closest('tr').addClass('NewRowColor');
        }
        else{
          $(this).closest('tr').removeClass('NewRowColor');
        }
      });
      header.change(function(){
        
        // var c= this.checked;
        // item.prop("checked",c);
        item.trigger('check');
        if($(this).is(':checked')){
          $(item).closest('tr').addClass('NewRowColor');

        }
        else{
          $(item).closest('tr').removeClass('NewRowColor');

        }
      });
    });
  }




  

}
