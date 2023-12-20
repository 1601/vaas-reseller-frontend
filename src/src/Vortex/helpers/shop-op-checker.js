//Since in js Sunday is 0 we need to make some adjustments
function jsDayToSparkleDay(day) {
  switch (day) {
    case 0:
      return 6
    case 1:
      return 0
    case 2:
      return 1
    case 3:
      return 2
    case 4:
      return 3
    case 5:
      return 4
    case 6:
      return 5
    default:
      return 0
  }
}

function sparkleTimeToHour(sparkleTime) {
  try {
    //Split sparkle time and AM/PM
    var time = sparkleTime.split(" ")

    //Split time on the column
    var timeSplit = time[0].split(":")

    //For sparkle time with afternoon "PM"
    if (time[1] === "pm" || time[1] === "PM") {
      switch (timeSplit[0]) {
        case "1":
          return 13

        case "2":
          return 14

        case "3":
          return 15

        case "4":
          return 16

        case "5":
          return 17

        case "6":
          return 18

        case "7":
          return 19

        case "8":
          return 20

        case "9":
          return 21

        case "10":
          return 22

        case "11":
          return 23

        default:
          return 13
      }
    }

    return timeSplit[0]
  } catch (error) {
    throw error
  }
}

function sparkleTimeToDate(sparkleTime) {
  try {
    //Split sparkle time and AM/PM
    var time = sparkleTime.split(" ")

    //Split time on the column
    var timeSplit = time[0].split(":")

    let date = new Date()

    let customDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getUTCDay() - 2,
      sparkleTimeToHour(sparkleTime),
      timeSplit[1],
      0,
      0
    )

    return customDate
  } catch (error) {}
}

//This function will check if the store is currently open/close
function isShopOpen(schedule) {
  //get current date
  let date = new Date()

  //get current day
  let currentDay = jsDayToSparkleDay(date.getDay())

  //get current hour
  let currentHour = date.getHours()

  //get Schedule base on current day
  let currentSchedule = schedule[currentDay]

  //   `Current Schedule ${sparkleTimeToHour(
  //     currentSchedule.open
  //   )} - ${sparkleTimeToHour(currentSchedule.closed)}`
  // )

  if (
    currentHour >= sparkleTimeToHour(currentSchedule.open) &&
    currentHour < sparkleTimeToHour(currentSchedule.closed)
  ) {
    return true
  } else {
    return false
  }
}

export default isShopOpen
