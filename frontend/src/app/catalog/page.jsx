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
      .then(({ product_categories }) => setCategories(product_categories))
      .catch((err) => console.error("Ошибка при получении категорий:", err))
  }, [])

  useEffect(() => {
    setLoading(true);
    const params = {
      fields: "*variants.calculated_price",
      region_id: "reg_01K85W4J26QYCAR5VP64BXCM63",
      sales_channel_id: ["sc_01KA94GJ8JGEXJWJ1S87WCSXWG"],
    };
    if (searchQuery) params.q = searchQuery;
    if (selectedCategories.length > 0) params.category_id = selectedCategories;

    const timer = setTimeout(() => {
      medusa.products.list(params)
        .then(({ products }) => setProducts(products))
        .catch((err) => console.error("Ошибка при получении продуктов:", err))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategories]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );

  };

  return (
    <main className="px-6 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-bold uppercase tracking-wider text-center mb-12">
          Каталог
        </h1>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 mb-16 items-center">
          <div className="flex-grow w-full">
            <input
              type="search"
              placeholder="Поиск..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 bg-transparent border border-white/30 rounded-md text-white placeholder:text-neutral-500 uppercase tracking-widest text-sm focus:outline-none focus:ring-1 focus:ring-white/50"
            />
          </div>

          <div className="relative w-full md:w-auto" ref={dropdownRef}>
            <button
              onClick={() => setCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="w-full md:w-64 px-5 py-3 bg-transparent border border-white/30 rounded-md text-white uppercase tracking-widest text-sm flex items-center justify-between"
            >
              <span>
                {selectedCategories.length > 0
                  ? `Категории (${selectedCategories.length})`
                  : "Все категории"}
              </span>
              <svg className={`w-4 h-4 transition-transform ${isCategoryDropdownOpen ? 'transform rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            {isCategoryDropdownOpen && (
              <div className="absolute top-full mt-2 w-full bg-neutral-900 border border-white/30 rounded-md z-10 p-2 max-h-60 overflow-y-auto">
                {categories.map((cat) => (
                  <label key={cat.id} className="flex items-center gap-3 p-2 hover:bg-neutral-800 rounded cursor-pointer uppercase text-sm tracking-widest">
                    <input
                      type="checkbox"
                      checked={selectedCategories.includes(cat.id)}
                      onChange={() => handleCategoryChange(cat.id)}
                      className="h-4 w-4 rounded bg-neutral-700 border-neutral-600 text-white focus:ring-white/50"
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-center">Загрузка товаров...</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
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
                <Link key={p.id} href={`/product/${p.handle}`} className="group">
                  <div className="aspect-square w-full overflow-hidden rounded-md bg-neutral-900">
                    <img
                      src={p.thumbnail}
                      alt={p.title}
                      className="w-full h-full object-cover object-center transition-opacity group-hover:opacity-80"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h2 className="text-sm uppercase tracking-widest font-semibold text-white">
                      {p.title}
                    </h2>
                    <p className="mt-1 text-base text-neutral-200">{price}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <p className="text-center text-gray-400">
            Товары не найдены. Попробуйте изменить критерии поиска.
          </p>
        )}
      </div>
    </main>
  );
}