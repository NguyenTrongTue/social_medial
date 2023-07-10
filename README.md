<h1>Attribute</h1>

<h2>1. Khái niệm</h2>
<p>
  Một Attribute tác động vào một thành phần nào đó của chương trình (lớp, phương thức, thuộc tính) nó là một phần của siêu dữ liệu (metadata - loại dữ liệu cung cấp thêm thông tin về đối tượng nào đó). 
  Attribute giúp thêm thông tin vào lớp, phương thức, thuộc tính những đoạn code mở rộng.
</p>
<p>
  Các thuộc tính chú thích có thể được truy xuất tra cứu ở thời điểm thực thi bằng kỹ thuật gọi là reflection, 
  truy xuất ngược từ đối tượng biết được nguồn gốc mà đối tượng đó sinh ra (lớp)
</p>

<p>
  Trong C# có định nghĩa sẵn vô số các Attribute, 
  để sử dụng nó chỉ cần viết tên Attribute trong dấu [] trước đối tượng áp dụng như lớp, phương thức, thuộc tính lớp (có tham số như hàm, nếu Attribute đó yêu cầu).
</p>

<h2>1. Cú pháp</h2>
<code> 
[attribute(positional_parameters, name_parameter = value, ...)]element
</code>

<h2>Tạo Attribute C#</h2>

