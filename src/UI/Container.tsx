import React from 'react';

interface IContainerProps {
	children: React.ReactNode;
}

const Container: React.FC<IContainerProps> = ({ children }) => {
	return <div className="container">{children}</div>;
};

export default Container;
