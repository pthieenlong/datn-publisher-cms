# ChapterGalleriesEditor

Component quản lý galleries (hình ảnh) của chapter, hỗ trợ thêm/xóa/sắp xếp ảnh.

## Features

- ✅ **Standalone mode**: Component hoạt động độc lập với nút Save riêng
- ✅ **Embedded mode**: Nhúng vào form khác, save được control bởi parent
- ✅ **API riêng biệt**: Sử dụng galleries APIs (POST/PATCH/DELETE)
- ✅ **Tách biệt logic**: Tách riêng galleries khỏi metadata của chapter

## Usage

### Standalone Mode

```tsx
import { ChapterGalleriesEditor } from "@/features/books/components";

export default function GalleriesManagementPage() {
  return (
    <ChapterGalleriesEditor
      bookSlug="my-book"
      chapterSlug="chapter-1"
      initialGalleries={["url1", "url2"]}
      mode="standalone"
      showSaveButton={true}
      onSuccess={() => console.log("Saved!")}
    />
  );
}
```

### Embedded Mode (trong form)

```tsx
import { ChapterGalleriesEditor } from "@/features/books/components";

export default function ChapterEditPage() {
  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = async (fileList) => {
    // Custom save logic
    await myCustomSaveFunction(fileList);
  };

  return (
    <ChapterGalleriesEditor
      bookSlug="my-book"
      chapterSlug="chapter-1"
      initialGalleries={["url1", "url2"]}
      mode="embedded"
      showSaveButton={false}
      onChange={(hasChanges) => setHasChanges(hasChanges)}
      onSaveRequest={handleSave}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `bookSlug` | `string` | required | Slug của book |
| `chapterSlug` | `string` | required | Slug của chapter |
| `initialGalleries` | `string[]` | required | Danh sách URL ảnh ban đầu |
| `mode` | `"standalone" \| "embedded"` | `"embedded"` | Chế độ hoạt động |
| `showSaveButton` | `boolean` | `mode === "standalone"` | Hiển thị nút Save |
| `onSuccess` | `() => void` | - | Callback khi save thành công |
| `onChange` | `(hasChanges: boolean) => void` | - | Callback khi có thay đổi |
| `onSaveRequest` | `(fileList) => Promise<void>` | - | Custom save handler (embedded mode) |

## APIs Used

Component sử dụng các API riêng biệt cho galleries:

1. **POST** `/cms/publisher/books/:bookSlug/chapters/:chapterSlug/galleries` - Thêm ảnh mới
2. **PATCH** `/cms/publisher/books/:bookSlug/chapters/:chapterSlug/galleries/remove` - Xóa ảnh
3. **PATCH** `/cms/publisher/books/:bookSlug/chapters/:chapterSlug/galleries/reorder` - Sắp xếp lại

## Architecture

```
ChapterGalleriesEditor (Container)
├── State management
├── API calls (useChapterGalleries)
└── GalleriesUploader (Presentational)
    ├── Upload UI
    ├── Image list
    └── Controls (move up/down/delete)
```

## See Also

- [useChapterGalleries](../../hooks/useChapterGalleries.ts) - Hook quản lý galleries API
- [ChapterEditPage](../../layouts/ChapterEdit/ChapterEditPage.tsx) - Example usage
