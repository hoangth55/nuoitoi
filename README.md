# 🌱 NUÔI TÔI 🌱

Trang web React.js hài hước với nội dung tương tự nuoitoi.com

## 🚀 Cài đặt và Chạy

1. Cài đặt dependencies:
```bash
npm install
```

2. Chạy development server:
```bash
npm run dev
```

3. Build cho production:
```bash
npm run build
```

4. Preview production build:
```bash
npm run preview
```

## 📦 Công nghệ sử dụng

- React 18 với Hooks (useState, useEffect)
- Vite
- Styled Components
- React Icons (đã cài đặt, sẵn sàng sử dụng)

## 🎨 Tính năng

- Responsive design
- UI hiện đại với gradients đẹp mắt
- Nội dung hài hước bằng tiếng Việt
- Tương tự trang nuoitoi.com

## 🌐 Deploy lên GitHub Pages

Repository: https://github.com/hoangth55/nuoitoi

### Bước 1: Push code lên GitHub

Code đã được cấu hình sẵn để deploy tự động. Chỉ cần push:

```bash
git add .
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

### Bước 2: Bật GitHub Pages

1. Vào repository: https://github.com/hoangth55/nuoitoi
2. Vào **Settings** → **Pages**
3. Trong phần **Source**, chọn **GitHub Actions**
4. Workflow sẽ tự động chạy khi bạn push code lên branch `main`

Sau khi deploy xong, website sẽ có tại: **https://hoangth55.github.io/nuoitoi/**

### Bước 3: Kết nối Domain .org của bạn

1. Sửa file `public/CNAME` với domain của bạn:
   ```
   yourdomain.org
   www.yourdomain.org
   ```
   (Thay `yourdomain.org` bằng domain .org thực của bạn)

2. Cấu hình DNS ở nhà cung cấp domain (ví dụ: Namecheap, GoDaddy, Cloudflare):
   
   **Cách 1: Dùng A Records (khuyên dùng)**
   - Thêm 4 A records:
     - `@` → `185.199.108.153`
     - `@` → `185.199.109.153`
     - `@` → `185.199.110.153`
     - `@` → `185.199.111.153`
   - Thêm CNAME cho www:
     - `www` → `hoangth55.github.io`

   **Cách 2: Dùng CNAME (đơn giản hơn)**
   - `@` → `hoangth55.github.io` (nếu nhà cung cấp hỗ trợ CNAME cho root domain)
   - `www` → `hoangth55.github.io`

3. Push file CNAME đã sửa lên GitHub:
```bash
git add public/CNAME
git commit -m "Add custom domain"
git push origin main
```

4. Vào lại **Settings** → **Pages** trên GitHub, bạn sẽ thấy phần "Custom domain", nhập domain của bạn vào đó.

5. Đợi 10-30 phút để DNS propagate, sau đó kiểm tra tại `https://yourdomain.org`

### Lưu ý:

- URL GitHub Pages: `https://hoangth55.github.io/nuoitoi/`
- Workflow tự động deploy mỗi khi bạn push code lên branch `main`
- File `.nojekyll` đã được tạo để GitHub Pages không xử lý Jekyll
- Base path đã được cấu hình đúng: `/nuoitoi/`

