import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl: string) { }

  public getTiles(): Observable<Tile[]> {
    return this.http.get<Tile[]>(this.apiUrl + 'entries/getall');
  }

  public addTile(tile: TileDTO): Observable<Tile> {
    return this.http.post<Tile>(this.apiUrl + 'entries/add', tile);
  }

  public removeTile(tile: Tile): Observable<Tile> {
    return this.http.delete<Tile>(this.apiUrl + 'entries/remove/' + tile.id.toString());
  }

  public editTile(tile: TileDTO): Observable<Tile> {
    return this.http.put<Tile>(this.apiUrl + 'entries/edit', tile);
  }

  public addTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.apiUrl + 'tags/add', tag);
  }

  public editTag(tag: Tag): Observable<Tag> {
    return this.http.put<Tag>(this.apiUrl + 'tags/edit', tag);
  }

  public removeTag(tag: Tag): Observable<Tag> {
    return this.http.delete<Tag>(this.apiUrl + 'tags/remove/' + tag.id.toString());
  }

  public getTags(): Observable<Tag[]> {
    return this.http.get<Tile[]>(this.apiUrl + 'tags/getall');
  }
}

export interface Tile {
  id: number;
  pictureId: string;
  tags: Tag[];
  description: string;
  link: string;
  name: string;
}

export interface TileDTO {
  id?: number;
  pictureId: string;
  tagIds: number[];
  description: string;
  link: string;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}
