# PLUXXL — Big Size Fashion

Website demo HTML/CSS/JavaScript cho thời trang Big Size nam và Lady Collection, có chức năng mua và thuê theo ngày.

## Chạy website
- Mở `index.html` hoặc deploy toàn bộ thư mục lên GitHub Pages.
- Trang quản trị: `admin.html`.

## Chức năng
- Giữ giao diện đen–vàng và responsive hiện tại.
- 16 sản phẩm mẫu: nam và Lady Collection.
- Tìm kiếm, lọc danh mục, lọc size và sắp xếp giá.
- Trang chi tiết, chọn size và mua/thuê.
- Chọn ngày nhận/trả; tiền thuê được tính theo số ngày.
- Giỏ hàng, điều chỉnh số lượng, checkout demo và lưu đơn hàng.
- Trang quản trị thêm/sửa/xóa sản phẩm và xem đơn hàng.
- Dữ liệu sản phẩm, giỏ hàng và đơn hàng dùng localStorage của trình duyệt.

## Lưu ý quan trọng
Đây là frontend demo không có backend, cơ sở dữ liệu dùng chung, tài khoản quản trị bảo mật hay cổng thanh toán thật. Dữ liệu localStorage chỉ nằm trên trình duyệt/thiết bị hiện tại và không đồng bộ với khách hàng khác. GitHub Pages chỉ host website tĩnh. Các ảnh sản phẩm dùng URL Unsplash nên cần Internet; hãy kiểm tra giấy phép từng ảnh trước khi sử dụng thương mại.

## Ảnh Big Size do người dùng cung cấp
- `assets/lady-plus-size-black-dress.png`: mẫu đầm đen nữ.
- `assets/men-plus-size-black-polo.png`: mẫu polo đen nam.
Hai ảnh đã được lưu cục bộ trong dự án nên không cần tải từ URL ngoài để hiển thị.


### Nhóm sản phẩm
Trong trang danh mục tổng, sản phẩm nam và phụ kiện được xếp trước, các sản phẩm Lady Collection được gom liền nhau phía sau. Ảnh đầm trễ vai mới được lưu trong `assets/lady-plus-size-black-offshoulder.png`.
