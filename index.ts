import axios from "axios";
import EventsParser from "./src/EventsParser";
import fs from "fs";
import { WEEKLY_AGENDA_URL, WEEKLY_FOOD_URL } from "./src/constants";

const agendaEventsParser = new EventsParser("WeeklyAgenda");
const foodEventsParser = new EventsParser("FoodActivities");

(async () => (await axios.get(WEEKLY_AGENDA_URL)).data)()
  .then((data: string) =>
    fs.writeFileSync(
      "agenda.json",
      JSON.stringify(
        agendaEventsParser.enableLogs().load(data).parse(),
        null,
        2
      )
    )
  )
  .catch((err) => console.error(err.message));

(async () => (await axios.get(WEEKLY_FOOD_URL)).data)()
  .then((data: string) =>
    fs.writeFileSync(
      "food.json",
      JSON.stringify(foodEventsParser.enableLogs().load(data).parse(), null, 2)
    )
  )
  .catch((err) => console.error(err.message));
