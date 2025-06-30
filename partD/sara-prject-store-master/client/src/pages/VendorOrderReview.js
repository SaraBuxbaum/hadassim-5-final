import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./VendorOrderReview.css";

export default function VendorOrderReview() {
  const { id } = useParams();
  const [vendorDetails, setVendorDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVendorData = async () => {
      try {
        const { data } = await axios.get(`http://localhost:1000/api/suppliers/${id}`);
        setVendorDetails(data);
      } catch (err) {
        console.error("שגיאה בטעינת נתוני הספק:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadVendorData();
  }, [id]);

  const updateOrderStatus = async (orderId, index, newStatus) => {
    try {
      await axios.put("http://localhost:1000/api/suppliers/orders/update", {
        supplierId: id,
        orderId,
        index,
        updatedOrder: { status: newStatus },
      });

      const updated = vendorDetails.orders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order
      );

      setVendorDetails({ ...vendorDetails, orders: updated });

      alert(`✅ ההזמנה ${orderId} עודכנה לסטטוס "${newStatus}"`);
    } catch (err) {
      console.error("שגיאה בעדכון סטטוס:", err);
      alert("❌ אירעה שגיאה");
    }
  };

  if (isLoading) return <div className="vendor-loader">טוען נתונים...</div>;

  return (
    <div className="vendor-orders-wrapper">
      <div className="vendor-orders-card">
        <h2 className="vendor-orders-title">סקירת הזמנות עבור: {vendorDetails.name}</h2>
        <table className="vendor-table">
          <thead>
            <tr>
              <th>מספר הזמנה</th>
              <th>תאריך</th>
              <th>סטטוס</th>
              <th>מוצרים</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {vendorDetails.orders
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((order, index) => (
                <tr key={order.orderId}>
                  <td>{order.orderId}</td>
                  <td>{new Date(order.createdAt).toLocaleString("he-IL")}</td>
                  <td>{order.status}</td>
                  <td>
                    <ul>
                      {order.items.map((item, i) => (
                        <li key={i}>
                          {item.name} × {item.quantity} (₪{item.price})
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {order.status === "ממתין לאישור" ? (
                      <>
                        <button
                          className="approve-btn"
                          onClick={() => updateOrderStatus(order.orderId, index, "אושר")}
                        >
                          ✔️ אישור
                        </button>
                        <button
                          className="reject-btn"
                          onClick={() => updateOrderStatus(order.orderId, index, "נדחתה")}
                        >
                          ❌ דחייה
                        </button>
                      </>
                    ) : (
                      <span className="status-label">{order.status}</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
