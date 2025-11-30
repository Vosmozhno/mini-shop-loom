async function fetchApi(path) {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  const requestUrl = `${strapiUrl}${path}`;
  
  try {
    const response = await fetch(requestUrl, { cache: 'no-store' });
    if (!response.ok) {
      console.error("Strapi request failed:", response.statusText);
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching from Strapi:", error);
    return null;
  }
}

export async function getPageBySlug(slug) {
  const response = await fetchApi(`/api/pages?filters[slug][$eq]=${slug}&populate=*`);
  
  if (response && response.data && response.data.length > 0) {

    return response.data[0]; 
  }
  
  return null;
}