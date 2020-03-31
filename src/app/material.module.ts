import {NgModule} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input'; //wat is dit???
import { MatTableModule } from '@angular/material/table' 

@NgModule({
imports: [MatButtonModule, MatInputModule, MatTableModule],
exports: [MatButtonModule, MatInputModule, MatTableModule]
})

export class MaterialModule {
    
}