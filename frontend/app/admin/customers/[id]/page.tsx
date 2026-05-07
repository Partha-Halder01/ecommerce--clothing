import CustomerDetailClient from "./client-page"

// Required for static export with dynamic routes
export const dynamicParams = true
export async function generateStaticParams() {
    // Return empty array - routes will be generated on-demand at runtime
    return []
}

export default function CustomerDetailPage() {
    return <CustomerDetailClient />
}
