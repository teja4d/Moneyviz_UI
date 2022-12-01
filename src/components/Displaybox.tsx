import React from 'react'
import './Displaybox.css';
import classNames from 'classnames';
type Props = {
    title: string;
    text: number;
    icon:'fa-coins' | 'fa-money-bill-transfer',
    theme:'redShadow' | 'blueShadow' | 'greenShadow'
}

const Displaybox = ({title,text,icon,theme}: Props) => {
  return (
    <>
    {/* //Dashboard box */}
    <div className={classNames("dashboard-box",theme)}>
       <p className={"p"+theme}><i className={classNames('fa-solid',icon)} style={{color:'lightred',fontSize:'20px'}}></i>&nbsp;{title}</p>
         <h3 className={"h"+theme}>£{text}</h3>
    </div> 
    </> 
  )
}

export default Displaybox