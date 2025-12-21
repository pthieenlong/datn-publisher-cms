import { Upload, Button, Image, Space, message as antdMessage } from "antd";
import {
  Upload as UploadIcon,
  ArrowUp,
  ArrowDown,
  Trash2,
} from "lucide-react";
import type { UploadFile } from "antd/es/upload/interface";
import "./GalleriesUploader.scss";

export interface GalleriesUploaderProps {
  fileList: UploadFile[];
  onFileListChange: (newFileList: UploadFile[]) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onRemove: (file: UploadFile) => void;
  disabled?: boolean;
  maxCount?: number;
}

export default function GalleriesUploader({
  fileList,
  onFileListChange,
  onMoveUp,
  onMoveDown,
  onRemove,
  disabled = false,
  maxCount = 100,
}: GalleriesUploaderProps) {
  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      antdMessage.error("Chỉ được upload file ảnh!");
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      antdMessage.error("Ảnh phải nhỏ hơn 10MB!");
      return false;
    }
    return false; // Prevent auto upload
  };

  const handleUploadChange = (info: { fileList: UploadFile[] }) => {
    const newFiles = info.fileList.map((file, index) => ({
      ...file,
      uid: `new-${Date.now()}-${index}`,
    }));
    onFileListChange([...fileList, ...newFiles]);
  };

  return (
    <div className="galleries-uploader">
      <div className="galleries-uploader__header">
        <h4 className="galleries-uploader__title">Quản lý hình ảnh</h4>
        <p className="galleries-uploader__subtitle">
          Sắp xếp thứ tự trang truyện bằng nút di chuyển lên/xuống
        </p>
      </div>

      {/* Upload Button */}
      <Upload
        listType="picture-card"
        fileList={[]}
        beforeUpload={beforeUpload}
        onChange={handleUploadChange}
        multiple
        className="galleries-uploader__upload"
        showUploadList={false}
        disabled={disabled}
      >
        {fileList.length < maxCount && (
          <div className="galleries-uploader__upload-button">
            <UploadIcon size={24} />
            <div style={{ marginTop: 8 }}>Thêm ảnh mới</div>
          </div>
        )}
      </Upload>

      {/* Image List */}
      {fileList.length > 0 && (
        <div className="galleries-uploader__image-list">
          {fileList.map((file, index) => (
            <div key={file.uid} className="galleries-uploader__image-item">
              <div className="galleries-uploader__image-preview">
                {file.url ? (
                  <Image
                    src={file.url}
                    alt={file.name}
                    className="galleries-uploader__image-thumb"
                    preview={false}
                  />
                ) : file.originFileObj ? (
                  <Image
                    src={URL.createObjectURL(file.originFileObj)}
                    alt={file.name}
                    className="galleries-uploader__image-thumb"
                    preview={false}
                  />
                ) : null}
                <div className="galleries-uploader__image-overlay">
                  <Space>
                    <Button
                      type="text"
                      icon={<ArrowUp size={18} />}
                      onClick={() => onMoveUp(index)}
                      disabled={disabled || index === 0}
                      className="galleries-uploader__image-control"
                    />
                    <Button
                      type="text"
                      icon={<ArrowDown size={18} />}
                      onClick={() => onMoveDown(index)}
                      disabled={disabled || index === fileList.length - 1}
                      className="galleries-uploader__image-control"
                    />
                    <Button
                      type="text"
                      danger
                      icon={<Trash2 size={18} />}
                      onClick={() => onRemove(file)}
                      disabled={disabled}
                      className="galleries-uploader__image-control"
                    />
                  </Space>
                </div>
              </div>
              <p className="galleries-uploader__image-name">Trang {index + 1}</p>
            </div>
          ))}
        </div>
      )}

      {fileList.length === 0 && (
        <div className="galleries-uploader__empty">
          <p>Chưa có ảnh nào. Nhấn "Thêm ảnh mới" để bắt đầu.</p>
        </div>
      )}
    </div>
  );
}
