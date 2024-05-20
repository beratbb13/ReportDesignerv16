import { Component, Input } from '@angular/core';
import { FolderService } from '../../../services/folder/folder.service';
import { folder } from '../../../entities/customElements';

@Component({
  selector: 'app-templates',
  standalone: true,
  imports: [],
  templateUrl: './templates.component.html',
  styleUrl: './templates.component.css'
})
export class TemplatesComponent {

  constructor(private folderService: FolderService) { }

  @Input() mainFolder: folder | null = null;
  public static count: number = 0;
  @Input() isopen: boolean = false;

  keys: { [key: number]: number } = {}; // id'yi key, count'u value olarak tutacak obje


  ngOnInit() {
    /*this.folderService.folders.asObservable().subscribe(res => {
      this.mainFolder = res;
      console.log(this.mainFolder);
    });*/
  }

  ngOnChanges() {
    if (this.mainFolder) {
      this.keys[this.mainFolder.id] = TemplatesComponent.count; // mainFolder'ın id'sini key olarak, count'u value olarak ekleyin
      TemplatesComponent.count = TemplatesComponent.count + 1;
    }
  }

  getCount(id: number) {
    return this.keys[id];
  }
}
