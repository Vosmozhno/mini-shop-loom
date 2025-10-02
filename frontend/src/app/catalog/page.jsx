"use client"

import { useEffect, useState, useRef } from "react"
import { medusa } from "@/lib/medusa"
import Link from "next/link"

export default function CatalogPage() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategories, setSelectedCategories] = useState([])

  const [isCategoryDropdownOpen, setCategoryDropdownOpen] = useState(false)
  
  const dropdownRef = useRef(null)

  useEffect(() => {
    medusa.productCategories.list({ limit: 100 })
      .then(({ product_categories }) => {
        setCategories(product_categories)
      })
      .catch((err) => {
        console.error("Ошибка при получении категорий:", err)
      })
  }, [])

  useEffect(() => {
    setLoading(true);
    const fetchProducts = async () => {
      try {
        const params = {
          fields: "*variants.calculated_price",
          region_id: "reg_01K60RPE6D6HS0EQ71DVRBT35A",
        };
        if (searchQuery) params.q = searchQuery;
        if (selectedCategories.length > 0) params.category_id = selectedCategories;
        
        const { products } = await medusa.products.list(params);
        setProducts(products);
      } catch (err) {
        console.error("Ошибка при получении продуктов:", err);
      } finally {
        setLoading(false);
      }
    };
    const timer = setTimeout(() => fetchProducts(), 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategories]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Каталог</h1>

      <div className="flex flex-col md:flex-row gap-6 mb-8 items-center">
        <div className="flex-grow w-full">
          <input
            type="search"
            placeholder="Поиск по названию..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-xl bg-neutral-800 text-white border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
          />
        </div>

        <div className="relative w-full md:w-auto" ref={dropdownRef}>
          <button
            onClick={() => setCategoryDropdownOpen(!isCategoryDropdownOpen)}
            className="w-full md:w-56 px-4 py-2 rounded-xl bg-neutral-800 text-white border border-neutral-700 flex items-center justify-between"
          >
            <span>
              {selectedCategories.length > 0
                ? `Категории (${selectedCategories.length})`
                : "Выберите категории"}
            </span>
            <svg className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </button>

          {isCategoryDropdownOpen && (
            <div className="absolute top-full mt-2 w-full md:w-56 bg-neutral-800 border border-neutral-700 rounded-xl z-10 p-2 max-h-60 overflow-y-auto">
              {categories.map((cat) => (
                <label 
                  key={cat.id} 
                  className="flex items-center gap-3 p-2 hover:bg-neutral-700 rounded cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat.id)}
                    onChange={() => handleCategoryChange(cat.id)}
                    className="h-4 w-4 rounded bg-neutral-900 border-neutral-600 text-indigo-500 focus:ring-indigo-600"
                  />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <p className="text-center">Загрузка продуктов...</p>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p) => {
            const variant = p.variants?.[0];
            const price =
              variant?.calculated_price?.calculated_amount !== undefined
                ? new Intl.NumberFormat("ru-RU", {
                    style: "currency",
                    currency: variant.calculated_price.currency_code || "RUB",
                  }).format(variant.calculated_price.calculated_amount)
                : "Цена недоступна";
            return (
              <Link
                key={p.id}
                href={`/product/${p.handle}`}
                className="bg-neutral-900 rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col items-center group"
              >
                <div className="w-full h-90 overflow-hidden rounded-lg mb-4">
                  <img
                    src={p.thumbnail}
                    alt={p.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h2 className="font-semibold text-center">{p.title}</h2>
                <p className="text-center mt-1">{price}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          Товары не найдены. Попробуйте изменить критерии поиска.
        </p>
      )}
    </main>
  );
}