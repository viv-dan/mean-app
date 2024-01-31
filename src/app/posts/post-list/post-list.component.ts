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
  isLoading = false;
  private subscibed: Subscription;

  constructor(public postService: PostService) {}

  ngOnDestroy() {
    this.subscibed.unsubscribe();
  }

  onDelete(id: string) {
    this.postService.deletePost(id);
  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts();
    this.subscibed = this.postService.PostsUpdateListener.subscribe(
      (posts: Post[]) => {
        this.posts = posts;
        this.isLoading = false;
      }
    );
  }
}
