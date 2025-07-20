import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ManageInventory() {
  const { user, loading, isAuthenticated } = useAuth();
  const isAuthorized = user?.role === 'admin' || user?.role === 'order_manager';

  const [categoryData, setCategoryData] = useState({ name: '', label: '', icon: '' });
  const [categoryMessage, setCategoryMessage] = useState('');
  const [categories, setCategories] = useState([]);

  const [productData, setProductData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    stock_quantity: '',
    in_stock: false,
    rating: '',
    reviews: '',
    category_id: ''
  });
  const [productMessage, setProductMessage] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/categories/');
      const data = await response.json();
      if (response.ok) {
        setCategories(data);
      } else {
        console.error('Failed to fetch categories:', data.error);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    setCategoryMessage('');
    const token = localStorage.getItem('beautyApp_token');
    try {
      const response = await fetch('http://localhost:5000/categories/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(categoryData),
      });

      const data = await response.json();

      if (response.ok) {
        setCategoryMessage(`Category "${data.name}" added.`);
        setCategoryData({ name: '', label: '', icon: '' });
        fetchCategories();
      } else {
        setCategoryMessage(data.error || 'Failed to add category.');
      }
    } catch (err) {
      setCategoryMessage('Error adding category.');
    }
  };

  const handleProductChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductMessage('');
    const token = localStorage.getItem('beautyApp_token');
    try {
      const payload = {
        ...productData,
        price: parseFloat(productData.price),
        stock_quantity: parseInt(productData.stock_quantity),
        rating: parseFloat(productData.rating),
        reviews: parseInt(productData.reviews)
      };

      const response = await fetch('http://localhost:5000/products/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setProductMessage(`Product "${data.name}" added.`);
        setProductData({
          name: '',
          description: '',
          price: '',
          image_url: '',
          stock_quantity: '',
          in_stock: false,
          rating: '',
          reviews: '',
          category_id: ''
        });
      } else {
        setProductMessage(data.error || 'Failed to add product.');
      }
    } catch (err) {
      setProductMessage('Error adding product.');
    }
  };

  if (!loading && (!isAuthenticated || !isAuthorized)) {
    return <Navigate to="/" replace />;
  }

  if (loading) return <div className="p-4 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 border rounded shadow space-y-10">
      <h1 className="text-3xl font-bold text-center">Inventory Management</h1>

      {/* Category Form */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Add Category</h2>
        <form onSubmit={handleAddCategory} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input name="name" placeholder="Name" className="border p-2" value={categoryData.name} onChange={handleCategoryChange} required />
          <input name="label" placeholder="Label" className="border p-2" value={categoryData.label} onChange={handleCategoryChange} required />
          <input name="icon" placeholder="Icon (e.g. 💄)" className="border p-2" value={categoryData.icon} onChange={handleCategoryChange} />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded col-span-full md:col-auto">
            Add Category
          </button>
          {categoryMessage && <p className="text-green-600 text-sm col-span-full">{categoryMessage}</p>}
        </form>
      </section>

      {/* Product Form */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Add Product</h2>
        <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" placeholder="Name" className="border p-2" value={productData.name} onChange={handleProductChange} required />
          <input name="image_url" placeholder="Image URL" className="border p-2" value={productData.image_url} onChange={handleProductChange} />
          <textarea name="description" placeholder="Description" className="border p-2 md:col-span-2" value={productData.description} onChange={handleProductChange} required />
          <input name="price" type="number" step="0.01" placeholder="Price" className="border p-2" value={productData.price} onChange={handleProductChange} required />
          <input name="stock_quantity" type="number" placeholder="Stock" className="border p-2" value={productData.stock_quantity} onChange={handleProductChange} required />
          <input name="rating" type="number" step="0.1" placeholder="Rating" className="border p-2" value={productData.rating} onChange={handleProductChange} />
          <input name="reviews" type="number" placeholder="Reviews" className="border p-2" value={productData.reviews} onChange={handleProductChange} />
          <label className="flex items-center gap-2">
            <input type="checkbox" name="in_stock" checked={productData.in_stock} onChange={handleProductChange} />
            In Stock?
          </label>
          <select name="category_id" className="border p-2" value={productData.category_id} onChange={handleProductChange} required>
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label || cat.name}</option>
            ))}
          </select>
          <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded col-span-full md:col-auto">
            Add Product
          </button>
          {productMessage && <p className="text-green-600 text-sm col-span-full">{productMessage}</p>}
        </form>
      </section>
    </div>
  );
}
