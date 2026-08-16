export type Memo = {
  id: number
  title: string
  content: string
  category: string
}

export type Category = {
  id: number
  name: string
}

export type MemoInput = {
  title: string
  content: string
  category: string
}

export type PredictInput = {
  title: string
  content: string
}

export type PredictResult = {
  category: string
  confidence?: number
}

export type TrainResult = {
  message: string
  training_samples: number
  categories: Record<string, number>
}