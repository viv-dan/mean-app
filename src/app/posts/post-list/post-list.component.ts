import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  private subscibed: Subscription;

  constructor(public postService: PostService) {}

  ngOnDestroy() {
    this.subscibed.unsubscribe();
  }

  ngOnInit() {
    this.postService.getPosts();
    this.subscibed = this.postService.PostsUpdateListener.subscribe(
      (posts: Post[]) => {
        this.posts = posts;
      }
    );
  }
}
