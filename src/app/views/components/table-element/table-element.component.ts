import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { row } from '../../../entities/customElements';
import { ElementService } from '../../../services/element/element.service';

@Component({
  selector: 'app-table-element',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './table-element.component.html',
  styleUrl: './table-element.component.css'
})
export class TableElementComponent {
  @Input() options: any = {};
  @Input() style: any = {};
  @Input() elementRef: any = {};
  @Input() styleRelative: any = null;

  editableRows: boolean[] = [];
  editableCaptions: boolean = true;

  constructor(private elementService: ElementService) { }

  ngOnChanges() {
    for (let i = 0; i < this.options.row.length; i++) {
      this.editableRows.push(true);
    }
  }
  removeRow(rowIndex: number): void {
    this.options.row.splice(rowIndex, 1);
  }

  updateCellValue(rowIndex: number, colIndex: number, newValue: string): void {
    this.options.row[rowIndex]['cells'][colIndex] = newValue;
  }

  edit(row: row) {
    //console.log(row.cells);
  }


  isRowEditable(numberRow: number): boolean | null {
    return this.editableRows[numberRow];
  }

  editRow(indis: number) {
    this.editableRows[indis] = !this.editableRows[indis];

    let group: any = {};

    group.element = {};

    this.options.row[indis].cells.forEach((cell: any, i: number) => {
      group.element[`caption_${i}`] = cell;
    });

    group['id'] = this.elementRef.id;

    this.elementService.selectedElement.next(group);
  }


  addRow() {
    this.addRows(this.options.captions.cells.length);
  }

  addRows(cellCount: number): void {
    const newRow: any = { cells: [] };

    for (let i = 0; i < cellCount; i++) {
      newRow.cells.push('empty');
    }

    this.options.row.push({ cells: ['empty', 'empty'] });
    this.editableRows.push(false);
  }

}
