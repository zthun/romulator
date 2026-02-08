import { createGuid, firstDefined } from "@zthun/helpful-fn";
import { isUndefined, omitBy } from "lodash-es";
import { ZJobStatus } from "./job-status.mjs";
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
   * Current status of the job.
   */
  state: {
    /**
     * Status of the job.
     */
    status: ZJobStatus;
    /**
     * The percent completed.
     *
     * If the job does not track completion
     * rates, then this will be 0 while the
     * job is not complete, and 100 when it
     * is complete.  There will be nothing
     * else in-between.
     *
     * This can be a non-0 and non-100 if the
     * job is canceled or failed.  An incomplete
     * job should show the last completion status
     * before finished.
     */
    percent: number;
  };

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
    state: {
      status: ZJobStatus.Idle,
      percent: 0,
    },
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
   * Sets the state of the job.
   *
   * @param status -
   *        The status of the job.
   * @param percent
   *        The total completion percent of the job.  If this is
   *        undefined, then the existing percent is not changed.
   *
   * @returns
   *        This object.
   */
  public state(status: ZJobStatus, percent?: number) {
    this._job.state.status = status;
    this._job.state.percent = firstDefined(this._job.state.percent, percent);

    return this;
  }

  /**
   * Sets the state status to idle and the percent to 0.
   *
   * @returns
   *        This object.
   */
  public idle = this.state.bind(this, ZJobStatus.Idle, 0);

  /**
   * Sets the state status to running.
   *
   * @param percent -
   *        The optional percent to update.  If this is undefined,
   *        then the existing percent is not changed.
   *
   * @returns
   *        This object.
   */
  public running = this.state.bind(this, ZJobStatus.Running);

  /**
   * Sets the state status to canceled.
   *
   * @param percent -
   *        The optional percent to update.  If this is undefined,
   *        then the existing percent is not changed.
   *
   * @returns
   *        This object.
   */
  public canceled = this.state.bind(this, ZJobStatus.Canceled);

  /**
   * Sets the state status to failed.
   *
   * @param percent -
   *        The optional percent to update.  If this is undefined,
   *        then the existing percent is not changed.
   *
   * @returns
   *        This object.
   */
  public failed = this.state.bind(this, ZJobStatus.Failed);

  /**
   * Sets the state status to success and the percent to 100.
   *
   * @returns
   *        This object.
   */
  public success = this.state.bind(this, ZJobStatus.Success, 100);

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
   * information is source of truth for these.  The id is also removed
   * as the file name serves as an id.
   *
   * @returns
   *        This object.
   */
  public redact() {
    delete this._job.id;
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
