let PRODUCTS = loadProducts();

function loadProducts(){
  try { const saved = JSON.parse(localStorage.getItem("pluxxl_products") || "null"); if (Array.isArray(saved) && saved.length) return saved; } catch(e) {}
  const defaults = window.PLUXXL_DEFAULT_PRODUCTS;
  return defaults.map(p=>({...p,sizes:[...p.sizes]}));
}
let state = {
 cart: JSON.parse(localStorage.getItem("pluxxl_cart")||"[]"),
 wishlist: JSON.parse(localStorage.getItem("pluxxl_wishlist")||"[]"),
 user: JSON.parse(localStorage.getItem("pluxxl_user")||"null"),
 category:"all", search:"", size:"all", sort:"featured"
};

const $ = s => document.querySelector(s);
const money = n => new Intl.NumberFormat("vi-VN",{style:"currency",currency:"VND",maximumFractionDigits:0}).format(n);

function save(){localStorage.setItem("pluxxl_cart",JSON.stringify(state.cart));localStorage.setItem("pluxxl_wishlist",JSON.stringify(state.wishlist));localStorage.setItem("pluxxl_user",JSON.stringify(state.user));}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300);}
function openModal(id){$("#"+id).classList.add("open")}
function closeModals(){document.querySelectorAll(".modal").forEach(m=>m.classList.remove("open"))}
document.addEventListener("click",e=>{if(e.target.matches("[data-close]")||e.target.classList.contains("modal")) closeModals()});

