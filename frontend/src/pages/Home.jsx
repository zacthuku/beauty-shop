import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Truck, Shield, Headphones } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductsContext";

const Home = () => {
  const { products, categories, fetchProducts } = useProducts();

  useEffect(() => {
    fetchProducts();
  }, []);

  const featuredProducts = products.slice(0, 8);
  const bestSellers = products.filter((p) => p.rating >= 4.7).slice(0, 4);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-rose-50 via-pink-50 to-rose-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                  Discover Your
                  <span className="block bg-gradient-to-r from-rose-500 to-pink-600 bg-clip-text text-transparent">
                    Natural Beauty
                  </span>
                </h1>
                <p className="text-xl text-gray-600 max-w-lg">
                  Premium skincare, makeup, and haircare products that enhance
                  your natural radiance and boost your confidence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/products">
                  <Button
                    size="lg"
                    className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-4 cursor-pointer"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              <div className="flex items-center space-x-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">5k+</div>
                  <div className="text-sm text-gray-600">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">4.8</div>
                  <div className="text-sm text-gray-600 flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    Rating
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">200+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <img
                    src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=300&h=400&fit=crop"
                    alt="Skincare"
                    className="rounded-2xl shadow-lg w-full h-64 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=300&h=300&fit=crop"
                    alt="Makeup"
                    className="rounded-2xl shadow-lg w-full h-48 object-cover"
                  />
                </div>
                <div className="space-y-4 pt-8">
                  <img
                    src="https://images.unsplash.com/photo-1606876430311-6b09172238b9?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=crop"
                    alt="Haircare"
                    className="rounded-2xl shadow-lg w-full h-48 object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/flagged/photo-1580820258381-20c91a156841?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D=crop"
                    alt="Beauty"
                    className="rounded-2xl shadow-lg w-full h-64 object-cover"
                  />
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-pink-200 rounded-full opacity-60 animate-pulse"></div>
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-rose-200 rounded-full opacity-60 animate-pulse delay-1000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our curated collections designed to enhance every aspect
              of your beauty routine
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products/${category.name}`}
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-rose-100 to-pink-100 p-8 hover:from-rose-200 hover:to-pink-200 transition-all duration-300 transform hover:scale-105"
              >
                <div className="relative z-10">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {category.label}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Discover premium {category.label.toLowerCase()} products
                  </p>
                  <div className="flex items-center text-rose-600 font-medium">
                    Shop Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white bg-opacity-20 rounded-full transform translate-x-16 translate-y-16"></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600">
              Our most loved products, carefully selected for you
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/products">
              <Button
                size="lg"
                variant="outline"
                className="border-rose-300 text-rose-600 hover:bg-rose-50"
              >
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Best Sellers
            </h2>
            <p className="text-lg text-gray-600">
              The products our customers can't stop talking about
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {bestSellers.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showBestSellerBadge
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Truck className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Free Shipping
              </h3>
              <p className="text-gray-600">
                Free shipping on orders over kes 1,500 with fast delivery
                countrywide
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                30-Day Returns
              </h3>
              <p className="text-gray-600">
                Not satisfied? Return any product within 30 days for a full
                refund
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Headphones className="h-8 w-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Expert Support
              </h3>
              <p className="text-gray-600">
                Get personalized beauty advice from our certified experts
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gray- text-whi">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay ahead</h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Get the latest beauty trends, exclusive offers, and expert tips
            delivered to your inbox
          </p>

          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:border-rose-400 text-white"
            />
            <Button className="bg-rose-500 hover:bg-rose-600 px-8 py-5">
              Subscribe
            </Button>
          </div>

          <p className="text-sm text-gray-500 mt-4">
            Join 5K+ beauty subscribers. Unsubscribe at any time.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
