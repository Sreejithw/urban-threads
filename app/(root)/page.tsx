import ProductList from "@/components/ui/common/products/product-list";
import { getNewProducts } from "@/lib/actions/product.actions";

const HomePage = async () => {
  const newProducts = await getNewProducts();

  return <ProductList data={newProducts} title="Newest Arrivals" maxShowValue={4} />
}
 
export default HomePage;