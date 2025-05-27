export default function getRandomArrayItem (array: any[]): any {
  return array[Math.floor((Math.random() * array.length))]
}
