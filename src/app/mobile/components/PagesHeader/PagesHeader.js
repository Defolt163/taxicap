import Link from 'next/link'
import './style.sass'
export default function PagesHeader(props){
    return(
        <div className="PageHeader">
            <Link href={props.ReturnBtn} className="ReturnButton">
                <i className="fa-solid fa-chevron-left"></i>
            </Link>
            <h2>{props.PageHeader}</h2>
        </div>
    )
}