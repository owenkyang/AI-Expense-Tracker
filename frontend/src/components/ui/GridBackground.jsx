const GridBackground = ({ children }) => {
	return (
		<div className='w-full bg-black text-white bg-grid-white/[0.2] relative'>
			{children}
		</div>
	);
};

export default GridBackground;