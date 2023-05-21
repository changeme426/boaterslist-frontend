const DAYS = [{ label: "Monday", value: "Mon" }, { label: "Tuesday", value: "Tue" }
  , { label: "Wednesday", value: "Wed" }, { label: "Thursday", value: "Thu" }, { label: "Friday", value: "Fri" }
  , { label: "Saturday", value: "Sat" }, { label: "Sunday", value: "Sun" }];

const HOURS = [{ label: "12:00 AM", value: "12:00 AM" }, { label: "12:30 AM", value: "12:30 AM" },
{ label: "1:00 AM", value: "1:00 AM" }, { label: "1:30 AM", value: "1:30 AM" },
{ label: "2:00 AM", value: "2:00 AM" }, { label: "2:30 AM", value: "2:30 AM" },
{ label: "3:00 AM", value: "3:00 AM" }, { label: "3:30 AM", value: "3:30 AM" },
{ label: "4:00 AM", value: "4:00 AM" }, { label: "4:30 AM", value: "4:30 AM" },
{ label: "5:00 AM", value: "5:00 AM" }, { label: "5:30 AM", value: "5:30 AM" },
{ label: "6:00 AM", value: "6:00 AM" }, { label: "6:30 AM", value: "6:30 AM" },
{ label: "7:00 AM", value: "7:00 AM" }, { label: "7:30 AM", value: "7:30 AM" },
{ label: "8:00 AM", value: "8:00 AM" }, { label: "8:30 AM", value: "8:30 AM" },
{ label: "9:00 AM", value: "9:00 AM" }, { label: "9:30 AM", value: "9:30 AM" },
{ label: "10:00 AM", value: "10:00 AM" }, { label: "10:30 AM", value: "10:30 AM" },
{ label: "11:00 AM", value: "11:00 AM" }, { label: "11:30 AM", value: "11:30 AM" },
{ label: "12:00 PM", value: "12:00 PM" }, { label: "12:30 PM", value: "12:30 PM" },
{ label: "1:00 PM", value: "1:00 PM" }, { label: "1:30 PM", value: "1:30 PM" },
{ label: "2:00 PM", value: "2:00 PM" }, { label: "2:30 PM", value: "2:30 PM" },
{ label: "3:00 PM", value: "3:00 PM" }, { label: "3:30 PM", value: "3:30 PM" },
{ label: "4:00 PM", value: "4:00 PM" }, { label: "4:30 PM", value: "4:30 PM" },
{ label: "5:00 PM", value: "5:00 PM" }, { label: "5:30 PM", value: "5:30 PM" },
{ label: "6:00 PM", value: "6:00 PM" }, { label: "6:30 PM", value: "6:30 PM" },
{ label: "7:00 PM", value: "7:00 PM" }, { label: "7:30 PM", value: "7:30 PM" },
{ label: "8:00 PM", value: "8:00 PM" }, { label: "8:30 PM", value: "8:30 PM" },
{ label: "9:00 PM", value: "9:00 PM" }, { label: "9:30 PM", value: "9:30 PM" },
{ label: "10:00 PM", value: "10:00 PM" }, { label: "10:30 PM", value: "10:30 PM" },
{ label: "11:00 PM", value: "11:00 PM" }, { label: "11:30 PM", value: "11:30 PM" }];

const DAYMAP = new Map([
  ['Mon', 'Monday'],
  ['Tue', 'Tuesday'],
  ['Wed', 'Wednesday'],
  ['Thu', 'Thursday'],
  ['Fri', 'Friday'],
  ['Sat', 'Saturday'],
  ['Sun', 'Sunday']
])

export { DAYS, HOURS, DAYMAP }
