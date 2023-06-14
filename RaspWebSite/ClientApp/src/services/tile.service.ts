import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TileService {
  constructor(private http: HttpClient, @Inject('API_URL') private apiUrl: string) { }

  public getTiles(): Observable<Tile[]> {
    return this.http.get<Tile[]>(this.apiUrl + 'entries/getall');
  }

  public getTile(id: number): Observable<Tile> {
    return this.http.get<Tile>(this.apiUrl + 'entries/get/' + id.toString());
  }

  public addTile(tile: TileDTO): Observable<Tile> {
    return this.http.post<Tile>(this.apiUrl + 'entries/add', tile);
  }

  public addTag(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(this.apiUrl + 'tags/add', tag);
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
