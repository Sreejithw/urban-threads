import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/common/product/product-card";
import Pagination from "@/components/ui/common/tablecontrols/pagination";
import { getAllCategoriesAction, getAllProductsAction } from "@/lib/actions/product.actions";
import Link from "next/link";
import SortDropdown from "@/components/ui/common/dropdown/sort-dropdown";
import { pricesFilers } from "@/lib/constants/search.constants";
import { ListFilterIcon } from "lucide-react";

const ratings = [4, 3, 2, 1];

const sortOrders = ['newest', 'lowest', 'highest', 'rating'];

export async function generateMetadata(props: {
    searchParams: Promise<{
      q: string;
      category: string;
      price: string;
      rating: string;
    }>;
  }) {
    const {
      q = 'all',
      category = 'all',
      price = 'all',
      rating = 'all',
    } = await props.searchParams;

    const isQuerySet = q && q !== 'all' && q.trim() !== '';
    const isCategorySet = category && category !== 'all' && category.trim() !== '';
    const isPriceSet = price && price !== 'all' && price.trim() !== '';
    const isRatingSet = rating && rating !== 'all' && rating.trim() !== '';

    if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
        return {
        title: `Search ${
            isQuerySet ? q : ''
        }
        ${isCategorySet ? `: Category ${category}` : ''}
        ${isPriceSet ? `: Price ${price}` : ''}
        ${isRatingSet ? `: Rating ${rating}` : ''}`,
        };
    } else {
        return {
        title: 'Search Products',
        };
    }
}

const SearchPage = async (props: {
    searchParams: Promise<{
      q?: string; category?: string; price?: string;
      rating?: string; sort?: string; page?: string;showFilters?: string;
    }>;
  }) => {
    const { q = 'all', category = 'all', price = 'all',
      rating = 'all', sort = 'newest', page = '1', showFilters = 'true',
    } = await props.searchParams;
  
    const products = await getAllProductsAction({ 
        category, query: q, price, 
        rating, page: Number(page), sort,
      });

      const getFilterUrl = ({ c, s, p, r, pg, sf }: {
        c?: string; s?: string; p?: string; r?: string; pg?: string; sf?: string;
      }) => {
        const params = { q, category, price, rating, sort, page, showFilters };
        if (c) params.category = c;
        if (p) params.price = p;
        if (r) params.rating = r;
        if (pg) params.page = pg;
        if (s) params.sort = s;
        if (sf) params.showFilters = sf;
        return `/search?${new URLSearchParams(params).toString()}`;
      };

    const categories = await getAllCategoriesAction();
  
    return (
        <div className='grid md:grid-cols-5 md:gap-5 mb-4 relative z-10'>
          {showFilters === 'true' && (
            <div className='filter-links mt-12 ml-12'>
              {/* Category Links */}
              <div className='text-lg mt-3 mb-2'>Department</div>
              <div>
                <ul className='space-y-1'>
                  <li>
                    <Link
                      className={`text-sm ${
                        ('all' === category || '' === category) && 'font-bold'
                      }`}
                      href={getFilterUrl({ c: 'all' })}
                    >
                      Any
                    </Link>
                  </li>
                  {categories.map((x) => (
                    <li key={x.category}>
                      <Link
                        className={`text-sm ${x.category === category && 'font-bold'}`}
                        href={getFilterUrl({ c: x.category })}
                      >
                        {x.category}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                  <div className='text-lg mt-8 mb-2'>Price</div>
                  <ul className='space-y-1'>
                      <li>
                      <Link
                          className={`text-sm ${'all' === price && 'font-bold'}`}
                          href={getFilterUrl({ p: 'all' })}
                      >
                          Any
                      </Link>
                      </li>
                      {pricesFilers.map((p) => (
                      <li key={p.value}>
                          <Link
                          href={getFilterUrl({ p: p.value })}
                          className={`text-sm ${p.value === price && 'font-bold'}`}
                          >
                          {p.name}
                          </Link>
                      </li>
                      ))}
                  </ul>
              </div>
              <div>
                  <div className='text-lg mt-8 mb-2'>Customer Review</div>
                  <ul className='space-y-1'>
                      <li>
                      <Link
                          href={getFilterUrl({ r: 'all' })}
                          className={`text-sm ${'all' === rating && 'font-bold'}`}
                      >
                          Any
                      </Link>
                      </li>
                      {ratings.map((r) => (
                      <li key={r}>
                          <Link
                          href={getFilterUrl({ r: `${r}` })}
                          className={`text-sm ${r.toString() === rating && 'font-bold'}`}
                          >
                          {`${r} stars & up`}
                          </Link>
                      </li>
                      ))}
                  </ul>
              </div>
            </div>
          )}
          <div className={`${showFilters === 'true' ? 'md:col-span-4' : 'md:col-span-5'} space-y-4`}>
            <div className='flex-between flex-col md:flex-row my-4 mr-4'>
              <div className='flex items-center'>
                  {q !== 'all' && q !== '' && 'Query : ' + q}
                  {category !== 'all' && category !== '' && '   Category : ' + category}
                  {price !== 'all' && '    Price: ' + price}
                  {rating !== 'all' && '    Rating: ' + rating + ' & up'}
                  &nbsp;
                  {(q !== 'all' && q !== '') ||
                  (category !== 'all' && category !== '') ||
                  rating !== 'all' ||
                  price !== 'all' ? (
                  <Button variant={'link'} asChild>
                      <Link href='/search'>Clear</Link>
                  </Button>
                  ) : null}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="flex items-center gap-2"
                >
                  <Link href={getFilterUrl({ sf: showFilters === 'true' ? 'false' : 'true' })}>
                    {showFilters === 'true' ? (
                        'Show Filters'
                    ) : (
                        'Hide Filters'
                    )}
                    <ListFilterIcon className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
                <SortDropdown 
                  sortOrders={sortOrders} 
                  sort={sort}
                  searchParams={{ q, category, price, rating, page }}
                />
              </div>
            </div>
            <div className='grid grid-cols-1 gap-4 md:grid-cols-3 justify-items-center'>
              {products!.data.length === 0 && <div>No product found</div>}
              {products!.data.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            {products!.totalPages! > 1 && (
              <Pagination page={page} totalPages={products!.totalPages} />
            )}
          </div>
        </div>
    );
  };

export default SearchPage;