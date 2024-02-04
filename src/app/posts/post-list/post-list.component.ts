import { Component, OnDestroy, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { authService } from '../../auth/auth.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.css',
})
export class PostListComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  postsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  isUserAuthenticated = false;
  userId: string;
  private subscibed: Subscription;
  private authStatusSubscription: Subscription;

  constructor(
    public postService: PostService,
    private authService: authService
  ) {}

  ngOnDestroy() {
    this.subscibed.unsubscribe();
    this.authStatusSubscription.unsubscribe();
  }

  onDelete(id: string) {
    this.isLoading = true;
    this.postService.deletePost(id).subscribe(() => {
      this.postService.getPosts(this.postsPerPage, this.currentPage);
      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.postsPerPage, 1);
    this.userId = this.authService.getUserId();
    this.subscibed = this.postService.PostsUpdateListener.subscribe(
      (postData: { posts: Post[]; postCount: number }) => {
        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
        this.isLoading = false;
      }
    );
    this.isUserAuthenticated = this.authService.getAuthStatus();
    this.authStatusSubscription = this.authService
      .getAuthStatusListener()
      .subscribe((result) => {
        this.isUserAuthenticated = result;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageEvent: PageEvent) {
    this.currentPage = pageEvent.pageIndex + 1;
    this.postsPerPage = pageEvent.pageSize;
    this.postService.getPosts(this.postsPerPage, this.currentPage);
    console.log(pageEvent);
  }
}
