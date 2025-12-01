import { Layout, Spin } from "antd";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useAppStore } from "@/app/store";
import { fetchMe } from "@/lib/axios";
import "./app.scss";

const { Content } = Layout;

function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useRouterState({
    select: (state) => state.location,
  });
  const isAuthRoute = pathname.startsWith("/login");
  const { user, setUser } = useAppStore();
  const [isBootstrapping, setIsBootstrapping] = useState(!isAuthRoute && !user);

  useEffect(() => {
    if (isAuthRoute && user) {
      navigate({ to: "/" });
    }
  }, [isAuthRoute, user, navigate]);

  useEffect(() => {
    let isMounted = true;
    const ensureUser = async () => {
      if (isAuthRoute) {
        setIsBootstrapping(false);
        return;
      }
      if (user) {
        setIsBootstrapping(false);
        return;
      }
      setIsBootstrapping(true);
      try {
        const profile = await fetchMe();
        if (isMounted) {
          setUser(profile);
        }
      } catch {
        if (isMounted) {
          setUser(null);
          const redirectSearch =
            pathname !== "/" ? { redirect: pathname } : undefined;
          navigate({
            to: "/login",
            search: redirectSearch,
            replace: true,
          });
        }
      } finally {
        if (isMounted) {
          setIsBootstrapping(false);
        }
      }
    };
    ensureUser();
    return () => {
      isMounted = false;
    };
  }, [isAuthRoute, user, setUser, navigate, pathname]);

  if (isAuthRoute) {
    return (
      <div className="auth-layout">
        <Outlet />
      </div>
    );
  }

  if (isBootstrapping) {
    return (
      <div className="app-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout className="app-layout">
      <Sidebar />
      <Layout className="app-content-layout">
        <Header />
        <Content className="app-content-body">
          <Outlet />
        </Content>
        <Footer />
      </Layout>
    </Layout>
  );
}
export default AppLayout;
