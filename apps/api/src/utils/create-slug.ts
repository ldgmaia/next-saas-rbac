// Generate a random English word
function randomWord(): string {
  const words = [
    'apple',
    'banana',
    'orange',
    'grape',
    'kiwi',
    'strawberry',
    'blueberry',
    'peach',
    'pear',
    'melon',
    'carrot',
    'potato',
    'broccoli',
    'tomato',
    'cucumber',
    'spinach',
    'lettuce',
    'pepper',
    'onion',
    'garlic',
    // Add more words as needed
  ]
  const index = Math.floor(Math.random() * words.length)
  return words[index]
}

export function createSlug(text: string): string {
  const uniqueId = `${randomWord()}-${randomWord()}` // Generate two random English words separated by a hyphen
  const cleanedText = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^\w\s]/gi, '')
    .trim()
    .replace(/\s+/g, '')
    .toLowerCase()
  return `${cleanedText}-${uniqueId}`
}
