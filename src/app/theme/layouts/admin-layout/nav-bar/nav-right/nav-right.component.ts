// angular import
import { Component, inject, input, output } from '@angular/core';
import { SupabaseService } from 'src/app/services/supabase';
import { RouterModule, Router } from '@angular/router';

// project import

// icon
import { IconService, IconDirective } from '@ant-design/icons-angular';
import {
  BellOutline,
  SettingOutline,
  GiftOutline,
  MessageOutline,
  PhoneOutline,
  CheckCircleOutline,
  LogoutOutline,
  EditOutline,
  UserOutline,
  ProfileOutline,
  WalletOutline,
  QuestionCircleOutline,
  LockOutline,
  CommentOutline,
  UnorderedListOutline,
  ArrowRightOutline,
  GithubOutline
} from '@ant-design/icons-angular/icons';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgScrollbarModule } from 'ngx-scrollbar';

@Component({
  selector: 'app-nav-right',
  imports: [IconDirective, RouterModule, NgScrollbarModule, NgbNavModule, NgbDropdownModule],
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent {
  private iconService = inject(IconService);
  name = '';
  photo = '';
  user: any;

  styleSelectorToggle = input<boolean>();
  Customize = output();
  windowWidth: number;
  screenFull: boolean = true;

  // eslint-disable-next-line @angular-eslint/prefer-inject
  constructor(
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private supabase: SupabaseService,
    // eslint-disable-next-line @angular-eslint/prefer-inject
    private router: Router
  ) {
    this.GetLoggedInUser();
    this.windowWidth = window.innerWidth;
    this.iconService.addIcon(
      ...[
        CheckCircleOutline,
        GiftOutline,
        MessageOutline,
        SettingOutline,
        PhoneOutline,
        LogoutOutline,
        UserOutline,
        EditOutline,
        ProfileOutline,
        QuestionCircleOutline,
        LockOutline,
        CommentOutline,
        UnorderedListOutline,
        ArrowRightOutline,
        BellOutline,
        GithubOutline,
        WalletOutline
      ]
    );
  }
  async GetLoggedInUser() {
    let n = '';
    this.user = await this.supabase.getUser();
    alert('User Details:' + JSON.stringify(this.user));
    n = this.user.user_metadata.full_name;
    if (n != '') {
      this.name = this.user.user_metadata.full_name;
      this.photo = this.user.user_metadata.avatar_url;
    } else {
      this.name = this.user.email;
      this.photo = 'assets/images/user/avatar-2.jpg';
    }
  }

  profile = [
    {
      icon: 'edit',
      title: 'Edit Profile'
    },
    {
      icon: 'user',
      title: 'View Profile'
    },
    {
      icon: 'profile',
      title: 'Social Profile'
    },
    {
      icon: 'wallet',
      title: 'Billing'
    },
    {
      icon: 'logout',
      title: 'Logout'
    }
  ];

  setting = [
    {
      icon: 'question-circle',
      title: 'Support'
    },
    {
      icon: 'user',
      title: 'Account Settings'
    },
    {
      icon: 'lock',
      title: 'Privacy Center'
    },
    {
      icon: 'comment',
      title: 'Feedback'
    },
    {
      icon: 'unordered-list',
      title: 'History'
    }
  ];
  async Logout() {
    // eslint-disable-next-line no-empty

    try {
      await this.supabase.signOut();
      // eslint-disable-next-line no-empty
      this.router.navigate(['/login']);
    } catch (err) {
      // eslint-disable-next-line no-empty
    } finally {
    }
  }
}
