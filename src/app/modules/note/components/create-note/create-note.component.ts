import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { getDate } from 'src/app/common/util';
import { NoteService } from 'src/app/modules/note/services/note.service';
import { NoteDTO } from '../../dtos/note-dto';
import { NoteInDTO } from '../../dtos/note-in-dto';
import { TransactionType } from '../../enums/transaction-type.enum';
import { NoteDataService } from '../../services/note-data.service';

@Component({
  selector: 'app-create-note',
  templateUrl: './create-note.component.html',
})
export class CreateNoteComponent implements OnInit {
  form: FormGroup;

  note: NoteDTO;
  editMode = false;

  constructor(
    private fb: FormBuilder,
    private noteService: NoteService,
    private noteData: NoteDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.noteData.onEdit$.subscribe((note: NoteDTO) => {
      this.note = note;
      note && this.patchForm();
    });
  }

  save(): void {
    this.noteService.save('', this.compileInDTO()).subscribe((_) => {
      this.initForm();
      this.noteData.changed();
    });
  }

  update(): void {
    this.noteService
      .update(`/${this.note.id}`, this.compileInDTO())
      .subscribe((_) => {
        this.initForm();
        this.noteData.changed();
        this.editMode = false;
      });
  }

  private initForm(): void {
    this.route.queryParams.subscribe((params) => {
      const date = params.date;
      this.form = this.fb.group({
        amount: [null, Validators.required],
        note: ['', Validators.required],
        date: [date || getDate()],
        txnType: [TransactionType.DEBIT],
      });
    });
  }

  private patchForm(): void {
    this.editMode = true;
    this.form.patchValue({
      amount: this.note.amount,
      note: this.note.note,
      date: this.note.createdDate,
      txnType: this.note.txnType,
    });
  }

  private compileInDTO(): NoteInDTO {
    const form = this.form.controls;
    return {
      amount: form.amount.value,
      note: form.note.value,
      createdDate: form.date.value,
      txnType: form.txnType.value,
    };
  }
}
