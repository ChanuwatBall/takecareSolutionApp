import React  from 'react'; 

// A simple Loading spinner component
interface LoadingProps {
  open: boolean; // Prop to control visibility of the loader
}

const Loading: React.FC<LoadingProps> = ({  }) => {
  // const loading = useSelector(getLoading)
  //  useEffect(()=>{ },[loading])
  
  // if (!open) return null; // If `open` is false, do not render the component

  return (
    <div className="fixed bg-gray-500  flex items-center justify-center " 
     style={{zIndex:999 , backgroundColor:"rgba(0,0,0,.8)",position:"fixed", top:"0" , width:"100vw" , height:"100vh",overflow:"hidden"}}>
       <img src='../../assets/loading.gif' style={{width:"4rem",marginTop:"-2rem"}} />
      {/* <div className="border-t-4 border-blue-500 border-solid rounded-full w-16 h-16 animate-spin"></div> */}
    </div>
  );
};

export default Loading;
