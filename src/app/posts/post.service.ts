import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
      .get<{ message: string; posts: any }>('http://localhost:3000/api/posts')
      .pipe(
        map((postData) => {
          return postData.posts.map((post) => {
            return { title: post.title, content: post.content, id: post._id };
          });
        })
      )
      .subscribe((postData) => {
        this.posts = postData;
        this.postsUpdated.next(this.posts);
      });
  }

  get PostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  updatePostWithId(postId: string, title: string, content: string) {
    const post: Post = { id: postId, title: title, content: content };
    this.http
      .patch<{ message: string }>(
        'http://localhost:3000/api/posts/' + postId,
        post
      )
      .subscribe((responseData) => {
        for (let msg of this.posts) {
          if (msg.id == postId) {
            msg.content = post.content;
            msg.content = post.title;
          }
        }
        this.postsUpdated.next([...this.posts]);
        console.log(responseData.message);
      });
  }

  getPostWithId(postId: string) {
    return this.http.get<Post>('http://localhost:3000/api/posts/' + postId);
  }

  deletePost(id: string) {
    this.http
      .delete<{ message: string }>('http://localhost:3000/api/posts/' + id)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.posts = this.posts.filter((post) => post.id != id);
        this.postsUpdated.next([...this.posts]);
      });
  }

  addPosts(title: string, content: string) {
    const post: Post = { id: null, title: title, content: content };
    this.http
      .post<{ message: string; id: string }>(
        'http://localhost:3000/api/posts',
        post
      )
      .subscribe((response) => {
        console.log(response.message);
        post.id = response.id;
        this.posts.push(post);
        this.postsUpdated.next([...this.posts]);
      });
  }
}
