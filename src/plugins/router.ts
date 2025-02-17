import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import HomeLayout from "../pages/home/HomeLayout.vue";
import HomePage from "../pages/home/HomePage.vue";
import NearbyPage from "../pages/home/NearbyPage.vue";
import FavoritesPage from "../pages/home/FavoritesPage.vue";
import MePage from "../pages/home/MePage.vue";
import SigninPage from "../pages/SigninPage.vue";
import TrackingPage from "../pages/home/TrackingPage.vue";
import TimerListPage from "../pages/home/TimerListPage.vue";
const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: HomeLayout,
    redirect: "/timer-list",
    children: [
      {
        path: "/home",
        component: HomePage,
      },
      {
        path: "/timer",
        component: TrackingPage,
      },
      {
        path: "/timer-list",
        component: TimerListPage,
      },
      {
        path: "/nearby",
        component: NearbyPage,
      },
      {
        path: "/favorites",
        component: FavoritesPage,
      },
      {
        path: "/me",
        component: MePage,
      },
    ],
  },
  {
    path: "/signin",
    component: SigninPage,
  },
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
});
