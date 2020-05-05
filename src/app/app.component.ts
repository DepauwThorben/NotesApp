import { Component } from '@angular/core';
import { APIService } from './api.service';
import { NgModule } from '@angular/core';
import { Subscriber } from 'rxjs';
import { stringify } from 'querystring';
import { element } from 'protractor';

interface User {
  name: string;
  id: Number;
}

interface Notes {
  id: number,
  content: string,
  userId: number,
  categorie: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {

  title = 'Notes';

  userList: Array<User>;
  noteList: Array<Notes>;
  service: APIService;
  displayedColumnsUsers: string[] = ["Name", "Note", "ShowAllNotes", "ButtonRemoveAll"]; 
  displayedColumnsNotes: string[] = ["content","categorie","EditNote","DeleteNote"];
 
 
  
  insertAddedName: string;
  insertNameNote: string;
  addNote: string;
  editNote: string;
  searchNote: string;
  categorie: string;
  isNoteAdded: boolean = false;
  showNotes: boolean = false;
  user: string;
  addNameMessage: string;
  addMessage:string;
  message;
  editMessage: string;
  deleteUserMessage: string;
  isUserDeleted: boolean=false;
  addUser:boolean=false;
  isNoteEdit:boolean=false;
  noteId;
  userId;
  content:string;
  editContent:string;
  searchMessage:string;
  searchContent:string;
 
  constructor(apiService: APIService) {
    this.service = apiService;
    apiService.getUsers().subscribe((data: Array<User>) => {
      console.log(data);
      this.userList = data;
    });
  }

  UserlistRefresh = () => this.service.getUsers().subscribe((data: Array<User>) => {
    console.log(data);
    this.userList = data;
  });

  NoteListRefresh = (naamAlleNotes:string) => this.service.GetNotes(naamAlleNotes).subscribe((data:Array<Notes>) => {
    console.log(data);
    this.noteList=data;
}); 

  PopUpAdduser = () => {
    this.addUser=true;
    this.isNoteAdded=false;
    this.showNotes=false;
  }

  AddUserComponent = () => {
    if (this.insertAddedName == undefined) {
      this.addNameMessage = "u hebt niets ingevuld. ";
      return;
    }

    this.service.AddUser(this.insertAddedName).subscribe((response) => {
      console.log(response);

      this.addNameMessage = JSON.stringify(response);
      this.message = JSON.parse(this.addNameMessage);
      if (this.message.success == undefined) {
        this.addNameMessage = this.message.error;
      } else {
        this.addNameMessage = this.message.success;
      }

      this.showNotes = false;
      this.isNoteAdded = false;
      this.isUserDeleted=false;
      this.insertNameNote = "";
      this.UserlistRefresh();
      this.insertAddedName = "";

    });
  }

  AddNoteComponent = () => {

    if (this.addNote === undefined) {
      this.addMessage = "u hebt niets ingevuld. ";
      return;
    }

    //hier addNote aanpassen met url-encoding

    

    console.log("Note toegevoegd");
    this.service.AddNote(this.insertNameNote, this.addNote,this.categorie).subscribe((response) => {
      console.log(response);
      this.addMessage = JSON.stringify(response);
      this.message = JSON.parse(this.addMessage);
      if (this.message.success == undefined) {
        this.addMessage = this.message.error;
      } else {
        this.addMessage = this.message.success;
      }


       this.isNoteAdded = true;
      this.addNote = "";
      this.addNameMessage = "";
      this.showNotes = false;
      this.isUserDeleted=false;
      this.addUser=false;
    
    });
  
  }

  AddNoteComponentTabel = (naamaddNote: string) => {
    console.log("addNoteTabel: " + naamaddNote);
    this.categorie = "Private"
    this.addMessage="";
    this.isNoteAdded = true;
    this.insertNameNote = naamaddNote;
    this.showNotes = false;
    this.isUserDeleted=false;
    this.addUser=false;
    this.addNameMessage = "";
  }


  DeleteUserEnNoteComponent = (naamVerwijderen: string) => {

    this.service.DeleteUserNote(naamVerwijderen).subscribe((response) => {
      this.deleteUserMessage = JSON.stringify(response);
      this.message = JSON.parse(this.deleteUserMessage);
      console.log("een response: " + this.message.success);
      console.log(response);


      if (this.message.success == undefined) {
        this.deleteUserMessage = this.message.error;
      } else {
        this.deleteUserMessage = this.message.success;
      }

      this.insertAddedName = "",
        this.UserlistRefresh();
      this.showNotes = false;
      this.addNameMessage = "";
      this.isNoteAdded = false;
      this.addUser=false;
      this.insertNameNote = "";
      this.isUserDeleted=true;
    });
  }



   

  GetNotesComponent = (naamAlleNotes: string,userId) => {
    this.categorie = "NoCategorie";
    console.log("toon alle Notes van:" + naamAlleNotes);
    this.service.GetNotes(naamAlleNotes).subscribe((data: Array<Notes>) => {
      console.log(data);
      this.noteList = data;
      this.showNotes = true;
      this.user = naamAlleNotes;
      console.log(this.noteList);
      this.addNameMessage = "";
      this.isNoteAdded = false;
      this.isUserDeleted=false;
      this.insertNameNote = "";
      this.addUser=false;
      this.userId = userId;
      this.isNoteEdit = false;
      
    });
  }

  EditNoteComponent = (content:string,categorie:string,id) =>  {  
   
    this.isNoteEdit = true;
    console.log("editNoteTabel: " + id);
    this.noteId = id;
    this.content = content;
    this.categorie = categorie;
    this.addMessage="";
    this.isNoteAdded = false;
    this.insertNameNote = this.user;
    this.showNotes = false;
    this.isUserDeleted=false;
    this.addUser=false;
    this.addNameMessage = "";
    this.editNote = content;

  }

  SearchListRefresh = (userId,content:string,categorie:string) => this.service.SearchNote(userId,content,categorie).subscribe((data:Array<Notes>) => {
    console.log(data);
    this.noteList=data;
}); 
  SearchNote = () =>
  {
    
     
        this.SearchListRefresh(this.userId,this.content,this.categorie);
    
        this.addNameMessage = "";
        this.isNoteAdded = false;
        this.isUserDeleted=false;
        this.insertNameNote = "";
        this.addUser=false;
        this.isNoteEdit = false;
      
    
  }

  
  EditNote = () =>
  {

   if(this.editNote == null)
    {
      this.editContent = this.content;
    }
    else{
        this.editContent = this.editNote;
    }


    this.service.EditNote(this.noteId,this.editContent,this.categorie).subscribe((response) => {
      this.deleteUserMessage = JSON.stringify(response);
      this.message = JSON.parse(this.deleteUserMessage);
      console.log("een response: " + this.message.success);
      console.log(response);


     

      this.insertAddedName = "",
      this.NoteListRefresh(this.user);
      this.showNotes = true;
      this.addNameMessage = "";
      this.isNoteAdded = false;
      this.addUser=false;
      this.insertNameNote = "";
      this.isUserDeleted=false;
      this.isNoteEdit = false;
    });
  }
   RemoveNote = (id) => {

    this.service.DeleteNote(id).subscribe((response) => {
      this.deleteUserMessage = JSON.stringify(response);
      this.message = JSON.parse(this.deleteUserMessage);
      console.log("een response: " + this.message.success);
      console.log(response);


      if (this.message.success == undefined) {
        this.deleteUserMessage = this.message.error;
      } else {
        this.deleteUserMessage = this.message.success;
      }

      this.NoteListRefresh(this.user);
      this.insertAddedName = "",
      this.showNotes = true;
      this.addNameMessage = "";
      this.isNoteAdded = false;
      this.addUser=false;
      this.insertNameNote = "";
      this.isUserDeleted=false;
    });
  }
}
