import axios from "axios";
import EventsParser from "./src/EventsParser";

const PAGE_URL =
  "https://turismo.laplata.gob.ar/agenda-semanal-de-actividades-3/";

const parser = new EventsParser();

(async () => {
  const { data } = await axios.get(PAGE_URL);
  return data;
})().then((data: string) => console.log(parser.loadHtml(data).parse()));
