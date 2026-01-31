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
   * @param val - Job id.
   * @returns This builder.
   */
  public id(val: string) {
    this._job.id = val;
    return this;
  }

  /**
   * Sets the job type.
   *
   * @param val - The job type.
   * @returns This builder.
   */
  public type(val: ZJobType) {
    this._job.type = val;
    return this;
  }

  /**
   * Sets the job context or parameters.
   *
   * @param val - Context to attach to the job.
   * @returns This builder.
   */
  public context(val: any) {
    this._job.context = val;
    return this;
  }

  /**
   * Copies the values from another job into this builder.
   *
   * @param other - The job to duplicate.
   * @returns This builder.
   */
  public copy(other: IZJob) {
    this._job = structuredClone(other);
    return this;
  }

  /**
   * Builds a clean IZJob instance with undefined values removed.
   *
   * @returns The constructed job.
   */
  public build() {
    const clone = structuredClone(this._job);
    return omitBy(clone, isUndefined) as IZJob;
  }
}