function renderProducts(){
 let arr=PRODUCTS.filter(p=>state.category==="all"||p.category===state.category)
   .filter(p=>!state.search||(`${p.name} ${p.categoryName} ${p.color}`).toLowerCase().includes(state.search.toLowerCase()))
   .filter(p=>state.size==="all"||p.sizes.includes(state.size));
 if(state.sort==="low")arr.sort((a,b)=>(a.category==="lady")-(b.category==="lady") || a.price-b.price);
 else if(state.sort==="high")arr.sort((a,b)=>(a.category==="lady")-(b.category==="lady") || b.price-a.price);
 else arr.sort((a,b)=>(a.category==="lady")-(b.category==="lady") || a.id-b.id);
 $("#productGrid").innerHTML=arr.map(p=>`
  <article class="product-card">
    <div class="product-image">${p.image?`<img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">`:`<span class="product-placeholder">PLUXXL</span>`}
      ${p.badge?`<span class="badge">${p.badge}</span>`:""}
      <button class="heart ${state.wishlist.includes(p.id)?"saved":""}" data-wish="${p.id}">${state.wishlist.includes(p.id)?"♥":"♡"}</button>
    </div>
    <div class="product-info">
      <div class="product-category">${p.categoryName}</div><div class="product-name">${p.name}</div>
      <div class="product-meta">Size ${p.sizes[0]} — ${p.sizes[p.sizes.length-1]} · ${p.color}</div>
      <div class="price-row"><div class="price">${money(p.price)}</div><div class="rent-price">Thuê từ ${money(p.rent)}/ngày</div></div>
      <div class="card-actions"><button data-view="${p.id}">CHI TIẾT</button><button class="primary" data-quick-rent="${p.id}">THUÊ</button></div>
    </div>
  </article>`).join("") || `<div class="empty" style="grid-column:1/-1">Không tìm thấy sản phẩm phù hợp.</div>`;
 updateCounts();
}

function updateCounts(){$("#cartCount").textContent=state.cart.reduce((s,x)=>s+x.qty,0);$("#wishCount").textContent=state.wishlist.length}

function productById(id){return PRODUCTS.find(p=>p.id===Number(id))}
function addCart(id,mode="buy",size=null,start="",end=""){
 const p=productById(id); if(!p)return;
 size=size||p.sizes[0];
 const key=`${id}-${mode}-${size}-${start}-${end}`;
 const days = mode === "rent" ? Math.max(1, Math.ceil((new Date(end)-new Date(start))/86400000)) : 1;
 const unit = mode === "rent" ? p.rent * days : p.price;
 const existing=state.cart.find(x=>x.key===key);
 if(existing)existing.qty++;else state.cart.push({key,id:p.id,qty:1,mode,size,start,end,days,unit,rate:p.rent});
 save();renderProducts();toast(mode==="rent"?"Đã thêm bộ suit thuê vào giỏ":"Đã thêm sản phẩm vào giỏ");
}
function toggleWish(id){id=Number(id);state.wishlist=state.wishlist.includes(id)?state.wishlist.filter(x=>x!==id):[...state.wishlist,id];save();renderProducts();toast(state.wishlist.includes(id)?"Đã lưu vào yêu thích":"Đã bỏ khỏi yêu thích")}
function showProduct(id, rental=false){
 const p=productById(id); if(!p)return;
 $("#productModalBody").innerHTML=`
 <div class="product-detail">
  <div class="product-detail-image"><img src="${p.image}" alt="${p.name}"></div>
  <div class="product-detail-copy">
   <p class="eyebrow">${p.categoryName}</p><h2>${p.name}</h2><p>${p.desc}</p>
   <div class="detail-price">${money(p.price)}</div><div class="detail-rent">Cho thuê từ <b>${money(p.rent)}</b> / ngày</div>
   <div class="option-label">Chọn size</div><div class="size-options" id="detailSizes">${p.sizes.map((s,i)=>`<button class="${i===0?"selected":""}" data-size="${s}">${s}</button>`).join("")}</div>
   <div class="option-label">Màu</div><div class="color-options"><button class="selected">${p.color}</button></div>
   <div class="rental-form" id="rentalFields" style="display:${rental?"block":"none"}">
    <div class="form"><label>Ngày nhận<input type="date" id="rentStart" min="${new Date().toISOString().slice(0,10)}"></label><label>Ngày trả<input type="date" id="rentEnd"></label></div>
   </div>
   <div class="detail-actions"><button class="buy" id="addBuy">THÊM VÀO GIỎ</button><button id="addRent">THÊM THUÊ</button></div>
  </div>
 </div>`;
 openModal("productModal");
 $("#detailSizes").addEventListener("click",e=>{if(e.target.dataset.size){document.querySelectorAll("#detailSizes button").forEach(b=>b.classList.remove("selected"));e.target.classList.add("selected")}});
 $("#addBuy").onclick=()=>{const s=document.querySelector("#detailSizes .selected").dataset.size;addCart(p.id,"buy",s);closeModals();openCart()};
 $("#addRent").onclick=()=>{
   const s=document.querySelector("#detailSizes .selected").dataset.size, start=$("#rentStart").value,end=$("#rentEnd").value;
   if(!start||!end){$("#rentalFields").style.display="block";toast("Hãy chọn ngày nhận và ngày trả");return}
   if(new Date(end)<=new Date(start)){toast("Ngày trả phải sau ngày nhận");return}
   addCart(p.id,"rent",s,start,end);closeModals();openCart();
 };
}

function openCart(){
 const items=state.cart;
 if(!items.length){$("#cartBody").innerHTML=`<div class="empty">Giỏ hàng đang trống.<br><a class="btn btn-dark" style="margin-top:18px" href="#shop" onclick="closeModals()">TIẾP TỤC MUA SẮM</a></div>`;openModal("cartModal");return}
 $("#cartBody").innerHTML=items.map((x,i)=>{const p=productById(x.id);return `
 <div class="cart-item"><div class="cart-thumb">${p.image?`<img src="${p.image}" style="width:100%;height:100%;object-fit:cover">`:"PX"}</div>
 <div><h4>${p.name}</h4><p>${x.mode==="rent"?"Thuê":"Mua"} · Size ${x.size}${x.start?` · ${x.start} → ${x.end}`:""}</p><strong>${money(x.unit)}${x.mode==="rent"?` <small>(${x.days||1} ngày)</small>`:""}</strong></div>
 <div class="qty"><button data-dec="${i}">−</button><b>${x.qty}</b><button data-inc="${i}">+</button><button data-remove="${i}" style="margin-left:8px;background:transparent">×</button></div></div>`}).join("");
 const total=items.reduce((s,x)=>s+x.unit*x.qty,0);
 $("#cartBody").insertAdjacentHTML("beforeend",`<div class="cart-total"><span>Tạm tính</span><span>${money(total)}</span></div><button class="btn btn-dark" style="width:100%" id="checkoutBtn">TIẾN HÀNH ĐẶT HÀNG</button>`);
 openModal("cartModal");
}
function checkout(){
 if(!state.cart.length)return;
 const total=state.cart.reduce((s,x)=>s+x.unit*x.qty,0);
 $("#checkoutBody").innerHTML=`<div class="modal-head"><p class="eyebrow">CHECKOUT</p><h2>Thông tin đặt hàng</h2></div>
 <div class="checkout-grid"><form id="checkoutForm" class="form"><div class="form-section"><h3>Thông tin nhận hàng</h3><label>Họ và tên<input name="name" required value="${state.user?.name||""}"></label><label>Số điện thoại<input name="phone" required pattern="[0-9]{9,11}"></label><label>Email<input type="email" name="email" required value="${state.user?.email||""}"></label><label>Địa chỉ<input name="address" required></label><label>Ghi chú<textarea name="note" rows="3" style="width:100%;margin-top:6px;border:1px solid var(--line);padding:11px"></textarea></label></div><div class="form-section"><h3>Thanh toán</h3><label><input type="radio" name="payment" value="cod" checked> COD — Thanh toán khi nhận</label><label><input type="radio" name="payment" value="bank"> Chuyển khoản ngân hàng</label></div><button class="btn btn-dark">XÁC NHẬN ĐẶT HÀNG</button></form>
 <aside class="checkout-summary"><h3>Đơn hàng</h3>${state.cart.map(x=>{const p=productById(x.id);return `<div class="summary-row"><span>${p.name} × ${x.qty}${x.mode==="rent"?` · thuê ${x.days||1} ngày`:""}</span><span>${money(x.unit*x.qty)}</span></div>`}).join("")}<div class="summary-total"><span>Tổng</span><span>${money(total)}</span></div></aside></div>`;
 closeModals();openModal("checkoutModal");
 $("#checkoutForm").onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);const order={id:"PX"+Date.now().toString().slice(-7),date:new Date().toLocaleString("vi-VN"),items:state.cart.map(x=>({...x,name:productById(x.id)?.name||"Sản phẩm"})),total,name:fd.get("name"),phone:fd.get("phone"),email:fd.get("email"),address:fd.get("address"),payment:fd.get("payment"),status:"Mới"};localStorage.setItem("pluxxl_last_order",JSON.stringify(order));localStorage.setItem("pluxxl_orders",JSON.stringify([order,...JSON.parse(localStorage.getItem("pluxxl_orders")||"[]")]));state.cart=[];save();closeModals();renderProducts();showOrderSuccess(order)};
}
function showOrderSuccess(order){$("#infoBody").innerHTML=`<p class="eyebrow">ORDER CONFIRMED</p><h2>Đặt hàng thành công</h2><p>Cảm ơn <b>${order.name}</b>. Mã đơn hàng của bạn là <b>${order.id}</b>.</p><p>Tổng giá trị: <b>${money(order.total)}</b></p><button class="btn btn-dark" data-close style="margin-top:15px">ĐÓNG</button>`;openModal("infoModal");}

function account(){
 if(state.user){$("#accountBody").innerHTML=`<p class="eyebrow">MY ACCOUNT</p><h2>Xin chào, ${state.user.name}</h2><p>${state.user.email}</p><div class="account-tabs"><button class="active">Tài khoản</button><button id="ordersBtn">Đơn hàng</button></div><button class="btn btn-dark" id="logoutBtn">ĐĂNG XUẤT</button>`;openModal("accountModal");$("#logoutBtn").onclick=()=>{state.user=null;save();closeModals();toast("Đã đăng xuất")};$("#ordersBtn").onclick=()=>showOrders();return}
 $("#accountBody").innerHTML=`<p class="eyebrow">PLUXXL ACCOUNT</p><h2>Đăng nhập</h2><form id="loginForm" class="form"><label>Email<input type="email" name="email" required></label><label>Mật khẩu<input type="password" name="password" required minlength="4"></label><button class="btn btn-dark">ĐĂNG NHẬP</button></form><p style="font-size:12px;color:var(--muted);margin-top:20px">Demo: nhập email và mật khẩu bất kỳ (từ 4 ký tự).</p><button class="btn" style="border:1px solid var(--ink);margin-top:8px;width:100%" id="registerDemo">TẠO TÀI KHOẢN</button>`;
 openModal("accountModal");
 $("#loginForm").onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);state.user={name:fd.get("email").split("@")[0],email:fd.get("email")};save();closeModals();toast("Đăng nhập thành công")};
 $("#registerDemo").onclick=()=>{$("#accountBody").innerHTML=`<p class="eyebrow">CREATE ACCOUNT</p><h2>Tạo tài khoản</h2><form id="regForm" class="form"><label>Họ và tên<input name="name" required></label><label>Email<input type="email" name="email" required></label><label>Mật khẩu<input type="password" name="password" required minlength="4"></label><button class="btn btn-dark">ĐĂNG KÝ</button></form>`;$("#regForm").onsubmit=e=>{e.preventDefault();const fd=new FormData(e.target);state.user={name:fd.get("name"),email:fd.get("email")};save();closeModals();toast("Tạo tài khoản thành công")}};
}
function showOrders(){
 const orders=JSON.parse(localStorage.getItem("pluxxl_orders")||"[]");
 $("#accountBody").innerHTML=`<p class="eyebrow">MY ORDERS</p><h2>Lịch sử đơn hàng</h2>${orders.length?orders.map(o=>`<div style="background:#fff;padding:15px;margin:10px 0;border:1px solid var(--line)"><b>${o.id}</b><span style="float:right">${o.status}</span><p style="font-size:11px;color:var(--muted)">${o.date}</p><strong>${money(o.total)}</strong></div>`).join(""):`<div class="empty">Bạn chưa có đơn hàng.</div>`}`;
}
function showWishlist(){
 const ps=PRODUCTS.filter(p=>state.wishlist.includes(p.id));
 $("#wishlistBody").innerHTML=ps.length?`<div class="product-grid">${ps.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}"></div><div class="product-info"><div class="product-name">${p.name}</div><div class="price">${money(p.price)}</div><div class="card-actions"><button data-view="${p.id}">CHI TIẾT</button><button class="primary" data-wish="${p.id}">BỎ LƯU</button></div></div></article>`).join("")}</div>`:`<div class="empty">Chưa có sản phẩm yêu thích.</div>`;openModal("wishlistModal");
}

document.addEventListener("click",e=>{
 if(e.target.dataset.view)showProduct(e.target.dataset.view);
 if(e.target.dataset.quickRent)showProduct(e.target.dataset.quickRent,true);
 if(e.target.dataset.wish)toggleWish(e.target.dataset.wish);
 if(e.target.dataset.inc){state.cart[Number(e.target.dataset.inc)].qty++;save();openCart()}
 if(e.target.dataset.dec){const i=Number(e.target.dataset.dec);state.cart[i].qty--;if(state.cart[i].qty<=0)state.cart.splice(i,1);save();openCart()}
 if(e.target.dataset.remove){state.cart.splice(Number(e.target.dataset.remove),1);save();openCart()}
 if(e.target.id==="checkoutBtn")checkout();
});

$("#cartBtn").onclick=openCart;$("#accountBtn").onclick=account;$("#wishlistBtn").onclick=showWishlist;
$("#searchBtn").onclick=()=>{$("#productSearch").focus();location.hash="shop"};
$("#mobileMenu").onclick=()=>document.querySelector(".nav").style.display=document.querySelector(".nav").style.display==="flex"?"none":"flex";
$("#productSearch").oninput=e=>{state.search=e.target.value;renderProducts()};
$("#sizeFilter").onchange=e=>{state.size=e.target.value;renderProducts()};
$("#sortFilter").onchange=e=>{state.sort=e.target.value;renderProducts()};
$("#categoryTabs").onclick=e=>{if(e.target.dataset.cat){state.category=e.target.dataset.cat;document.querySelectorAll("#categoryTabs button").forEach(b=>b.classList.remove("active"));e.target.classList.add("active");renderProducts()}};
$("#openSizeGuide").onclick=()=>openModal("sizeModal");
$("#sizeForm").onsubmit=e=>{e.preventDefault();const chest=Number($("#chest").value),waist=Number($("#waist").value);let s=chest<114?"XL":chest<120?"XXL":chest<126?"3XL":chest<134?"4XL":chest<142?"5XL":"6XL";$("#sizeResult").innerHTML=`<div style="margin-top:20px;padding:18px;background:#fff;border:1px solid var(--line)"><b>Gợi ý của PLUXXL: ${s}</b><p style="font-size:12px;color:var(--muted)">Dựa trên vòng ngực ${chest}cm và vòng eo ${waist}cm. Hãy kiểm tra thêm thông số từng sản phẩm trước khi đặt.</p></div>`};
$("#newsletterForm").onsubmit=e=>{e.preventDefault();e.target.reset();toast("Đã đăng ký nhận tin!")};
$("#shippingLink").onclick=e=>{e.preventDefault();$("#infoBody").innerHTML="<p class='eyebrow'>SHIPPING</p><h2>Giao hàng</h2><p>Nội thành Hà Nội: dự kiến 1–2 ngày. Tỉnh/thành khác: 2–5 ngày. Đơn thuê được ưu tiên kiểm tra lịch trước khi xác nhận.</p>";openModal("infoModal")};
$("#policyLink").onclick=e=>{e.preventDefault();$("#infoBody").innerHTML="<p class='eyebrow'>POLICY</p><h2>Đổi trả</h2><p>Sản phẩm mua: hỗ trợ đổi size theo tình trạng tồn kho. Sản phẩm thuê: kiểm tra ngay khi nhận; vui lòng giữ nguyên tình trạng sản phẩm và trả đúng hạn.</p>";openModal("infoModal")};
$("#contactLink").onclick=e=>{e.preventDefault();$("#infoBody").innerHTML="<p class='eyebrow'>CONTACT</p><h2>Liên hệ PLUXXL</h2><p>Hotline: 0900 000 000<br>Email: hello@pluxxl.vn<br>Thời gian hỗ trợ: 09:00–21:00</p>";openModal("infoModal")};
renderProducts();
