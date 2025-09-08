"use client"

import { useEffect, useState } from "react"
import { sdk } from "@/lib/medusa"

export default function CatalogPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    sdk.products.list({
      fields: "*variants.calculated_price",
    })
      .then(({ products }) => {
        setProducts(products)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Ошибка при получении продуктов:", err)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <p className="p-6">Загрузка продуктов...</p>
  }

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">Каталог</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => {
          const variant = p.variants?.[0]
          const price =
            variant?.calculated_price?.calculated_amount !== undefined
              ? new Intl.NumberFormat("ru-RU", {
                  style: "currency",
                  currency: variant.calculated_price.currency_code || "RUB",
                }).format(variant.calculated_price.calculated_amount)
              : "Цена недоступна"

          return (
            <a
              key={p.id}
              href={`/product/${p.handle}`}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col items-center"
            >
              <img
                src={p.thumbnail}
                alt={p.title}
                className="mb-2 rounded object-cover w-100 h-100 "
              />
              <h2 className="font-semibold text-center">{p.title}</h2>
              <p className="text-center">{price}</p>
            </a>
          )
        })}
      </div>
    </main>
  )
}
