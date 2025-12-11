import {
  Form,
  Upload,
  Button,
  Space,
  Card,
  message,
  Image,
  Alert,
  Spin,
} from "antd";
import {
  ArrowLeft,
  Upload as UploadIcon,
  Save,
  X,
  ArrowUp,
  ArrowDown,
  Trash2,
} from "lucide-react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import type { UploadChangeParam, UploadFile } from "antd/es/upload/interface";
import "./ChapterEditPage.scss";
import { useDocumentTitle } from "@/hooks";
import { useChapterDetail } from "../../hooks/useChapterDetail";

interface ImageItem extends UploadFile {
  isExisting?: boolean; // Đánh dấu ảnh đã tồn tại từ server
}

function ChapterEditPage() {
  const { bookSlug, chapterSlug } = useParams({
    from: "/books/$bookSlug/chapters/$chapterSlug/edit",
  });
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { chapter, isLoading, errorMessage } = useChapterDetail({
    bookSlug,
    chapterSlug,
  });

  useDocumentTitle(`Chỉnh sửa Chương - CMS`);

  useEffect(() => {
    if (!chapter) {
      setFileList([]);
      return;
    }
    const existingFiles: ImageItem[] = chapter.content.map((url, index) => ({
      uid: `existing-${index}`,
      name: `Trang ${index + 1}.jpg`,
      url,
      status: "done",
      isExisting: true,
    }));
    setFileList(existingFiles);
  }, [chapter]);

  const handleBack = () => {
    navigate({
      to: "/books/$bookSlug/chapters/$chapterSlug",
      params: { bookSlug, chapterSlug },
    });
  };

  const handleCancel = () => {
    handleBack();
  };

  const handleSave = async () => {
    if (!chapter) {
      return;
    }
    setLoading(true);
    try {
      // Lọc ra các file mới (không phải existing)
      const newFiles = fileList
        .filter((item) => !item.isExisting && item.originFileObj)
        .map((item) => item.originFileObj as File);

      // Lấy danh sách URL của ảnh existing còn lại
      const existingUrls = fileList
        .filter((item) => item.isExisting && item.url)
        .map((item) => item.url as string);

      console.log("Save chapter images:", {
        chapterId: chapter.id,
        newFiles,
        existingUrls,
        order: fileList.map((item) => item.uid),
      });

      // API call sẽ ở đây
      message.success("Đã lưu thành công");
      handleBack();
    } catch (error) {
      message.error("Có lỗi xảy ra khi lưu");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadChange = (info: UploadChangeParam<UploadFile>) => {
    const mappedList: ImageItem[] = info.fileList.map((file) => {
      const currentFile = file as ImageItem;
      return {
        ...currentFile,
        isExisting: currentFile.isExisting,
      };
    });
    setFileList(mappedList);
  };

  const beforeUpload = (file: File) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("Chỉ được upload file ảnh!");
      return false;
    }
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Ảnh phải nhỏ hơn 10MB!");
      return false;
    }
    return true; // Allow upload
  };

  const handleRemove = (file: UploadFile) => {
    const newFileList = fileList.filter((item) => item.uid !== file.uid);
    setFileList(newFileList);
    return true;
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newFileList = [...fileList];
    [newFileList[index - 1], newFileList[index]] = [
      newFileList[index],
      newFileList[index - 1],
    ];
    setFileList(newFileList);
  };

  const handleMoveDown = (index: number) => {
    if (index === fileList.length - 1) return;
    const newFileList = [...fileList];
    [newFileList[index], newFileList[index + 1]] = [
      newFileList[index + 1],
      newFileList[index],
    ];
    setFileList(newFileList);
  };

  return (
    <div className="chapter-edit-page">
      {/* Header Section */}
      <div className="chapter-edit-header">
        <Space>
          <Button
            icon={<ArrowLeft size={20} />}
            onClick={handleBack}
            className="chapter-edit-back-button"
          >
            Quay lại
          </Button>
          <h2 className="chapter-edit-title">Chỉnh sửa Chương</h2>
        </Space>
      </div>

      {errorMessage && (
        <Alert
          type="error"
          message="Không thể tải chi tiết chương"
          description={errorMessage}
          showIcon
          closable
          className="chapter-edit-error"
        />
      )}

      {isLoading && !chapter ? (
        <div className="chapter-edit-loading">
          <Spin tip="Đang tải dữ liệu chương..." />
        </div>
      ) : (
        <>
          {/* Form Section */}
          <Card className="chapter-edit-form-card">
            <Form form={form} layout="vertical">
              <div className="chapter-edit-form-content">
                <div className="chapter-edit-info">
                  <h3 className="chapter-edit-info-title">
                    {chapter?.title ?? "Đang tải..."}
                  </h3>
                  <p className="chapter-edit-info-slug">
                    {chapter?.slug ?? ""}
                  </p>
                </div>

                <div className="chapter-edit-images-section">
                  <h4 className="chapter-edit-section-title">
                    Quản lý hình ảnh
                  </h4>

                  <Upload
                    listType="picture-card"
                    fileList={fileList}
                    onChange={handleUploadChange}
                    beforeUpload={beforeUpload}
                    onRemove={handleRemove}
                    multiple
                    className="chapter-edit-upload"
                    disabled={!chapter}
                  >
                    {fileList.length < 50 && (
                      <div>
                        <UploadIcon size={24} />
                        <div style={{ marginTop: 8 }}>Upload</div>
                      </div>
                    )}
                  </Upload>

                  {/* Image List with Controls */}
                  {fileList.length > 0 && (
                    <div className="chapter-edit-image-list">
                      {fileList.map((file, index) => (
                        <div key={file.uid} className="chapter-edit-image-item">
                          <div className="chapter-edit-image-preview">
                            {file.url ? (
                              <Image
                                src={file.url}
                                alt={file.name}
                                className="chapter-edit-image-thumb"
                                preview={false}
                              />
                            ) : file.originFileObj ? (
                              <Image
                                src={URL.createObjectURL(file.originFileObj)}
                                alt={file.name}
                                className="chapter-edit-image-thumb"
                                preview={false}
                              />
                            ) : null}
                            <div className="chapter-edit-image-overlay">
                              <Space>
                                <Button
                                  type="text"
                                  icon={<ArrowUp size={18} />}
                                  onClick={() => handleMoveUp(index)}
                                  disabled={index === 0}
                                  className="chapter-edit-image-control"
                                />
                                <Button
                                  type="text"
                                  icon={<ArrowDown size={18} />}
                                  onClick={() => handleMoveDown(index)}
                                  disabled={index === fileList.length - 1}
                                  className="chapter-edit-image-control"
                                />
                                <Button
                                  type="text"
                                  danger
                                  icon={<Trash2 size={18} />}
                                  onClick={() => handleRemove(file)}
                                  className="chapter-edit-image-control"
                                />
                              </Space>
                            </div>
                          </div>
                          <p className="chapter-edit-image-name">
                            Trang {index + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="chapter-edit-actions">
                <Space>
                  <Button
                    icon={<X size={20} />}
                    onClick={handleCancel}
                    className="chapter-edit-action-button"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="primary"
                    icon={<Save size={20} />}
                    onClick={handleSave}
                    loading={loading}
                    className="chapter-edit-action-button"
                    disabled={!chapter}
                  >
                    Lưu thay đổi
                  </Button>
                </Space>
              </div>
            </Form>
          </Card>
        </>
      )}
    </div>
  );
}

export default ChapterEditPage;
