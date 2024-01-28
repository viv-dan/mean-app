import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Post } from './post.model';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated: Subject<Post[]> = new Subject<Post[]>();

  constructor(private http: HttpClient) {}

  getPosts() {
    this.http
      .get<{ message: string; posts: Post[] }>('http:localhost:3000/api/posts')
      .subscribe((data) => {
        this.posts = data.posts;
        this.postsUpdated.next(this.posts);
      });
  }

  get PostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPosts(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.posts.push(post);
    this.postsUpdated.next([...this.posts]);
  }
}
