import { Layout, Dropdown, Avatar, Space } from "antd";
import { useNavigate } from "@tanstack/react-router";
import { User, LogOut } from "lucide-react";
import type { MenuProps } from "antd";
import { useState } from "react";
import { useAppStore } from "@/app/store";
import { useToast } from "@/hooks/useToast";
import { logoutRequest } from "@/features/auth/services/auth.service";
import NotificationBell from "@/features/notifications/components/NotificationBell";

const { Header: AntHeader } = Layout;

function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAppStore();
  const toast = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const getUserInitials = (name?: string): string => {
    if (!name) {
      return "U";
    }
    return name
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }
    setIsLoggingOut(true);
    try {
      await logoutRequest();
      toast.success("Đã đăng xuất", "Hẹn gặp lại bạn sau.");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra, vui lòng thử lại.";
      toast.error("Không thể đăng xuất", message);
    } finally {
      logout();
      setIsLoggingOut(false);
      navigate({ to: "/login" });
    }
  };

  const handleMenuClick: MenuProps["onClick"] = (e) => {
    switch (e.key) {
      case "profile":
        // TODO: Add profile route when available
        // navigate({ to: "/profile" });
        break;
      case "settings":
        navigate({ to: "/" });
        // TODO: Navigate to settings when route is available
        break;
      case "logout":
        void handleLogout();
        break;
      default:
        break;
    }
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <User size={16} />,
      label: "Thông tin cá nhân",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogOut size={16} />,
      label: isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất",
      danger: true,
    },
  ];

  const displayName = user?.name?.trim() || "User";
  const displayInitials = getUserInitials(user?.name);
  const avatarSrc = user?.avatar;

  return (
    <AntHeader className="app-header">
      <div className="header-content">
        <div className="header-left"></div>
        <div className="header-right">
          <Space size="middle">
            <NotificationBell />
            <Dropdown
              menu={{ items: userMenuItems, onClick: handleMenuClick }}
              placement="bottomRight"
              trigger={["click"]}
            >
              <Space className="user-dropdown" style={{ cursor: "pointer" }}>
                <Avatar
                  size={32}
                  src={avatarSrc}
                  style={{ backgroundColor: "#3b82f6" }}
                >
                  {displayInitials}
                </Avatar>
                <span className="user-name">{displayName}</span>
              </Space>
            </Dropdown>
          </Space>
        </div>
      </div>
    </AntHeader>
  );
}

export default Header;
