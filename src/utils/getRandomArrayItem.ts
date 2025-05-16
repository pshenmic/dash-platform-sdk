export default function getRandomArrayItem (array: ArrayLike<any>): any {
  return array[Math.floor((Math.random() * array.length))]
}
