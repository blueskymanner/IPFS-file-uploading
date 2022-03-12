import { useState } from "react";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient.create({ host: "ipfs.infura.io", port: 5001, protocol: "https" });
const Buffer = require("buffer/").Buffer;

function App() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [capturedFileBuffer, setCapturedFileBuffer] = useState(null);

	const submissionHandler = async (event) => {
		event.preventDefault();

		const fileAdded = await ipfs.add(capturedFileBuffer);
		if (!fileAdded) {
			console.error("Something went wrong when updloading the file");
			return;
		}

		console.log(`https://ipfs.infura.io/ipfs/${fileAdded.path}`);

		const metadata = {
			name: name,
			description: description,
			image: `https://ipfs.infura.io/ipfs/${fileAdded.path}`,
		};

		const metadataAdded = await ipfs.add(JSON.stringify(metadata));
		console.log(`https://ipfs.infura.io/ipfs/${metadataAdded.path}`);

		if (!metadataAdded) {
			console.error("Something went wrong when updloading the file");
			return;
		}
	};

	const captureFile = (event) => {
		event.preventDefault();

		const file = event.target.files[0];
		const reader = new window.FileReader();
		reader.readAsArrayBuffer(file);
		reader.onloadend = () => {
			setCapturedFileBuffer(Buffer(reader.result));
		};
	};

	return (
		<form onSubmit={submissionHandler}>
			<input type="text" placeholder="Name..." value={name} onChange={(e) => setName(e.target.value)} />
			<input type="text" placeholder="Description..." value={description} onChange={(e) => setDescription(e.target.value)} />
			<input type="file" onChange={captureFile} />
			<button type="submit">upload</button>
		</form>
	);
}

export default App;
