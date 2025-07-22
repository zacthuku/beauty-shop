import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

export default function ManageInventory() {
  const { user, loading, isAuthenticated } = useAuth();
  const isAuthorized = user?.role === 'admin' || user?.role === 'order_manager';

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);

  const [categoryData, setCategoryData] = useState({ name: '', label: '', icon: '' });
  const [categoryMessage, setCategoryMessage] = useState('');

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

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/categories/');
      const data = await response.json();
      if (response.ok) setCategories(data);
      else console.error('Failed to fetch categories:', data.error);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/products/');
      const data = await response.json();
      if (response.ok) setProducts(data);
      else console.error('Failed to fetch products:', data.error);
    } catch (err) {
      console.error('Error fetching products:', err);
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

  const handleAddOrUpdateProduct = async (e) => {
    e.preventDefault();
    setProductMessage('');
    const token = localStorage.getItem('beautyApp_token');

    const payload = {
      ...productData,
      price: parseFloat(productData.price),
      stock_quantity: parseInt(productData.stock_quantity),
      rating: parseFloat(productData.rating),
      reviews: parseInt(productData.reviews),
    };

    try {
      const url = editingProductId
        ? `http://localhost:5000/products/${editingProductId}`
        : 'http://localhost:5000/products/';
      const method = editingProductId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        setProductMessage(editingProductId
          ? `Product "${data.name}" updated.`
          : `Product "${data.name}" added.`);
        setProductData({
          name: '',
          description: '',
          price: '',
          image_url: '',
          stock_quantity: '',
          in_stock: false,
          rating: '',
          reviews: '',
          category_id: '',
        });
        setEditingProductId(null);
        fetchProducts();
      } else {
        setProductMessage(data.error || 'Operation failed.');
      }
    } catch (err) {
      setProductMessage('Error occurred while saving product.');
    }
  };

  const handleEditClick = (product) => {
    setProductData({
      name: product.name,
      description: product.description,
      price: product.price,
      image_url: product.image_url,
      stock_quantity: product.stock_quantity,
      in_stock: product.in_stock,
      rating: product.rating,
      reviews: product.reviews,
      category_id: product.category_id,
    });
    setEditingProductId(product.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem('beautyApp_token');
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const response = await fetch(`http://localhost:5000/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (response.ok) {
        setProductMessage(data.message);
        fetchProducts();
      } else {
        setProductMessage(data.error || 'Failed to delete product.');
      }
    } catch (err) {
      setProductMessage('Error deleting product.');
    }
  };

  const getCategoryName = (category_id) => {
    const match = categories.find(cat => cat.id === category_id);
    return match?.label || match?.name || category_id;
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
        <h2 className="text-xl font-semibold mb-2">{editingProductId ? 'Edit Product' : 'Add Product'}</h2>
        <form onSubmit={handleAddOrUpdateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            {editingProductId ? 'Update Product' : 'Add Product'}
          </button>
          {productMessage && <p className="text-green-600 text-sm col-span-full">{productMessage}</p>}
        </form>
      </section>

      {/* Product List */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Existing Products</h2>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search by product or category name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          className="border p-2 w-full md:w-1/2 mb-4 rounded"
        />

        <div className="space-y-2">
          {products
            .filter((product) =>
              product.name.toLowerCase().includes(searchQuery) ||
              getCategoryName(product.category_id).toLowerCase().includes(searchQuery)
            )
            .map((product) => (
              <div key={product.id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <p className="font-bold">{product.name}</p>
                  <p className="text-sm text-gray-600">
                    Stock: {product.stock_quantity} | Category: {getCategoryName(product.category_id)}
                  </p>
                </div>
                <div className="space-x-2">
                  <button onClick={() => handleEditClick(product)} className="px-3 py-1 bg-yellow-500 text-white rounded">Edit</button>
                  <button onClick={() => handleDeleteProduct(product.id)} className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}
