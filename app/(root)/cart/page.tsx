import CartList from "./cart-items-list";
import { getMyCart } from "@/lib/actions/cart.actions";

export const metadata ={
    title: 'Shopping Cart',
}

const ShoppingCartPage = async() => {
    const cart = await getMyCart();


    return <CartList cart={cart} />;
}
 
export default ShoppingCartPage;