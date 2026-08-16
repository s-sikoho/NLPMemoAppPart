import { useState } from "react";
import { toast } from "sonner";

import { trainClassifier } from "@/api/classifier";

import { Button } from "@/components/ui/button";

export function TrainButton() {
  const [training, setTraining] = useState(false);

  async function handleTrain() {
    try {
      setTraining(true);

      const result = await trainClassifier();

      toast.success(`再学習完了: ${result.training_samples}件`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "再学習に失敗しました";

      toast.error(message);
    } finally {
      setTraining(false);
    }
  }

  return (
    <Button variant="outline" onClick={handleTrain} disabled={training}>
      {training ? "再学習中..." : "モデルを再学習"}
    </Button>
  );
}
