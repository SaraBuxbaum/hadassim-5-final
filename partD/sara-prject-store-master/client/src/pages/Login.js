import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import ProductAccordion from '../components/ProductAccordion';

const Login = () => {
  const { status } = useParams(); // login או register
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    company: '',
    phone: '',
    representative: '',
    products: [{ id: '', name: '', price: '', minQty: '' }],
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateProduct = (index, field, value) => {
    const updated = [...form.products];
    updated[index][field] = value;
    setForm(prev => ({ ...prev, products: updated }));
  };

  const addProduct = () => {
    setForm(prev => ({
      ...prev,
      products: [...prev.products, { id: '', name: '', price: '', minQty: '' }]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (status === 'register') {
      try {
        const payload = {
          id: form.username,
          name: form.username,
          password: form.password,
          email: form.email,
          phone: form.phone,
          company: form.company,
          representative: form.representative,
          role: 'supplier',
          products: form.products,
          orders: []
        };
        await axios.post('http://localhost:1000/api/suppliers', payload);
        alert('נרשמת בהצלחה!');
        navigate('/login');
      } catch (err) {
        setError('שגיאה בהרשמה');
        console.error(err);
      }
    } else if (status === 'login') {
      try {
        const { data } = await axios.post('http://localhost:1000/api/suppliers/login', {
          name: form.username,
          password: form.password
        });

        const route = data.role === 'supplier' ? 'invitations' : 'orders';
        navigate(`/${data.id}/${route}`);
      } catch (err) {
        setError('שם משתמש או סיסמה שגויים');
      }
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <h2 className="login-title">{status === 'register' ? 'הרשמה' : 'כניסה'}</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <form className="login-form" onSubmit={handleSubmit}>
          <input className="input-field" required type="text" placeholder="שם משתמש" onChange={(e) => handleChange('username', e.target.value)} />
          <input className="input-field" required type="password" placeholder="סיסמה" onChange={(e) => handleChange('password', e.target.value)} />

          {status === 'register' && (
            <>
              <input className="input-field" required type="email" placeholder="אימייל" onChange={(e) => handleChange('email', e.target.value)} />
              <input className="input-field" required type="text" placeholder="חברה" onChange={(e) => handleChange('company', e.target.value)} />
              <input className="input-field" required type="text" placeholder="טלפון" onChange={(e) => handleChange('phone', e.target.value)} />
              <input className="input-field" required type="text" placeholder="נציג" onChange={(e) => handleChange('representative', e.target.value)} />

              <h4 className="products-title">מוצרים</h4>
              <ProductAccordion products={form.products} setProducts={(p) => setForm(prev => ({ ...prev, products: p }))} />

            </>
          )}

          <button type="submit" className="submit-btn">
            {status === 'register' ? 'הרשמה' : 'כניסה'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
