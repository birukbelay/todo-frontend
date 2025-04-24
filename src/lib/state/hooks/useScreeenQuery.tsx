'use client'
import { useEffect, useState } from 'react';

const useMaxWidth = (maxWidth: number) => {
    const [mount, setmount] = useState(false)
    const [isGreaterThanMaxWidth, setIsGreaterThanMaxWidth] = useState(
        mount && window.innerWidth > maxWidth
    );
    useEffect(() => {
        setmount(true)
    }, [])
    useEffect(() => {
        const handleResize = () => {
            setIsGreaterThanMaxWidth(window.innerWidth > maxWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [maxWidth]);
    if (!mount) return

    return isGreaterThanMaxWidth;
};

export default useMaxWidth;
