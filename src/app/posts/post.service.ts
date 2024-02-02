import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { Post } from './post.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private posts: Post[] = [];
  private postsUpdated: Subject<{
    posts: Post[];
    postCount: number;
  }> = new Subject<{
    posts: Post[];
    postCount: number;
  }>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; posts: any; maxPosts: number }>(
        'http://localhost:3000/api/posts' + queryParams
      )
      .pipe(
        map((postData) => {
          return {
            posts: postData.posts.map((post) => {
              return {
                title: post.title,
                content: post.content,
                id: post._id,
                imagePath: post.imagePath,
              };
            }),
            maxPosts: postData.maxPosts,
          };
        })
      )
      .subscribe((postData) => {
        this.posts = postData.posts;
        this.postsUpdated.next({
          posts: this.posts,
          postCount: postData.maxPosts,
        });
      });
  }

  get PostsUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  updatePostWithId(
    postId: string,
    title: string,
    content: string,
    image: File | string
  ) {
    let post;
    if (typeof image === 'object') {
      post = new FormData();
      post.append('id', postId);
      post.append('title', title);
      post.append('content', content);
      post.append('image', image, title);
    } else {
      post = {
        id: postId,
        title: title,
        content: content,
        imagePath: image,
      };
    }
    this.http
      .patch('http://localhost:3000/api/posts/' + postId, post)
      .subscribe((responseData) => {
        this.router.navigateByUrl('/');
      });
  }

  getPostWithId(postId: string) {
    return this.http.get<Post>('http://localhost:3000/api/posts/' + postId);
  }

  deletePost(id: string) {
    return this.http.delete<{ message: string }>(
      'http://localhost:3000/api/posts/' + id
    );
  }

  addPosts(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string; post: Post }>(
        'http://localhost:3000/api/posts',
        postData
      )
      .subscribe((response) => {
        this.router.navigateByUrl('/');
      });
  }
}
