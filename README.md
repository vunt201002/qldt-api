# Hướng Dẫn Chạy

## Yêu Cầu
- Cài đặt **[Node.js](https://nodejs.org/en)** và **[XAMPP](https://www.apachefriends.org/download.html)** (cứ cài bản mới nhất).

## Cách Chạy

1. **Khởi Động XAMPP**
    - Mở XAMPP, bật 2 service: **Apache** và **MySQL**.
    - Nếu không chạy được, có thể là do xung đột cổng:
        - Nhấn `Windows + R`, gõ `services.msc` để mở những service đang chạy.
        - Tìm và dừng service đang sử dụng port `3306`, hoặc đổi cổng MySQL trong XAMPP.

2. **Tạo Cơ Sở Dữ Liệu**
    - Tạo một database tên `qldt` (hoặc tên bất kỳ, nhưng phải khớp với tên trong file `.env`).

3. **Chạy Dự Án**
    - Clone repo về máy:
      ```bash
      git clone <URL của repo>
      ```
    - Cài đặt dependencies:
      ```bash
      yarn install
      ```
    - Chạy dự án:
      ```bash
      yarn dev
      ```

> **Lưu ý**: Đảm bảo các thông số trong file `.env` khớp với cấu hình của bạn.
