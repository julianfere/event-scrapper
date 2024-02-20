import * as cheerio from "cheerio";

class EventsParser {
  private $: cheerio.CheerioAPI;
  private events: Record<string, string>[] = [];

  constructor() {
    this.$ = cheerio.load("");
    this.events = [];
  }

  public loadHtml(html: string) {
    this.$ = cheerio.load(html);
    return this;
  }

  private parseItem(item: string[]) {
    let res: Record<string, string> = {};

    item.forEach((el, i) => {
      const $ = cheerio.load(el);

      if (i === 0) {
        res["title"] = $("strong").text();
      }

      if (i === 1) {
        res["description"] = el;
      }

      if (i === 2) {
        res["date"] = $("strong").text() ?? el;
      }

      if (i === 3) {
        let present = $("strong").text().trim() === "";

        res["extra"] = present ? $("strong").text() : el;
      }
    });

    return res;
  }

  public parse() {
    const article = this.$("main section")
      .first()
      .children()
      .first()
      .children();

    const eventList: string[][] = [];
    let block: string[] = [];
    let beginBlock = true;

    article.each((i, el) => {
      if (el.tagName === "hr") beginBlock = !beginBlock;

      if (beginBlock) {
        let elem = this.$(el).html();
        block.push(elem ?? "");
      }

      if (beginBlock && el.tagName === "hr") {
        eventList.push(block);
        block = [];
      }
    });

    eventList.forEach((item) => {
      this.events.push(this.parseItem(item));
    });

    return this.events;
  }
}

export default EventsParser;
