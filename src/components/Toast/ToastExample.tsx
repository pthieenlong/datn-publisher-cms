import { Button } from "antd";
import { useToast } from "../../hooks/useToast";
import { useDocumentTitle } from "../../hooks/useDocumentTitle";

/**
 * Component ví dụ cách sử dụng Toast và DocumentTitle
 * Có thể xóa file này sau khi đã hiểu cách sử dụng
 */
const ToastExample = () => {
  const toast = useToast();

  // Thay đổi title của browser
  useDocumentTitle("Ví dụ Toast Notifications");

  return (
    <div
      style={{
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
    >
      <h2>Ví dụ sử dụng Toast Notifications</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <Button
          onClick={() =>
            toast.success(
              "Thành công!",
              "Thao tác đã được thực hiện thành công"
            )
          }
        >
          Toast Thành công
        </Button>

        <Button
          onClick={() =>
            toast.error("Lỗi!", "Đã xảy ra lỗi trong quá trình xử lý")
          }
        >
          Toast Lỗi
        </Button>

        <Button
          onClick={() =>
            toast.info("Thông tin", "Đây là một thông báo thông tin")
          }
        >
          Toast Thông tin
        </Button>

        <Button
          onClick={() =>
            toast.warning("Cảnh báo", "Hãy cẩn thận với thao tác này")
          }
        >
          Toast Cảnh báo
        </Button>

        <Button
          onClick={() =>
            toast.success(
              "Toast không tự đóng",
              "Toast này sẽ không tự động đóng",
              0
            )
          }
        >
          Toast không tự đóng (duration = 0)
        </Button>
      </div>
    </div>
  );
};

export default ToastExample;
