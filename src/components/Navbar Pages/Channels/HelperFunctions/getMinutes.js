/*-------------Get minutes from HH:MM (hours and minutes 24 hr form)-----------------*/
export default function getMinutes(time) {
  let str = time;
  let arr = str.split(":");
  let minutes = +arr[0] * 60 + +arr[1];
  //console.log(minutes);
  return minutes;
}
