import Head from "next/head";
import { useState } from "react";
import styles from "./index.module.css";

export default function Home() {
  const [animalInput, setAnimalInput] = useState("");
  const [textInput, setTextInput] = useState("");
  const [result, setResult] = useState();
  const [textToImage, setTextToImageResult] = useState([]);

  async function onSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ animal: animalInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setAnimalInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  async function onTextToImageSubmit(event) {
    event.preventDefault();
    try {
      const response = await fetch("/api/image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: textInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }
      setTextToImageResult(data.result?.data);
      // setTextInput("");
    } catch (error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
  }

  return (
    <div>
      <Head>
        <title>OpenAI Quickstart</title>
        <link rel="icon" href="/dog.png" />
      </Head>

      <section className={styles.main}>
        <h3>Text To Image</h3>
        <form onSubmit={onTextToImageSubmit}>
          <input
            type="text"
            name="text"
            placeholder="Enter Text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <input type="submit" value="Generate Image" />
        </form>
        <div style={{ display: 'flex' }}>
        {
          textToImage?.map((image) => (
            <div className={styles.result}>
            <img src={image?.url} alt="Image result will be displayed here" />
          </div>  
          ))
        }
        </div>
      </section>

      <section className={styles.main}>
        <img src="/dog.png" className={styles.icon} />
        <h3>Name my pet</h3>
        <form onSubmit={onSubmit}>
          <input
            type="text"
            name="animal"
            placeholder="Enter an animal"
            value={animalInput}
            onChange={(e) => setAnimalInput(e.target.value)}
          />
          <input type="submit" value="Generate names" />
        </form>
        <div className={styles.result}>{result}</div>
      </section>
    </div>
  );
}
