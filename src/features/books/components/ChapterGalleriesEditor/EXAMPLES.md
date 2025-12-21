# ChapterGalleriesEditor - Ví dụ sử dụng

## 1. Standalone Mode (Đang sử dụng trong ChapterEditPage)

Component hoạt động độc lập với nút "Lưu thay đổi" riêng. Khi người dùng thêm/xóa/sắp xếp ảnh và nhấn Save, component tự động gọi API galleries.

```tsx
import { ChapterGalleriesEditor } from "@/features/books/components";

export default function ChapterEditPage() {
  const { chapter, refetch } = useChapterDetail({ bookSlug, chapterSlug });

  return (
    <div>
      {/* Galleries Editor - Standalone */}
      <ChapterGalleriesEditor
        bookSlug={bookSlug}
        chapterSlug={chapterSlug}
        initialGalleries={chapter.content}
        mode="standalone"
        showSaveButton={true}
        onSuccess={refetch} // Refetch chapter sau khi save
      />

      {/* Form metadata riêng biệt */}
      <ChapterEditForm
        initialValues={metadataValues}
        onSubmit={handleMetadataSubmit}
      />
    </div>
  );
}
```

**Ưu điểm:**
- ✅ Tách biệt hoàn toàn giữa galleries và metadata
- ✅ User có thể save galleries trước, sau đó mới save metadata
- ✅ Không cần lo lắng về việc đồng bộ state giữa 2 phần

---

## 2. Embedded Mode (Cho form phức tạp)

Component được nhúng vào form lớn hơn, không có nút Save riêng. Parent component quyết định khi nào gọi API save.

```tsx
import { useState } from "react";
import { ChapterGalleriesEditor } from "@/features/books/components";
import type { UploadFile } from "antd";

export default function ComplexChapterForm() {
  const [galleriesChanged, setGalleriesChanged] = useState(false);
  const [currentGalleries, setCurrentGalleries] = useState<UploadFile[]>([]);

  const handleGalleriesSave = async (fileList: UploadFile[]) => {
    // Custom logic để save galleries
    // Ví dụ: combine với metadata rồi gọi 1 API duy nhất
    const formData = new FormData();

    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("galleries", file.originFileObj);
      }
    });

    await myCustomSaveAPI(formData);
  };

  return (
    <Form onFinish={handleSubmit}>
      {/* Galleries embedded trong form */}
      <ChapterGalleriesEditor
        bookSlug={bookSlug}
        chapterSlug={chapterSlug}
        initialGalleries={chapter.content}
        mode="embedded"
        showSaveButton={false}
        onChange={(hasChanges) => setGalleriesChanged(hasChanges)}
        onSaveRequest={handleGalleriesSave}
      />

      {/* Các field khác */}
      <Form.Item name="title">
        <Input />
      </Form.Item>

      {/* Submit cả form */}
      <Button htmlType="submit">
        Lưu tất cả
      </Button>
    </Form>
  );
}
```

**Ưu điểm:**
- ✅ Kiểm soát hoàn toàn flow save từ parent
- ✅ Có thể combine galleries với metadata trong 1 request
- ✅ Phù hợp với form wizard hoặc multi-step form

---

## 3. Read-only Mode (Xem galleries)

Nếu muốn chỉ hiển thị galleries mà không cho edit:

```tsx
import { GalleriesUploader } from "@/features/books/components";

export default function ChapterPreview() {
  return (
    <GalleriesUploader
      fileList={chapter.content.map((url, i) => ({
        uid: `img-${i}`,
        name: `Page ${i + 1}`,
        url,
        status: "done",
      }))}
      onFileListChange={() => {}} // No-op
      onMoveUp={() => {}}
      onMoveDown={() => {}}
      onRemove={() => {}}
      disabled={true} // Disable tất cả controls
    />
  );
}
```

---

## 4. Custom Save Button Position

Nếu muốn nút Save ở vị trí khác (không phải trong component):

```tsx
import { useState } from "react";
import { ChapterGalleriesEditor } from "@/features/books/components";
import { Button } from "antd";

export default function CustomLayout() {
  const [hasChanges, setHasChanges] = useState(false);
  const galleriesEditorRef = useRef<{ save: () => void }>();

  return (
    <div>
      {/* Nút Save ở header */}
      <PageHeader
        extra={[
          <Button
            key="save"
            type="primary"
            disabled={!hasChanges}
            onClick={() => galleriesEditorRef.current?.save()}
          >
            Lưu ảnh
          </Button>
        ]}
      />

      {/* Galleries Editor */}
      <ChapterGalleriesEditor
        bookSlug={bookSlug}
        chapterSlug={chapterSlug}
        initialGalleries={chapter.content}
        mode="standalone"
        showSaveButton={false} // Ẩn nút save internal
        onChange={setHasChanges}
        ref={galleriesEditorRef}
      />
    </div>
  );
}
```

---

## So sánh Mode

| Feature | Standalone | Embedded |
|---------|-----------|----------|
| Nút Save riêng | ✅ Có | ❌ Không |
| Auto-save galleries | ✅ Có | ❌ Parent quyết định |
| onChange callback | ✅ Optional | ✅ Recommended |
| onSaveRequest | ❌ Không cần | ✅ Required |
| Use case | Trang edit đơn giản | Form phức tạp, wizard |

---

## Best Practices

1. **Standalone mode** - Dùng khi:
   - Galleries và metadata độc lập
   - Muốn UX đơn giản (save từng phần)
   - Không cần validate cross-field

2. **Embedded mode** - Dùng khi:
   - Cần validate galleries + metadata cùng nhau
   - Muốn atomic save (all or nothing)
   - Có logic phức tạp khi save

3. **Performance**:
   - Galleries tự động debounce onChange
   - Component chỉ re-render khi cần thiết
   - Sử dụng `useMemo` để tránh tính toán thừa

4. **Error Handling**:
   - API errors được handle tự động (message.error)
   - onSuccess callback để refetch data
   - Component tự cleanup khi unmount
