import React, { useEffect } from 'react';

// A simple Loading spinner component
interface LoadingProps {
  open: boolean; // Prop to control visibility of the loader
}

const Loading: React.FC<LoadingProps> = ({ open }) => {
  
  if (!open) return null; // If `open` is false, do not render the component

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gray-500  flex items-center justify-center " 
     style={{zIndex:999 , backgroundColor:"rgba(0,0,0,.8)",position:"fixed", top:"0"}}>
      <div className="border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div>
    </div>
  );
};

export default Loading;
