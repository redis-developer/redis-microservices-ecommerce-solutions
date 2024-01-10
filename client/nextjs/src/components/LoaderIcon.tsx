'use client';

import { useEffect, useState } from 'react';

interface ILoaderIconProps {
    isLoading?: boolean;
}

const LoaderIcon = ({ isLoading }: ILoaderIconProps) => {

    return (
        <>
            {isLoading && (
                <div className="fixed top-0 left-0 w-screen h-screen flex items-center justify-center bg-gray-500 bg-opacity-50">
                    <i className="fas fa-spinner fa-spin fa-3x text-white"></i>
                </div>
            )}
        </>
    );
};

export default LoaderIcon;



