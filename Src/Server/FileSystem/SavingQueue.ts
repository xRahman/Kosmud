/*
  Part of Kosmud

  Keeps track of multiple requests to save the same file.
*/

/*
  Note:
    It would make sense to deduplicate saving requests (beside the one
    currently beeing processed), because resaving the same file multiple
    times probably isn't necessary. But I'm not going to implement it
    right now because it wouldn't be trivial and it will probably be very
    rare scenario anyways.
*/

import { Types } from "../../Shared/Utils/Types";
import { PriorityQueue } from "../../Shared/Class/PriorityQueue";

export class SavingQueue
{
  // ----------------- Private data ---------------------

  private readonly requestQueue =
    new PriorityQueue<Types.ResolveFunction<void>>();

  // ---------------- Public methods --------------------

  // Whoever initiated saving request needs to wait using
  // 'await saveAwaiter(promise)'. See FileSystem.saveAwaiter().
  public async addRequest(): Promise<void>
  {
    return new Promise<void>
    (
      (resolve, reject) => { this.requestQueue.add(resolve); }
    );
  }

  // Removes and returns one item from the start of the queue.
  public pollRequest(): Types.ResolveFunction<void> | "Queue is empty"
  {
    return this.requestQueue.poll();
  }
}