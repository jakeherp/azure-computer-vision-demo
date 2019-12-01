import React, { useEffect, useState } from "react"
import axios from "axios"

const subscriptionKey = process.env.REACT_APP_COMPUTER_VISION_SUBSCRIPTION_KEY
const endpoint = process.env.REACT_APP_COMPUTER_VISION_ENDPOINT
const params =
	"visualFeatures=Categories,Description,Color&details=&language=en"
const url = `${endpoint}vision/v2.1/analyze?${params}`

const imageUrl =
	"https://media.itpro.co.uk/image/upload/t_content-image-desktop@2/v1570817054/itpro/2019/06/jony_ive_and_tim_cook.jpg"

function App() {
	const [altText, setAltText] = useState("")
	const [allData, setAllData] = useState({})

	const [input, setInput] = useState(imageUrl)

	const capitalize = string => {
		return string.charAt(0).toUpperCase() + string.slice(1)
	}

	const data = JSON.stringify({
		url: input,
	})

	useEffect(() => {
		setAltText("")
		setAllData({})
		axios
			.post(url, data, {
				headers: {
					"Content-Type": "application/json",
					"Ocp-Apim-Subscription-Key": subscriptionKey,
				},
			})
			.then(res => {
				console.log(res)
				setAllData(res.data)
				setAltText(capitalize(res.data.description.captions[0].text))
			})
			.catch(function(error) {
				setAltText("Not found")
			})
	}, [input])

	return (
		<div className="App">
			<input
				placeholder="Image Url"
				value={input}
				onChange={e => setInput(e.target.value)}
				style={{ width: "50%" }}
			/>

			{altText.length > 0 ? (
				<>
					<h1>{altText}</h1>
					{allData.description.length && (
						<p>
							Confidence:{" "}
							{(
								allData.description.captions[0].confidence * 100
							).toFixed(2)}
							%
						</p>
					)}
				</>
			) : (
				<h1>Loading alt text ...</h1>
			)}
			<img
				src={input}
				alt={altText}
				style={{ maxWidth: "50%", margin: "0 auto" }}
			/>
			{altText.length > 0 && altText !== "Not found" && (
				<pre
					style={{
						background: "#eee",
						color: "#999",
						fontFamily: "monospace",
						padding: "1rem",
					}}
				>
					{JSON.stringify(allData, null, 2)}
				</pre>
			)}
		</div>
	)
}

export default App
