import { useState } from 'react';

function App() {
	const [count, setCount] = useState(0);

	return (
		<div>
			<h1 style={{ color: 'red' }}>Todo List</h1>
		</div>
	);
}

export default App;
