import { getAllCategoriesAction } from "@/lib/actions/product.actions";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from "../../button";
import { MenuIcon } from "lucide-react";
import Link from "next/link";

const ProductCategoryDrawer = async () => {

    const categoryList = await getAllCategoriesAction();

    return (
        <Drawer direction='left'>
          <DrawerTrigger asChild>
            <Button variant='outline'>
              <MenuIcon />
            </Button>
          </DrawerTrigger>
          <DrawerContent className='h-full max-w-sm'>
            <DrawerHeader>
              <DrawerTitle>Select a category</DrawerTitle>
              <div className='space-y-1'>
                {
                  categoryList.map((obj) => (
                    <Button
                      className='w-full justify-start'
                      variant='ghost'
                      key={obj.category}
                      asChild
                    >
                      <DrawerClose asChild>
                        <Link href={`/search?category=${obj.category}`}>
                          {obj.category} ({obj._count})
                        </Link>
                      </DrawerClose>
                    </Button>
                  ))
                }
              </div>
            </DrawerHeader>
          </DrawerContent>
        </Drawer>
    );
}
 
export default ProductCategoryDrawer;