import * as cheerio from "cheerio";
import { EventTags, IEventResponse, IParsedEvent } from "./types";

/**
 * EventsParser class to parse the events from the html page of the La Plata's tourism office
 *
 * @class
 * @public
 * @constructor
 * @method load
 * @method parse
 */
class EventsParser {
  private $: cheerio.CheerioAPI;
  private events: IParsedEvent[];
  private log: boolean;
  readonly tags: EventTags[];

  private nbspPattern: RegExp = /&nbsp;/g;
  private htmlPattern: RegExp = /<[^>]*>/g;
  private urlPattern: RegExp =
    /((https?:\/\/)?(www\.)?[a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*))/gi;

  /**
   * Constructor
   * @param eventTags - Array of EventTags
   * @returns self
   */
  constructor(...eventTags: EventTags[]) {
    this.$ = cheerio.load("");
    this.events = [];
    this.log = false;
    this.tags = eventTags;
  }

  /**
   * Enable logs
   *
   * @returns self
   */
  public enableLogs() {
    this.log = true;

    return this;
  }

  /**
   *  Load the html to parse
   *
   * @param html
   * @returns self
   */
  public load(html: string) {
    this.$ = cheerio.load(html);

    return this;
  }

  /**
   * Remove empty objects from the array
   *
   * @param arr - Array of IParsedEvent
   * @returns Array of IParsedEvent
   *
   */
  private removeEmpties(arr: IParsedEvent[]): IParsedEvent[] {
    return arr
      .filter((item) => Object.keys(item).length)
      .filter((item) => item.title && item.description);
  }

  /**
   * Parse the event item
   *
   * @param item - Array of strings
   * @param index - Index of the item
   * @returns IParsedEvent
   */
  private parseItem(item: string[], index: number) {
    if (index === 0) return {} as IParsedEvent;

    const [titleToParse, ...rest] = item;

    const title = cheerio.load(titleToParse)("strong").text();

    let description = rest.join("\n");

    description = description.replace(this.htmlPattern, "");
    description = description.replace(this.nbspPattern, " ");
    description = description.replace("+Info:", " ").trim(); // Remove "+Info" from the end of the description, the urls are already in the "url" property
    description = description.replace("+info:", " ").trim();

    const urls = description.match(this.urlPattern);

    description = description.replace(this.urlPattern, "");
    const url = [...new Set(urls)];

    return {
      title,
      description,
      url,
    };
  }

  /**
   * Parse the events
   *
   * @returns Array of IParsedEvent
   */
  public parse(): IEventResponse {
    const article = this.$("main section")
      .first()
      .children()
      .first()
      .children();

    const eventList: string[][] = [];
    let block: string[] = [];
    let beginBlock = true;

    article.each((_, el) => {
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

    eventList.forEach((item, index) => {
      this.events.push(this.parseItem(item, index));
    });

    this.logResults();

    return {
      tags: this.tags,
      events: this.removeEmpties(this.events),
    };
  }

  private logResults() {
    if (!this.log) return;

    console.group("Events");
    console.log("All: ", this.events.length);
    console.log(
      "Empty: ",
      this.events.length - this.removeEmpties(this.events).length
    );
    console.log("Parsed: ", this.removeEmpties(this.events).length);
    console.groupEnd();
  }
}

export default EventsParser;
