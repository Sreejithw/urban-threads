'use client';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

type SortDropdownProps = {
    sortOrders: string[];
    sort: string;
    searchParams: {
        q?: string;
        category?: string;
        price?: string;
        rating?: string;
        page?: string;
    };
}

const SortDropdown = ({ sortOrders, sort, searchParams }: SortDropdownProps) => {
    const router = useRouter();

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams({
            q: searchParams.q || 'all',
            category: searchParams.category || 'all',
            price: searchParams.price || 'all',
            rating: searchParams.rating || 'all',
            page: searchParams.page || '1',
            sort: value
        });
        router.push(`/search?${params.toString()}`);
    };

    return (
        <div>
            <Select value={sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    {sortOrders.map((s) => (
                        <SelectItem key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
 
export default SortDropdown;