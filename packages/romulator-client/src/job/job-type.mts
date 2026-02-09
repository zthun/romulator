/**
 * Represents the supported job types.
 */
export enum ZJobType {
  /**
   * A quick hello world style job.
   *
   * Will always succeed.  This is
   * just to validate that the job
   * engine is working.
   *
   * Ping has no context and no parameters.
   */
  Ping = "ping",
  /**
   * A scrape job.
   *
   * A scrape job downloads media from
   * a scraper and saves it to the
   * media folder.
   *
   * A scrape job with no context scrapes
   * all systems and games.
   */
  Scrape = "scrape",
}
