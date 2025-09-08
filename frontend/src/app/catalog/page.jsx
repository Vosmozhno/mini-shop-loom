import { medusa } from "@/lib/medusa";

export default async function CatalogPage() {
  const { products } = await medusa.products.list();

  
  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Каталог</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((p) => {
          return (
            <a
              key={p.id}
              href={`/product/${p.handle}`}
              className="border rounded-xl p-4 shadow hover:shadow-lg transition"
            >
          
              <img src={p.thumbnail} alt={p.title} className="mb-2 rounded" />
              <h2 className="font-semibold">{p.title}</h2>
            </a>
          );
        })}
      </div>
    </main>
  );
}
