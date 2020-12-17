import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePage } from './home.page';

const routes: Routes = [
  {
    path: '',
    redirectTo:'/home/tabs/maps',
    pathMatch:'full'
  },
  {
    path:'tabs',
    component: HomePage,
    children:[
      {
        path:'maps',
        loadChildren:()=>import('./maps/maps.module').then(m=>m.MapsPageModule)
      },
      {
        path:'profile',
        loadChildren:()=>import('./profile/profile.module').then(m=>m.ProfilePageModule)
      },
      {
        path:'friends',
        loadChildren:()=>import('./friends/friends.module').then(m=>m.FriendsPageModule)
      }
    ]
  },
  {
    path: 'friends',
    loadChildren: () => import('./friends/friends.module').then( m => m.FriendsPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomePageRoutingModule {}
