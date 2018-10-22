/*
  Part of Kosmud

  Keeps track of multiple requests to save the same file.
*/

/*
  Note:
    It would make sense to 'deduplicate' saving requests (beside the one
    currently beeing processed), because it doesn't make much sense to
    resave the same file multiple times. But I'm not going to implement
    it right now because it wouldn't be trivial and it will probably be
    extremely rare scenario anyways.
*/

import { Types } from "../../Shared/Utils/Types";

export class SavingQueue
{
  // ----------------- Private data ---------------------

  private requestQueue = new Types.PriorityQueue<Types.ResolveFunction<{}>>();

  // ---------------- Public methods --------------------

  // Whoever initiated saving request needs to wait using
  // 'await saveAwaiter(promise)'. See FileSystem.saveAwaiter().
  public addRequest(): Promise<{}>
  {
    return new Promise
    (
      (resolve, reject) => { this.requestQueue.add(resolve); }
    );
  }

  // Removes and returns one item from the start of the queue.
  public pollRequest(): Types.ResolveFunction<{}> | "Queue is empty"
  {
    return this.requestQueue.poll();
  }
}