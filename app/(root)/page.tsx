import ProductList from "@/components/ui/common/products/product-list";
import ProductListButton from "@/components/ui/common/product/product-list-button";
import FeatureList from "@/components/ui/common/shoppingassets/icons";
import Promotions from "@/components/ui/common/shoppingassets/promotions";
import LoadingAnimation from "@/components/ui/common/loader";
import Hero from "@/components/ui/common/hero/hero";
import { getNewProducts } from "@/lib/actions/product.actions";

const HomePage = async () => {
  const newProducts = await getNewProducts();
  return (
    <div>
      <LoadingAnimation />
      <Hero />
      <Promotions />
      <ProductList data={newProducts} title="Featured Collection" maxShowValue={3} />
      <ProductListButton />
      <FeatureList />
    </div>
  );
}
 
export default HomePage;