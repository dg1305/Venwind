import type { RouteObject } from "react-router-dom";
import { lazy } from "react";
import NotFound from "../pages/NotFound";

// Lazy load all routes for code splitting and faster initial load
const Home = lazy(() => import("../pages/home/page"));
const AboutUs = lazy(() => import("../pages/about/page"));
const Products = lazy(() => import("../pages/products/page"));
const Technology = lazy(() => import("../pages/technology/page"));
const Sustainability = lazy(() => import("../pages/sustainability/page"));
const Careers = lazy(() => import("../pages/careers/page"));
const Contact = lazy(() => import("../pages/contact/page"));
const InvestorRelations = lazy(() => import("../pages/investor-relations/page"));
const AdminPage = lazy(() => import("../pages/admin/page"));
const AdminIndexPage = lazy(() => import("../pages/admin/index/page"));
const AdminHomePage = lazy(() => import("../pages/admin/home/page"));
const AdminAboutPage = lazy(() => import("../pages/admin/about/page"));
const AdminProductsPage = lazy(() => import("../pages/admin/products/page"));
const AdminTechnologyPage = lazy(() => import("../pages/admin/technology/page"));
const AdminSustainabilityPage = lazy(() => import("../pages/admin/sustainability/page"));
const AdminCareersPage = lazy(() => import("../pages/admin/careers/page"));
const AdminContactPage = lazy(() => import("../pages/admin/contact/page"));
const AdminInvestorRelationsPage = lazy(() => import("../pages/admin/investor-relations/page"));
const AdminUsersPage = lazy(() => import("../pages/admin/users/page"));
const LoginPage = lazy(() => import("../pages/login/page"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/about-us",
    element: <AboutUs />,
  },
  {
    path: "/products",
    element: <Products />,
  },
  {
    path: "/technology",
    element: <Technology />,
  },
  {
    path: "/sustainability",
    element: <Sustainability />,
  },
  {
    path: "/careers",
    element: <Careers />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/investor-relations",
    element: <InvestorRelations />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/admin",
    element: <AdminIndexPage />,
  },
  {
    path: "/admin/home",
    element: <AdminHomePage />,
  },
  {
    path: "/admin/about",
    element: <AdminAboutPage />,
  },
  {
    path: "/admin/products",
    element: <AdminProductsPage />,
  },
  {
    path: "/admin/technology",
    element: <AdminTechnologyPage />,
  },
  {
    path: "/admin/sustainability",
    element: <AdminSustainabilityPage />,
  },
  {
    path: "/admin/careers",
    element: <AdminCareersPage />,
  },
  {
    path: "/admin/contact",
    element: <AdminContactPage />,
  },
  {
    path: "/admin/investor-relations",
    element: <AdminInvestorRelationsPage />,
  },
  {
    path: "/admin/users",
    element: <AdminUsersPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
