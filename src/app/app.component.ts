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
  displayedColumnsNotes: string[] = ["content"];
 
  insertAddedName: string;
  insertNameNote: string;
  addNote: string;
  isNoteAdded: boolean = false;
  showNotes: boolean = false;
  user: string;
  addNameMessage: string;
  addMessage:string;
  message;

  deleteUserMessage: string;
  isUserDeleted: boolean=false;
  addUser:boolean=false;

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
    this.service.AddNote(this.insertNameNote, this.addNote).subscribe((response) => {
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



  // NoteListRefresh = (naamAlleNotes:string) => this.service.GetNotes(naamAlleNotes).subscribe((data:Array<Notes>) => {
  //     console.log(data);
  //     this.noteList=data;
  //  });

  GetNotesComponent = (naamAlleNotes: string) => {
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
    });
  }
}
