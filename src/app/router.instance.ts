import {
  createRootRoute,
  createRouter,
  createRoute,
} from "@tanstack/react-router";
import { z } from "zod";
import { DashboardPage } from "@/features/dashboard";
import {
  BooksPage,
  BookDetailPage,
  ChapterDetailPage,
  ChapterEditPage,
} from "@/features/books";
import { OrdersPage } from "@/features/orders";
import { LoginPage } from "@/features/auth";
import AppLayout from "./app";
const rootRoute = createRootRoute({
  component: AppLayout,
});
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: LoginPage,
  validateSearch: z.object({
    redirect: z.string().optional(),
  }),
});
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: DashboardPage,
});
const booksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books",
  component: BooksPage,
});
const bookDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books/$slug",
  component: BookDetailPage,
});
const chapterDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books/$bookSlug/chapters/$chapterSlug",
  component: ChapterDetailPage,
});
const chapterEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/books/$bookSlug/chapters/$chapterSlug/edit",
  component: ChapterEditPage,
});
const ordersRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/orders",
  component: OrdersPage,
});
rootRoute.addChildren([
  loginRoute,
  indexRoute,
  booksRoute,
  bookDetailRoute,
  chapterDetailRoute,
  chapterEditRoute,
  ordersRoute,
]);

export const router = createRouter({
  routeTree: rootRoute,
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
