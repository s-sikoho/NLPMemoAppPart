import { useState } from "react";
import { trainClassifier } from "../api/classifierApi";

function TrainButton() {
  const [message, setMessage] = useState("");
  const [training, setTraining] = useState(false);

  async function handleTrain() {
    try {
      setTraining(true);
      setMessage("");

      const result = await trainClassifier();

      setMessage(`再学習完了: ${result.training_samples}件`);
    } catch (error) {
      setMessage(`エラー: ${error.message}`);
    } finally {
      setTraining(false);
    }
  }

  return (
    <div>
      <button onClick={handleTrain} disabled={training}>
        {training ? "再学習中..." : "再学習"}
      </button>

      <p>{message}</p>
    </div>
  );
}

export default TrainButton;
