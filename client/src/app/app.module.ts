import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { LoginComponent } from './login/login.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { UserHomepageComponent } from './user-homepage/user-homepage.component';
import { SecurityPrivacyPolicyComponent } from './security-privacy-policy/security-privacy-policy.component';
import { AcceptableUsePolicyComponent } from './acceptable-use-policy/acceptable-use-policy.component';
import { DmcaNoticeTakedownPolicyComponent } from './dmca-notice-takedown-policy/dmca-notice-takedown-policy.component';
import { NonUserHomepageComponent } from './non-user-homepage/non-user-homepage.component';
import { QueryTrackComponent } from './query-track/query-track.component';
import { TopPlaylistsComponent } from './top-playlists/top-playlists.component';
import { CreatePlaylistComponent } from './create-playlist/create-playlist.component';
import { DeletePlaylistComponent } from './delete-playlist/delete-playlist.component';
import { AddReviewComponent } from './add-review/add-review.component';
import { AdminHomepageComponent } from './admin-homepage/admin-homepage.component';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'security-privacy-policy', component: SecurityPrivacyPolicyComponent },
  { path: 'dmca-notice-takedown-policy', component: DmcaNoticeTakedownPolicyComponent },
  { path: 'acceptable-use-policy', component: AcceptableUsePolicyComponent },
  { path: 'non-user-homepage', component: NonUserHomepageComponent},
  { path: 'query-track', component: QueryTrackComponent},
  { path: 'top-playlists', component: TopPlaylistsComponent},
  { path: 'user-homepage', component: UserHomepageComponent},
  { path: 'create-playlist', component: CreatePlaylistComponent},
  { path: 'delete-playlist', component: DeletePlaylistComponent},
  { path: 'add-review', component: AddReviewComponent},
  { path: 'admin-homepage', component: AdminHomepageComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    LoginComponent,
    CreateAccountComponent,
    UserHomepageComponent,
    SecurityPrivacyPolicyComponent,
    AcceptableUsePolicyComponent,
    DmcaNoticeTakedownPolicyComponent,
    NonUserHomepageComponent,
    QueryTrackComponent,
    TopPlaylistsComponent,
    CreatePlaylistComponent,
    DeletePlaylistComponent,
    AddReviewComponent,
    AdminHomepageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot(routes),
    FormsModule,
    HttpClientModule
  ],
  exports: [RouterModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
