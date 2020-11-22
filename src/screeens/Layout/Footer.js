import {Link, useLocation} from 'react-router-dom'
import ColoredLine from '../../component/ColoredLine';
import React from 'react';

const Footer = () => {
    let path = useLocation().pathname;
    if (path === '/forgotPass' || path === '/loginWarn') return null;

    return (
        <div>
         <ColoredLine color="#F8F9FA" />
            <div bg="light" variant="light" className="my-3" style={{textAlign:"center"}}>   
                &copy; All right reserved <Link to={`/`}>Balobe</Link> 2020  
            </div>
        </div>
    );
};

export default Footer