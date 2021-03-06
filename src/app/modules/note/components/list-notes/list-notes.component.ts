import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { getDate } from 'src/app/common/util';
import { NoteDTO } from '../../dtos/note-dto';
import { NoteDataService } from '../../services/note-data.service';
import { NoteService } from '../../services/note.service';

@Component({
  selector: 'app-list-notes',
  templateUrl: './list-notes.component.html',
})
export class ListNotesComponent implements OnInit {
  notes: NoteDTO[];

  fromDate: string;
  toDate: string;

  constructor(
    private noteService: NoteService,
    private noteData: NoteDataService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.subscribeQueryParams();
    this.noteData.onChange$.subscribe((_) => this.findAll());
  }

  onEdit(note: NoteDTO): void {
    this.noteData.edit(note);
  }

  onDelete(id: number): void {
    this.noteService.delete(id).subscribe((_) => this.findAll());
  }

  private subscribeQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      this.fromDate = params['fromDate'] || getDate();
      this.toDate = params['toDate'] || getDate();
      this.findAll();
    });
  }

  private findAll(): void {
    this.noteService
      .findAll(this.fromDate, this.toDate)
      .subscribe((notes: NoteDTO[]) => {
        this.notes = notes;
        this.noteData.total(this.noteService.getTotal(notes));
      });
  }
}
