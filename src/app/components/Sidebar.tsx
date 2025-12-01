import type React from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Home, BookOpen, Settings, ShoppingCart } from "lucide-react";
import type { MenuProps } from "antd";
import { LAYOUT_CONSTANTS } from "../constants";

const { Sider } = Layout;

interface IMenuItem {
  key: string;
  path: string;
  icon: React.ReactNode;
  label: string;
}

const menuItemsConfig: IMenuItem[] = [
  {
    key: "dashboard",
    path: "/",
    icon: <Home size={20} />,
    label: "Trang chủ",
  },
  {
    key: "books",
    path: "/books",
    icon: <BookOpen size={20} />,
    label: "Quản lý truyện tranh",
  },
  {
    key: "orders",
    path: "/orders",
    icon: <ShoppingCart size={20} />,
    label: "Quản lý đơn hàng",
  },
  {
    key: "settings",
    path: "/settings",
    icon: <Settings size={20} />,
    label: "Cài đặt",
  },
];

function Sidebar() {
  const navigate = useNavigate();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    const menuItem = menuItemsConfig.find((item) => item.key === e.key);
    if (menuItem) {
      navigate({ to: menuItem.path });
    }
  };

  const handleLogoClick = () => {
    navigate({ to: "/" });
  };

  const menuItems: MenuProps["items"] = menuItemsConfig.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }));

  const selectedKeys = menuItemsConfig
    .filter((item) => {
      if (item.path === "/") {
        return currentPath === "/";
      }
      return currentPath.startsWith(item.path);
    })
    .map((item) => item.key);

  return (
    <Sider width={LAYOUT_CONSTANTS.SIDEBAR_WIDTH} className="app-sidebar">
      <div
        className="sidebar-logo"
        onClick={handleLogoClick}
        role="button"
        tabIndex={0}
      >
        <h2>MangaReader CMS</h2>
      </div>
      <Menu
        mode="inline"
        items={menuItems}
        className="sidebar-menu"
        selectedKeys={selectedKeys}
        onClick={handleMenuClick}
      />
    </Sider>
  );
}

export default Sidebar;
