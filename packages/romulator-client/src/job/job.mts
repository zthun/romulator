import { createGuid } from "@zthun/helpful-fn";
import { isUndefined, omitBy } from "lodash-es";
import { ZJobType } from "./job-type.mjs";

/**
 * Represents a job in the romulator system.
 */
export interface IZJob {
  /**
   * The id of the job.
   */
  id?: string;

  /**
   * The job type.
   */
  type: ZJobType;

  /**
   * The parameters for the job.
   */
  context?: any;

  /**
   * The creation date of the job.
   */
  createdAt?: string;
}

/**
 * A builder that constructs IZJob instances.
 */
export class ZJobBuilder {
  private _job: IZJob = {
    type: ZJobType.Ping,
  };

  /**
   * Sets the unique identifier for the job.
   *
   * @param val -
   *        Job id.  If this is falsy, then the id
   *        is cleared.
   * @returns
   *        This builder.
   */
  public id(val?: string) {
    this._job.id = val;
    return this;
  }

  /**
   * Sets the id to a new generated guid if the id is not set.
   *
   * @returns
   *        This object.
   */
  public guid() {
    return this._job.id ? this : this.id(createGuid());
  }

  /**
   * Sets the job type.
   *
   * @param val -
   *        The job type.
   * @returns
   *        This builder.
   */
  public type(val: ZJobType) {
    this._job.type = val;
    return this;
  }

  /**
   * Sets the job type to ping.
   *
   * @returns
   *        This object.
   */
  public ping = this.type.bind(this, ZJobType.Ping);

  /**
   * Sets the job type to scrape.
   *
   * @returns
   *        This object.
   */
  public scrape = this.type.bind(this, ZJobType.Scrape);

  /**
   * Sets the job context or parameters.
   *
   * @param val -
   *        Context to attach to the job.
   * @returns
   *        This builder.
   */
  public context(val: any) {
    this._job.context = val;
    return this;
  }

  /**
   * Sets the date and time when the job was created.
   *
   * @param val -
   *        The iso string representation of the job creation date.
   *
   * @returns
   *        This object.
   */
  public createdAt(val?: string) {
    this._job.createdAt = val;
    return this;
  }

  /**
   * Removes information about the job that does not need to be written
   * to a job file.
   *
   * This removes any created and updated date as the file's audit
   * information is source of truth for these.
   *
   * @returns
   *        This object.
   */
  public redact() {
    delete this._job.createdAt;

    return this;
  }

  /**
   * Copies the values from another job into this builder.
   *
   * @param other -
   *        The job to duplicate.
   * @returns
   *        This builder.
   */
  public copy(other: IZJob) {
    this._job = structuredClone(other);
    return this;
  }

  /**
   * Builds a clean IZJob instance with undefined values removed.
   *
   * @returns
   *        The constructed job.
   */
  public build() {
    const clone = structuredClone(this._job);
    return omitBy(clone, isUndefined) as IZJob;
  }
}
