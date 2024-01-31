import { Component, OnInit } from '@angular/core';

import { Post } from '../post.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrl: './post-create.component.css',
})
export class PostCreateComponent implements OnInit {
  private mode: string;
  isLoading: boolean = false;
  form: FormGroup;
  private postId: string;
  post: Post = { title: '', content: '', id: '' };
  constructor(
    public postService: PostService,
    public route: ActivatedRoute,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)],
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
    });
    this.route.paramMap.subscribe((paramMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPostWithId(this.postId).subscribe((respData) => {
          this.post = respData;
          this.isLoading = false;
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
          });
        });
      } else {
        this.mode = 'create';
        this.postId = null;
      }
    });
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'edit') {
      this.postService.updatePostWithId(
        this.postId,
        this.form.value.posttitle,
        this.form.value.postcontent
      );
    } else {
      this.postService.addPosts(
        this.form.value.posttitle,
        this.form.value.postcontent
      );
    }
    this.router.navigateByUrl('/');
    this.form.reset();
  }
}
