import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const modules = [FormsModule, ReactiveFormsModule, HttpClientModule];

@NgModule({
  imports: modules,
  exports: modules,
})
export class SharedModule {}
