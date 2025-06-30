import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import './ManagerOrderPanel.css';

export default function ManagerOrderPanel() {
  const { id } = useParams();
  const [vendors, setVendors] = useState([]);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [basket, setBasket] = useState([]);
  const [orderLocked, setOrderLocked] = useState(false);

  useEffect(() => {
    const loadVendors = async () => {
      try {
        const { data } = await axios.get("http://localhost:1000/api/suppliers");
        setVendors(data);
        if (id) {
          const res = await axios.get(`http://localhost:1000/api/suppliers/${id}`);
          setCurrentVendor(res.data);
        }
      } catch (err) {
        console.error("שגיאה בטעינת ספקים:", err);
      }
    };
    loadVendors();
  }, [id]);

  const changeVendor = async (vendorId) => {
    if (basket.length && !orderLocked) {
      alert("אנא אשר את ההזמנה הקיימת לפני מעבר לספק חדש");
      return;
    }
    try {
      const res = await axios.get(`http://localhost:1000/api/suppliers/${vendorId}`);
      setCurrentVendor(res.data);
      setBasket([]);
      setOrderLocked(false);
    } catch (err) {
      console.error("שגיאה במעבר לספק:", err);
    }
  };

  const addProduct = (product, qty) => {
    if (qty < product.minQty) {
      alert(`כמות מינימלית: ${product.minQty}`);
      return;
    }
    setBasket((prev) => [
      ...prev,
      { ...product, quantity: qty, supplierId: currentVendor._id },
    ]);
  };

  const removeFromBasket = (index) => {
    setBasket(basket.filter((_, i) => i !== index));
  };

  const submitOrder = async () => {
    if (!currentVendor || !basket.length) {
      alert("אין פריטים בעגלה");
      return;
    }

    const orderDetails = {
      orderId: `ord_${Date.now()}`,
      status: "ממתין לאישור",
      createdAt: new Date(),
      items: basket.map(({ id, name, quantity, price }) => ({
        productId: id,
        name,
        quantity,
        price,
      })),
    };

    try {
      await axios.put("http://localhost:1000/api/suppliers/orders/update", {
        supplierId: currentVendor._id,
        newOrder: orderDetails,
      });
      setCurrentVendor((prev) => ({
        ...prev,
        orders: [...(prev.orders || []), orderDetails],
      }));
      setBasket([]);
      setOrderLocked(true);
      alert("הזמנה נשלחה בהצלחה ✅");
    } catch (err) {
      console.error("שגיאה בשליחה:", err);
      alert("שגיאה בשליחת ההזמנה ❌");
    }
  };

  return (
    <div className="order-wrapper">
      <h2>מרכז הזמנות</h2>

      <div className="vendor-select">
        <label htmlFor="vendor">בחר ספק:</label>
        <select id="vendor" onChange={(e) => changeVendor(e.target.value)} defaultValue="">
          <option value="" disabled>בחר ספק</option>
          {vendors.map(v => (
            <option key={v._id} value={v._id}>{v.name}</option>
          ))}
        </select>
      </div>

      {currentVendor && (
        <>
          <section className="product-table">
            <h3>מוצרים מספק: {currentVendor.name}</h3>
            <table>
              <thead>
                <tr>
                  <th>שם</th>
                  <th>מחיר</th>
                  <th>מינימום</th>
                  <th>כמות</th>
                  <th>פעולה</th>
                </tr>
              </thead>
              <tbody>
                {currentVendor.products.map((prod) => {
                  const inputId = `qty-${prod.id}`;
                  return (
                    <tr key={prod.id}>
                      <td>{prod.name}</td>
                      <td>₪{prod.price}</td>
                      <td>{prod.minQty}</td>
                      <td>
                        <input type="number" id={inputId} defaultValue={prod.minQty} />
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            addProduct(prod, parseInt(document.getElementById(inputId).value))
                          }
                        >
                          הוסף
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </section>

          {basket.length > 0 && (
            <section className="basket-display">
              <h3>סל הקניות</h3>
              <ul>
                {basket.map((item, i) => (
                  <li key={i}>
                    🛒 {item.name} × {item.quantity} (₪{item.price}) 
                    <button className="remove-item-btn" onClick={() => removeFromBasket(i)}>✖</button>
                  </li>
                ))}
              </ul>
              <button onClick={submitOrder}>שלח הזמנה</button>
            </section>
          )}

          {currentVendor.orders?.length > 0 && (
            <section className="history-log">
              <h3>היסטוריית הזמנות</h3>
              <ul>
                {currentVendor.orders.map((ord) => (
                  <li key={ord.orderId}>
                    📅 {new Date(ord.createdAt).toLocaleString("he-IL")} - סטטוס: {ord.status}
                    <ul>
                      {ord.items.map((item, idx) => (
                        <li key={idx}>
                          📦 {item.name} × {item.quantity} (₪{item.price})
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </div>
  );
}
