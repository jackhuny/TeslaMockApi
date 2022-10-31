import React from "react";

const Footer: React.FC = () => {
    return (
        <>
            <footer>
                <p>Version 0.1</p>
            </footer>
            <style jsx>
                {`
                    footer p {
                        text-align: center;
                    }
                `}
            </style>
        </>
    );
};

export default Footer;
