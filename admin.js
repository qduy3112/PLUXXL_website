const PRODUCTS=[
{id:1,name:"Navy Signature Suit",category:"Suit & Vest",price:1990000,rent:350000},
{id:2,name:"Midnight Black Suit",category:"Suit & Vest",price:2190000,rent:390000},
{id:3,name:"Grey Executive Vest",category:"Suit & Vest",price:1690000,rent:300000},
{id:4,name:"Classic White Shirt",category:"Sơ mi",price:490000,rent:120000},
{id:5,name:"Premium Black Trousers",category:"Quần âu",price:690000,rent:150000},
{id:6,name:"Burgundy Tuxedo",category:"Suit & Vest",price:2490000,rent:450000},
{id:7,name:"Silk Black Tie",category:"Phụ kiện",price:290000,rent:70000},
{id:8,name:"Italian Leather Belt",category:"Phụ kiện",price:390000,rent:90000}
];
const money=n=>new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND",maximumFractionDigits:0}).format(n);
function render(){
 const orders=JSON.parse(localStorage.getItem("pluxxl_orders")||"[]");
 const revenue=orders.reduce((s,o)=>s+o.total,0), rentals=orders.reduce((s,o)=>s+o.items.filter(x=>x.mode==="rent").length,0);
 document.querySelector("#stats").innerHTML=`<div><b>${orders.length}</b><span>Đơn hàng</span></div><div><b>${money(revenue)}</b><span>Doanh thu</span></div><div><b>${rentals}</b><span>Đơn thuê</span></div><div><b>${PRODUCTS.length}</b><span>Sản phẩm</span></div>`;
 document.querySelector("#orders").innerHTML=orders.length?orders.map(o=>`<div class="admin-row"><div><b>${o.id}</b><small>${o.date} · ${o.name}</small></div><strong>${money(o.total)}</strong><span class="status">${o.status}</span></div>`).join(""):"<div class='empty'>Chưa có đơn hàng.</div>";
 document.querySelector("#products").innerHTML=PRODUCTS.map(p=>`<div class="admin-row"><div><b>${p.name}</b><small>${p.category} · Thuê ${money(p.rent)}/ngày</small></div><strong>${money(p.price)}</strong><button onclick="alert('Demo CRUD: có thể nối API/Database ở bước backend.')">Sửa</button></div>`).join("");
 document.querySelector("#productCount").textContent=PRODUCTS.length+" sản phẩm";
}
document.querySelector("#clearOrders").onclick=()=>{if(confirm("Xóa toàn bộ đơn demo?")){localStorage.removeItem("pluxxl_orders");render()}};
document.querySelector("#resetDemo").onclick=()=>{localStorage.removeItem("pluxxl_orders");localStorage.removeItem("pluxxl_cart");localStorage.removeItem("pluxxl_wishlist");alert("Đã reset dữ liệu demo.");render()};
render();
