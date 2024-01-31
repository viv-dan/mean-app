import { Component, OnInit } from '@angular/core';

import { Post } from '../post.model';
import { NgForm } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent implements OnInit {
  private mode: string;
  private postId: string;
  post: Post = { title: '', content: '', id: '' };
  constructor(public postService: PostService, public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.postService.getPostWithId(this.postId).subscribe((respData) => {
          this.post = respData;
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'edit') {
      this.postService.updatePostWithId(
        this.postId,
        form.value.posttitle,
        form.value.postcontent
      );
    } else {
      this.postService.addPosts(form.value.posttitle, form.value.postcontent);
    }
    form.resetForm();
  }
}
