import Link from 'next/link'
import './style.sass'
import chevronLeft from '@/../public/ico/ui/chevron-left-solid-full.svg'
import Image from 'next/image'
export default function PagesHeader(props){
    return(
        <div className="PageHeader">
            <Link href={props.ReturnBtn} className="ReturnButton">
                <Image width={25} src={chevronLeft} alt='cheevron-left'/>
            </Link>
            <h2>{props.PageHeader}</h2>
        </div>
    )
}