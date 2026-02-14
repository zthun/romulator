/**
 * The status of a job.
 */
export enum ZJobStatus {
  /**
   * Idle, job is not running yet.
   *
   * This is the default state.
   */
  Idle = "idle",

  /**
   * Job is running.
   */
  Running = "running",

  /**
   * Job was canceled.
   *
   * Jobs that were in a running state when the application
   * shuts down will reboot with this status.
   */
  Canceled = "canceled",

  /**
   * Job failed.
   *
   * Try again.
   */
  Failed = "failed",

  /**
   * Job completed successfully.
   */
  Success = "success",
}
