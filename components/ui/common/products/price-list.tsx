import { cn } from "@/lib/utils";

const PriceList = ({value, className } : {value: number, className?:string}) => {
    const roundedOffValue =  Number(value).toFixed(2);
    const [dollarValue, centsValue] = roundedOffValue.split('.');

    return (<p className={ cn('text-2xl', className)}>
        <span className="text-xs align-super">$</span>
        { dollarValue } 
        <span className="text-xs align-super">.{ centsValue }</span>
    </p>);
}
 
export default PriceList;