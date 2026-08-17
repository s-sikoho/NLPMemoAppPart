import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
type Props = {
  OnTrain: () => Promise<void>;
};
export function TrainButton({OnTrain}:Props) {
  const [training, setTraining] = useState(false);

  async function handleTrain() {
    try {
      setTraining(true);
      await OnTrain();
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
